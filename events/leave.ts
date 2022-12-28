import { Events, GuildMember, GuildTextBasedChannel } from "discord.js";
import { getChannelByID } from "../util";

const Leave = {
    EVENT_NAME: Events.GuildMemberRemove,
    ON_FIRE: async (member : string) => {
        // get channel "enter-exit" from the guild "unixcore"
        const channel = getChannelByID(process.env.ENTER_EXIT_CHANNEL || "") as GuildTextBasedChannel;
        // if the channel doesn't exist, return
        if (!channel) return;
        // send a message to the channel
        channel.send(`:red_square: ${member} left the server :(`);
    }
}

export default Leave;