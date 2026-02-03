import { Events, Message, TextChannel } from "discord.js";
import { Bot, DiscordEvent } from "../bot";

const DISBOARD_BOT_ID = "302050872383242240";
const BUMP_CHANNEL_ID = "1051216641494634638";
const BUMP_ROLE_ID = "1468295542814675148";
const BUMP_TIMER_MS = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

const BumpTimer: DiscordEvent = {
    EVENT_NAME: Events.MessageCreate,

    ON_FIRE: async (message: Message) => {
        // Check if the message is from Disboard
        if (message.author.id !== DISBOARD_BOT_ID) return;

        // Check if it's a successful bump message (Disboard sends an embed with "Bump done!" in it)
        const embed = message.embeds[0];
        if (!embed || !embed.description?.toLowerCase().includes("bump done")) return;

        console.log("Bump detected! Starting 2 hour timer...");

        // Start the 2 hour timer
        setTimeout(async () => {
            try {
                const channel = await Bot.channels.fetch(BUMP_CHANNEL_ID) as TextChannel;
                if (channel) {
                    await channel.send(`<@&${BUMP_ROLE_ID}> its time ot bump!`);
                }
            } catch (error) {
                console.error("Failed to send bump reminder:", error);
            }
        }, BUMP_TIMER_MS);
    }
};

export default BumpTimer;
