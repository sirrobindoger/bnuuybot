import assert from "assert";
import Discord, {Events, GatewayIntentBits} from "discord.js";
import fs from "fs";
import dotenv from "dotenv";

// load env
dotenv.config();



assert(process.env.TOKEN, "Token not found!");
const commands = {};
const events = {};
const menus = {};

export const Bot = new Discord.Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildPresences,
	],
});

const CommandsInit = async () => {
	fs.readdirSync("./cmds/").forEach(async (file) => {
		const cmd = await import("./cmds/" + file);
		const handle = cmd.default;
		// if handle.IS_DISABLED is true, skip
		if (handle.IS_DISABLED) return;
		commands[handle.COMMAND_INFO.name] = handle;
		const cmdOut = await Bot.application?.commands.create(handle.COMMAND_INFO, handle.GUILD_ID);
		console.log("Registered Command: ");
		console.log(handle);
	});
};

const EventsInit = async () => {
	fs.readdirSync("./events/").forEach(async (file) => {
		const cmd = await import("./events/" + file);
		const handle = cmd.default;
		if (handle.EVENT_NAME != "ready") {
			events[handle.EVENT_NAME] = handle;
			// check for handle.ON_REGISTER
			if (handle.ON_REGISTER) {
				await handle.ON_REGISTER();
			}
			Bot.on(handle.EVENT_NAME, handle.ON_FIRE);
			console.log("Registered Event: ");
			console.log(handle);
		} else {
			await handle.ON_FIRE();
		}
	});
};

const MenusInit = async () => {
	fs.readdirSync("./menus/").forEach(async (file) => {
		const cmd = await import("./menus/" + file);
		const handle = cmd.default;
		menus[handle.info.name] = handle;
		// find channel by name
		const channel = Bot.channels.cache.find(c => c.name === handle.info.channel);
		const rows = handle.buildMenu(channel);
		// get message from message ID "1053135399750467595" and edit it with the new rows
		const msg = await channel.messages.fetch(handle.info.message);
		await msg.edit({ components: rows });
		console.log("Registered Menu: ");
		console.log(msg);
	});
};


Bot.on(Events.InteractionCreate, async (interaction) => {
	if (interaction.isCommand && commands[interaction.commandName]) {
		await commands[interaction.commandName]?.ON_INTERACTION(interaction);
	}

	if (interaction.isAnySelectMenu) {
		// iterate over menus
		for (const [key, value] of Object.entries(menus)) {
			await menus[key].ON_INTERACTION(interaction);
		}
	}
	
});

Bot.on("ready", async () => {
	CommandsInit();
	EventsInit();
	MenusInit();
})

Bot.login(process.env.TOKEN);
