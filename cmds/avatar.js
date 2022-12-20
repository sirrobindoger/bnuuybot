import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js"

const Avatar = {
    //GUILD_ID: process.env.GUILD_ID,
    IS_DISABLED: false, 
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
    ON_INTERACTION: (cmd) => {
        // if no user is specified, use the author
        const user = cmd.options.getUser("user") || cmd.user;
        // send the avatar url
        cmd.reply(user.displayAvatarURL());
    }
    
}

export default Avatar;