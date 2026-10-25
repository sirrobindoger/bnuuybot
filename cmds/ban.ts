import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { DiscordCommand } from "../bot";
import { moderate } from "../unixteam";

const BanCommand : DiscordCommand = {
    GUILD_ID: process.env.GUILD_ID!,
    COMMAND_INFO: {
        name: "ban",
        description: "Bans a user from the server (unix team, 3 kicks/bans per 24h)",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: "user",
                description: "The user to ban",
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: "reason",
                description: "The reason for the ban",
                type: ApplicationCommandOptionType.String,
                required: false
            }
        ],
        // visible to everyone so unix team can use it, permissions are checked in moderate()
        defaultMemberPermissions: null
    },

    ON_INTERACTION: (cmd) => moderate(cmd, "ban")
}

export default BanCommand;
