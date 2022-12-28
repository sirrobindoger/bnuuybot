import { Events, GuildTextBasedChannel, VoiceState } from "discord.js";
import { getChannelByID, getChannelByName } from "../util";

const OnVCJoin = {
    EVENT_NAME: Events.VoiceStateUpdate,
    /**
     * 
     * @param {VoiceState} oldState 
     * @param {VoiceState} newState 
     */
    ON_FIRE: async (oldState : VoiceState, newState : VoiceState) => {
        if (newState?.channel?.members.size === 1) {
            const msg = await getChannelByID(process.env.GENERAL_CHANNEL || "") as GuildTextBasedChannel;
            msg.send(`${newState.member?.displayName} joined the voice channel!`);
            // delete the message after 1 minute
            setTimeout(() => {
                msg.delete();
            } , 1000 * 60);
        }
    }
}

export default OnVCJoin;