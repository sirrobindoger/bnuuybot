import { ApplicationCommandType } from "discord.js";

const Ping = {
    GUILD_ID: process.env.GUILD_ID,
    COMMAND_INFO: {
        name:"ping",
        description: "It does a meme",
        type: ApplicationCommandType.ChatInput,

    },
    ON_INTERACTION: (cmd) => {
        cmd.reply("hello!")
    }
    
}

export default Ping;