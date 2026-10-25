import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { DiscordCommand } from "../bot";
import { moderate } from "../unixteam";

const KickCommand : DiscordCommand = {
    GUILD_ID: process.env.GUILD_ID!,
    COMMAND_INFO: {
        name: "kick",
        description: "Kicks a member from the server (unix team, 3 kicks/bans per 24h)",
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
        // visible to everyone so unix team can use it, permissions are checked in moderate()
        defaultMemberPermissions: null
    },

    ON_INTERACTION: (cmd) => moderate(cmd, "kick")
}

export default KickCommand;
