import { DiscordAPIError, Events, VoiceState } from "discord.js";

const OnVCJoin = {
    EVENT_NAME: Events.VoiceStateUpdate,
    /**
     * 
     * @param {VoiceState} oldState 
     * @param {VoiceState} newState 
     */
    ON_FIRE: async (oldState, newState) => {
        console.log("Voice State Update: ");
        console.log(oldState);
        console.log(newState);
        // announce to the guild in main-thread chat that a user has joined a voice channel
        // only announce if the voice channel was previously empty
        if (newState?.channel?.members.size === 1) {
            const msg = await newState.guild.channels.cache.find(c => c.name === "main-thread").send(`${newState.member.nickname} has joined ${newState.channel.name}!`);
            // delete the message after 1 minute
            setTimeout(() => {
                msg.delete();
            } , 1000 * 60);
        }
    }
}

export default OnVCJoin;