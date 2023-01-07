import { ActionRowBuilder, GuildMemberRoleManager, StringSelectMenuBuilder } from "discord.js";
import { DiscordMenu } from "../bot";

const EventButton : DiscordMenu = {
    name: "eventbutton",
    channel: "1051218518206578708",

    buildMenu: (channel) => {
        const menu = new StringSelectMenuBuilder()
            .setCustomId("eventbutton")
            .setPlaceholder("Would you like to be notified of events?")
            .addOptions(
                {
                    label: "Yes",
                    value: "yes",
                    description: "Select this to be notified of events",
                },
                {
                    label: "No",
                    value: "no",
                    description: "Select this to not be notified of events",
                }
            )
        const row = new ActionRowBuilder()
            .addComponents(menu);
        return [row];
    },

    onInteraction: async (cmd) => {
        // get the option the user selected
        const option = cmd.values[0];
        // get the guild and member
        const guild = cmd.guild;
        const member = cmd.member;
        if (!guild || !member) return;

        const memberRoles = member.roles as GuildMemberRoleManager;

        // check if the user selected yes
        if (option === "yes") {
            // add the role
            memberRoles.add(guild.roles.cache.filter(r => r.name === "Event Notifer"));
            // reply to user with message only visible to them
            cmd.reply({ content: "You will now be notified of events!", ephemeral: true });
        } else {
            // remove the role
            memberRoles.remove(guild.roles.cache.filter(r => r.name === "Event Notifer"));
            // reply to user with message only visible to them
            cmd.reply({ content: "You will no longer be notified of events!", ephemeral: true });
        }

    }

}

export default EventButton;