import { ActionRowBuilder, GuildMemberRoleManager, StringSelectMenuBuilder } from "discord.js";
import { DiscordMenu } from "../bot";

// Label -> Role Name mapping
const notification_roles: { [label: string]: string } = {
    "Bump Reminders": "bmper",
    "Revive Chat Crew (Kitas BFF)": "kita's bff",
    "Event Notifier": "Event Notifier",
};

const EventButton: DiscordMenu = {
    name: "eventbutton",
    channel: "1051218518206578708",

    buildMenu: (channel) => {
        const menu = new StringSelectMenuBuilder()
            .setCustomId("eventbutton")
            .setPlaceholder("What notifications do you want to be pinged about?")
            .setMaxValues(Object.keys(notification_roles).length)
            .addOptions(
                ...Object.keys(notification_roles).map(label => ({
                    label: label,
                    value: label,
                })),
                {
                    label: "Reset",
                    value: "reset",
                    description: "Remove all notification roles",
                }
            );
        const row = new ActionRowBuilder()
            .addComponents(menu);
        return [row];
    },

    onInteraction: async (cmd) => {
        const guild = cmd.guild;
        const member = cmd.member;
        if (!guild || !member || cmd.customId !== "eventbutton") return;

        const memberRoles = member.roles as GuildMemberRoleManager;
        const selectedValues = cmd.values;

        // Check if reset was selected
        if (selectedValues.includes("reset")) {
            // Remove all notification roles
            const rolesToRemove = guild.roles.cache.filter(r => 
                Object.values(notification_roles).includes(r.name)
            );
            memberRoles.remove(rolesToRemove);
            cmd.reply({ content: "All notification roles removed!", ephemeral: true });
            return;
        }

        // Add selected roles
        const roleObjs = selectedValues
            .map(label => guild.roles.cache.find(r => r.name === notification_roles[label]))
            .filter(r => r !== undefined);

        // @ts-ignore
        memberRoles.add(roleObjs);
        cmd.reply({ content: "Notification roles updated!", ephemeral: true });
    }
};

export default EventButton;