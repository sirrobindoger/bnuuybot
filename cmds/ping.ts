import { ApplicationCommandType } from "discord.js";
import { DiscordCommand } from "../bot";

const Ping : DiscordCommand = {
    //GUILD_ID: process.env.GUILD_ID,
    COMMAND_INFO: {
        name:"ping",
        description: "It does a meme",
        type: ApplicationCommandType.ChatInput,

    },
    ON_INTERACTION: async (cmd) => {
        cmd.reply("hello!")
    }
    
}

export default Ping;