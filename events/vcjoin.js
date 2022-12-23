import { DiscordAPIError, Events, VoiceState } from "discord.js";

const OnVCJoin = {
    EVENT_NAME: Events.VoiceStateUpdate,
    /**
     * 
     * @param {VoiceState} oldState 
     * @param {VoiceState} newState 
     */
    ON_FIRE: (oldState, newState) => {
        console.log("Voice State Update: ");
        console.log(oldState);
        console.log(newState);
        // announce to the guild in main-thread chat that a user has joined a voice channel
        // only announce if the voice channel was previously empty
        if (newState?.channel?.members.size === 1) {
            newState.guild.channels.cache.find(c => c.name === "main-thread").send(`${newState.member.nickname} has joined ${newState.channel.name}!`);
        }
    }
}

export default OnVCJoin;