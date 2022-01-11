import { ApplicationCommandData, Interaction, CacheType, MessageComponentInteraction } from "discord.js";
import { Command } from "../bot";

const Ping = <Command>{
    GUILD_ID: <String>process.env.GUILD_ID,
    COMMAND_INFO: <ApplicationCommandData>{
        name:"ping",
        description: "It does a meme",
        type:"CHAT_INPUT",

    },
    ON_INTERACTION!: (cmd) => {
        cmd.reply("hello!")
    }
    
}

export default Ping;