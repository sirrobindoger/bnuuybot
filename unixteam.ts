import { ChatInputCommandInteraction, Guild, GuildMember, PermissionFlagsBits } from "discord.js";
import { DateTime } from "luxon";
import { Resource } from "./util";

export const UNIX_TEAM_ROLE_NAME = "unix team";
const REQUIRED_MONTHS = 3;
const ACTION_LIMIT = 3;
const ACTION_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export type ModAction = "kick" | "ban";

const ACTION_PAST: {[key in ModAction]: string} = { kick: "kicked", ban: "banned" };
const ACTION_PERMISSION = { kick: PermissionFlagsBits.KickMembers, ban: PermissionFlagsBits.BanMembers };

export const getUnixTeamRole = (guild: Guild) => (
    guild.roles.cache.find((role) => role.name === UNIX_TEAM_ROLE_NAME)
);

/**
 * Records when a member got the unix team role, or clears it if they no longer have it.
 * data/unixteam.json looks like { initialized: true, since: { [userId]: timestamp } }
 */
export const updateTenure = (member: GuildMember) => {
    const role = getUnixTeamRole(member.guild);
    if (!role) return;

    const tenure = new Resource("unixteam.json");
    const since = tenure.resource.since ??= {};
    const hasRole = member.roles.cache.has(role.id);

    if (hasRole && since[member.id] === undefined) {
        since[member.id] = Date.now();
    } else if (!hasRole && since[member.id] !== undefined) {
        delete since[member.id];
    } else {
        return;
    }
    tenure.save();
};

/**
 * Rebuilds data/unixteam.json from everyone who has the role right now.
 * On the very first run everyone who already has the role is grandfathered in.
 */
export const syncTenure = async (guild: Guild) => {
    const role = getUnixTeamRole(guild);
    if (!role) return;

    const members = await guild.members.fetch();
    const tenure = new Resource("unixteam.json");
    const since = tenure.resource.since ?? {};
    const start = tenure.resource.initialized ? Date.now() : 0;

    const next: {[key: string]: number} = {};
    for (const member of members.values()) {
        if (member.roles.cache.has(role.id)) {
            next[member.id] = since[member.id] ?? start;
        }
    }

    tenure.resource = { initialized: true, since: next };
    tenure.save();
};

// When the member can start using /kick and /ban. Leaving the server resets the clock since they lose their roles.
const getEligibleAt = (member: GuildMember) => {
    const since = new Resource("unixteam.json").resource.since?.[member.id] ?? Date.now();
    const start = Math.max(since, member.joinedTimestamp ?? 0);
    return DateTime.fromMillis(start).plus({ months: REQUIRED_MONTHS });
};

const getRecentActions = (limits: Resource, userId: string): number[] => (
    (limits.resource[userId] ?? []).filter((time: number) => time > Date.now() - ACTION_WINDOW_MS)
);

// Reserves one of the member's kicks/bans before acting, so two commands at once can't go over the limit
const takeSlot = (userId: string) => {
    const limits = new Resource("modlimits.json");
    const recent = getRecentActions(limits, userId);
    if (recent.length >= ACTION_LIMIT) {
        return { ok: false as const, nextAt: Math.min(...recent) + ACTION_WINDOW_MS };
    }

    const time = Date.now();
    limits.set(userId, [...recent, time]);
    return { ok: true as const, time, left: ACTION_LIMIT - recent.length - 1 };
};

// Gives the slot back if the kick/ban failed
const releaseSlot = (userId: string, time: number) => {
    const limits = new Resource("modlimits.json");
    limits.set(userId, getRecentActions(limits, userId).filter((t) => t !== time));
};

const toTimestamp = (millis: number) => `<t:${Math.floor(millis / 1000)}:R>`;

/**
 * Shared handler for /kick and /ban.
 * Members with the real Kick/Ban Members permission skip the unix team rules.
 * Unix team members need 3 months with the role and get 3 kicks/bans combined per rolling 24 hours.
 */
export const moderate = async (cmd: ChatInputCommandInteraction, action: ModAction): Promise<void> => {
    if (!cmd.inCachedGuild()) return;

    const invoker = cmd.member;
    const user = cmd.options.getUser("user", true);
    const target = cmd.options.getMember("user");
    const reason = cmd.options.getString("reason") || "No reason provided";

    const deny = async (content: string) => {
        await cmd.reply({ content, ephemeral: true });
    };

    if (action === "kick" && !target) return deny("Member not found!");
    if (user.id === invoker.id) return deny(`You can't ${action} yourself.`);
    if (user.id === cmd.client.user.id) return deny(`I'm not going to ${action} myself.`);

    const isStaff = invoker.permissions.has(ACTION_PERMISSION[action]);

    if (!isStaff) {
        const role = getUnixTeamRole(cmd.guild);
        if (!role || !invoker.roles.cache.has(role.id)) {
            return deny(`Only ${UNIX_TEAM_ROLE_NAME} members can use this command.`);
        }

        updateTenure(invoker);
        const eligibleAt = getEligibleAt(invoker);
        if (eligibleAt > DateTime.now()) {
            return deny(`You need to have had the ${UNIX_TEAM_ROLE_NAME} role for ${REQUIRED_MONTHS} months to use this. You'll be able to ${toTimestamp(eligibleAt.toMillis())}.`);
        }

        if (target?.roles.cache.has(role.id)) {
            return deny(`You can't ${action} other ${UNIX_TEAM_ROLE_NAME} members.`);
        }
    }

    if (target) {
        const outranks = invoker.id === cmd.guild.ownerId || invoker.roles.highest.position > target.roles.highest.position;
        if (target.id === cmd.guild.ownerId || !outranks) {
            return deny(`You can't ${action} someone with a role equal to or higher than yours.`);
        }
        if (action === "kick" ? !target.kickable : !target.bannable) {
            return deny(`I don't have permission to ${action} ${target}.`);
        }
    }

    const slot = isStaff ? null : takeSlot(invoker.id);
    if (slot && !slot.ok) {
        return deny(`You've used all ${ACTION_LIMIT} kicks/bans for now. Your next one frees up ${toTimestamp(slot.nextAt)}.`);
    }

    await cmd.deferReply();

    try {
        // DM before removing them, ignore it if their DMs are closed
        await target?.send(`You were ${ACTION_PAST[action]} from ${cmd.guild.name} for ${reason}`).catch(() => {});

        const auditReason = `${reason} (by ${cmd.user.username})`;
        if (action === "kick") {
            await target!.kick(auditReason);
        } else {
            await cmd.guild.members.ban(user, { reason: auditReason });
        }
    } catch (e) {
        console.error(e);
        if (slot) releaseSlot(invoker.id, slot.time);
        await cmd.editReply(`Couldn't ${action} ${user}: ${e}`);
        return;
    }

    const pastTense = ACTION_PAST[action][0].toUpperCase() + ACTION_PAST[action].slice(1);
    const remaining = slot ? `\n-# ${slot.left}/${ACTION_LIMIT} kicks/bans left for ${invoker.displayName} in the next 24h` : "";
    await cmd.editReply(`${pastTense} ${user} for ${reason}${remaining}`);
};
