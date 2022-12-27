import { Events, VoiceState } from "discord.js";
import { getChannelByName } from "../util";

const OnVCJoin = {
    EVENT_NAME: Events.VoiceStateUpdate,
    /**
     * 
     * @param {VoiceState} oldState 
     * @param {VoiceState} newState 
     */
    ON_FIRE: async (oldState, newState) => {
        if (newState?.channel?.members.size === 1) {
            const msg = await getChannelByName("main-thread").send(`${newState.member.displayName} has joined ${newState.channel.name}!`);
            // delete the message after 1 minute
            setTimeout(() => {
                msg.delete();
            } , 1000 * 60);
        }
    }
}

export default OnVCJoin;