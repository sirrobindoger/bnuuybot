import { ApplicationCommandOptionType, ApplicationCommandType, GuildMember, PermissionFlagsBits } from "discord.js";
import { DiscordCommand } from "../bot";

const KickCommand : DiscordCommand = {
    GUILD_ID: process.env.GUILD_ID!,
    COMMAND_INFO: {
        name: "kick",
        description: "Kicks a member from the server",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: "user",
                description: "The user to kick",
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: "reason",
                description: "The reason for the kick",
                type: ApplicationCommandOptionType.String,
                required: false
            }
        ],
        defaultMemberPermissions: PermissionFlagsBits.KickMembers
    },

    ON_INTERACTION: async (cmd) => {
        // get the member to kick
        const member = cmd.options.getMember("user") as GuildMember;
        const reason = cmd.options.getString("reason") || "No reason provided";

        if (!member) {
            cmd.reply({ content: "Member not found!", ephemeral: true });
            return;
        }

        // DM the member
        await member.send(`You were kicked from ${member.guild.name} for ${reason}`);

        // kick the member
        await member.kick(reason);

        // reply to the command
        cmd.reply({ content: `Kicked ${member} for ${reason}`, ephemeral: false });
    }
}

export default KickCommand;