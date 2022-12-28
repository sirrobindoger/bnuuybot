import assert from "assert";
import Discord, {ChatInputCommandInteraction, Events, GatewayIntentBits} from "discord.js";
import fs from "fs";
import dotenv from "dotenv";

// load env
dotenv.config();



assert(process.env.TOKEN, "Token not found!");
const commands : {[key: string]: DiscordCommand} = {};
const events : {[key: string]: DiscordEvent} = {};
const menus : {[key: string]: any} = {};

export type DiscordCommand = {
	COMMAND_INFO: Discord.ApplicationCommandData;
	GUILD_ID?: string;
	IS_DISABLED?: boolean;
	ON_INTERACTION: (interaction: ChatInputCommandInteraction) => Promise<void>;
};

export type DiscordEvent = {
	EVENT_NAME: keyof Events;
	ON_FIRE: (args: any) => Promise<void>;
}



export const Bot = new Discord.Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.MessageContent
	],
});

const CommandsInit = async () => {
	fs.readdirSync("./cmds/").forEach(async (file) => {
		const cmd = await import("./cmds/" + file);
		const handle = cmd.default;
		// if handle.IS_DISABLED is true, skip
		if (handle.IS_DISABLED) return;
		commands[handle.COMMAND_INFO.name] = handle;
		await Bot.application?.commands.create(handle.COMMAND_INFO, handle.GUILD_ID);
		console.log("Registered Command: " + handle.COMMAND_INFO.name);
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
			console.log("Registered Event: " + handle.EVENT_NAME);
		} else {
			await handle.ON_FIRE();
		}
	});
};

// const MenusInit = async () => {
// 	fs.readdirSync("./menus/").forEach(async (file) => {
// 		const cmd = await import("./menus/" + file);
// 		const handle = cmd.default;
// 		menus[handle.info.name] = handle;
// 		// find channel by name
// 		const channel : TextChannel = getChannelByName(handle.info.channel);
// 		if (!channel) return;
// 		const rows = handle.buildMenu(channel);
// 		// get message from message ID "1053135399750467595" and edit it with the new rows
// 		const msg = await channel.messages.fetch(handle.info.message);
// 		msg.edit({ components: rows });

// 	});
// };


Bot.on(Events.InteractionCreate, async (interaction) => {
	if (interaction.isCommand() && commands[interaction.commandName]) {
		await commands[interaction.commandName]?.ON_INTERACTION(interaction as ChatInputCommandInteraction);
	}

	if (interaction.isAnySelectMenu()) {
		// iterate over menus
		for (const key of Object.keys(menus)) {
			await menus[key].ON_INTERACTION(interaction);
		}
	}
	
});

Bot.on("ready", async () => {
	CommandsInit();
	EventsInit();
	// MenusInit();
})

Bot.login(process.env.TOKEN);
