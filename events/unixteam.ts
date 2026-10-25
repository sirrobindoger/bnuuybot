import { Events, GuildMember } from "discord.js";
import { Bot } from "../bot";
import { syncTenure, updateTenure } from "../unixteam";

// Tracks how long each member has had the unix team role, used by /kick and /ban
const UnixTeamTenure = {
    EVENT_NAME: Events.GuildMemberUpdate,
    ON_REGISTER: async () => {
        const guild = Bot.guilds.cache.get(process.env.GUILD_ID || "");
        if (!guild) return;
        await syncTenure(guild);
    },

    ON_FIRE: async (oldMember: GuildMember, newMember: GuildMember) => {
        updateTenure(newMember);
    }
}

export default UnixTeamTenure;
