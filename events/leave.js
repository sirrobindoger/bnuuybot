import { Events } from "discord.js";

const Leave = {
    EVENT_NAME: Events.GuildMemberRemove,
    ON_FIRE: async (member) => {
        console.log("h");
        // get channel "enter-exit" from the guild "unixcore"
        const channel = member.guild.channels.cache.find(ch => ch.name === "enter-exit");
        // if the channel doesn't exist, return
        if (!channel) return;
        // send a message to the channel
        channel.send(`:red_square: ${member} left the server :(`);
    }
}

export default Leave;