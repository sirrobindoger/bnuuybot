import {REST} from "@discordjs/rest";
import assert from "assert";
import {Routes, } from "discord-api-types/v9";
import Discord, { ApplicationCommandData, CacheType, Intents, Interaction } from "discord.js";
import fs from "fs";
import dotenv from "dotenv";

// load env
dotenv.config();

export interface Command {
    CLIENT_ID? : string
    GUILD_ID : string
    COMMAND_INFO : ApplicationCommandData
    ON_INTERACTION : (cmd: Interaction<CacheType>) => {}
}

assert(process.env.TOKEN, "Token not found!");
const rest = new REST({version:'9'}).setToken(process.env.TOKEN);
const commands = new Map<String, Command>()

export const Bot = new Discord.Client({intents:[
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGES
]});


const CommandsInit = async () => {
    fs.readdirSync("./cmds/").forEach(async file => {
        const cmd = await import("./cmds/"+file.replace(".ts", ".js"))
        const handle : Command = cmd.default;
        commands.set(handle.COMMAND_INFO.name, handle);
        Bot.application?.commands.create(handle.COMMAND_INFO, handle.GUILD_ID)
    })
}

Bot.on("ready", () => {
    console.log(`Logged in as ${Bot?.user?.tag}`);
    CommandsInit()
})

Bot.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;

    if (commands.has(interaction.commandName)) {
        await commands.get(interaction.commandName)?.ON_INTERACTION(interaction);
        
    }
})

Bot.login(process.env.TOKEN);