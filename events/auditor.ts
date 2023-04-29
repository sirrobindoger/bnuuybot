import { Events,GuildChannel, Message } from "discord.js";
import fs from "fs";


const AuditEvent = {
    EVENT_NAME: Events.MessageDelete,
    ON_FIRE: async (message : Message) => {
        // create directory "data/deleted-messages" if it doesn't exist
        if (!fs.existsSync("./data/deleted-messages")) {
            fs.mkdirSync("./data/deleted-messages");
        }

        fs.appendFileSync(`./data/deleted-messages/${message.author?.id}.txt`, `[${message.createdAt.toUTCString()} @ ${(message.channel as GuildChannel).name}]: ${message.content}\n`);

    }
}

export default AuditEvent;