import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js"
import { DiscordCommand } from "../bot";

const Avatar : DiscordCommand = {
    COMMAND_INFO: {
        name:"avatar",
        description: "It shows your or target user avatar",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: "user",
                description: "The user",
                required: false,
                type: ApplicationCommandOptionType.User
            }
        ]

    },
    ON_INTERACTION: async (cmd) => {
        // if no user is specified, use the author
        const user = cmd.options.getUser("user") || cmd.user;
        // send the avatar url
        cmd.reply(user.displayAvatarURL());
    }
    
}

export default Avatar;