import assert from "assert";
import Discord, {
	ApplicationCommandData,
	CacheType,
	Intents,
	Interaction,
} from "discord.js";
import fs from "fs";
import dotenv from "dotenv";

// load env
dotenv.config();

export interface Command {
	CLIENT_ID?: string;
	GUILD_ID: string;
	COMMAND_INFO: ApplicationCommandData;
	ON_INTERACTION: (cmd: Interaction<CacheType>) => {};
}

export interface Event {
	EVENT_NAME: string;
	ON_FIRE: (args: any[]) => Discord.Awaitable<void>;
}

assert(process.env.TOKEN, "Token not found!");
const commands = new Map<String, Command>();
const events = new Map<String, Event>();
export const Bot = new Discord.Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGES,
	],
});

const CommandsInit = async () => {
	fs.readdirSync("./cmds/").forEach(async (file) => {
		const cmd = await import("./cmds/" + file.replace(".ts", ".js"));
		const handle: Command = cmd.default;
		commands.set(handle.COMMAND_INFO.name, handle);
		Bot.application?.commands.create(handle.COMMAND_INFO, handle.GUILD_ID);
	});
};

const EventsInit = async () => {
	fs.readdirSync("./events/").forEach(async (file) => {
		const cmd = await import("./events/" + file.replace(".ts", ".js"));
		const handle: Event = cmd.default;
		events.set(handle.EVENT_NAME, handle);
		Bot.on(handle.EVENT_NAME, handle.ON_FIRE);
	});
};


Bot.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) return;

	if (commands.has(interaction.commandName)) {
		await commands.get(interaction.commandName)?.ON_INTERACTION(interaction);
	}
});


CommandsInit();
EventsInit();
Bot.login(process.env.TOKEN);
