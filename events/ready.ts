import { Event } from "../bot";

const Ready = <Event>{
	EVENT_NAME: "ready",
	ON_FIRE: () => {
		console.log("Hello!");
	}
}

export default Ready;