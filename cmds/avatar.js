import { ApplicationCommandType } from "discord.js"

const Avatar = {
    GUILD_ID: process.env.GUILD_ID,
    COMMAND_INFO: {
        name:"avatar",
        description: "It shows your or target user avatar",
        options: [
            {
                name: "user",
                description: "The user",
                type: ApplicationCommandType.User,
                required: false
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