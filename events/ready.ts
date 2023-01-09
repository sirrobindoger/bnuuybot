
import {Bot} from "../bot";
import query from "gamedig"

export let IsServerOnline = false;

let i = 0;
let currPlayers = 0;
const updatePresence = async () => {
	const presence = new query();
	try{
		const data = await presence.query({
			type: "minecraft",
			host: process.env.SERVER_IP!,
		});

		const players = data.players.length;
		const maxPlayers = data.maxplayers;

		const status = players === 0 ? "idle" : "online";
		// if the player count is the same as the last time we checked, don't update the presence
		if (currPlayers === players) {
			return;
		}
		Bot.user?.setPresence({
			activities: [
				{
					name: `Online ${players}/${maxPlayers} Players`,
				}
			],
			status: status
		});
		currPlayers = players;
		IsServerOnline = true;
	} catch (e) {
		const status = "dnd";
		Bot.user?.setPresence({
			activities: [
				{
					name: "Server Offline",
				}
			],
			status: status
		});
		IsServerOnline = false;
	}
}
const Ready = {
	EVENT_NAME: "ready",
	ON_FIRE: async () => {
		// set the presence
		await updatePresence();
		// update the presence every 60 seconds
		setInterval(updatePresence, 1000 * 60 * 60);
	}
}

export default Ready;