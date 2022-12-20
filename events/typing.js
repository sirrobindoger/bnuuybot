import { Events } from "discord.js";

const Typing = {
    EVENT_NAME: Events.TypingStart,
    ON_FIRE: (channel, user) => {
        console.log("h");
    }
}

export default Typing;