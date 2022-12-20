
import {Bot} from "../bot.js";


let i = 0;

const updatePresence = () => {
	// create a list of the word "Hello" in 8 different languages
	const helloWords = ["Hello", "Hola", "Bonjour", "こんにちは", "Hej", "Olá", "你好"];
	// set the presence to the word "Hello" in a different language every 60 seconds
	Bot.user.setPresence({
		activities: [{
			name: `${helloWords[i]}`,
		}]
	});
	// increment the index and reset it if it's greater than the length of the list
	i++;
	if (i >= helloWords.length) {
		i = 0;
	}
	
}
const Ready = {
	EVENT_NAME: "ready",
	ON_FIRE: () => {
		console.log("Hello!");
		// set the presence
		updatePresence();
		// update the presence every 60 seconds
		setInterval(updatePresence, 1000 * 60 * 60);
	}
}

export default Ready;