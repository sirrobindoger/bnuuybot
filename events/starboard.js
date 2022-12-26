import { EmbedBuilder } from "@discordjs/builders";
import { Embed, Events, MessageReaction, User, Colors } from "discord.js";

import fs from "fs";

const OnMessageReactionStarboard = {
    EVENT_NAME: Events.MessageReactionAdd,

    /**
     * @param {MessageReaction} reaction
     * @param {User} user
    */

    ON_FIRE: async (reaction, user) => {
        // check if reaction was a star
        // get message from reaction
        const msg = reaction.message;
        if (reaction.emoji.name === "⭐") {
            // check if its within the starboard channel
            if (msg.channel.name === "starboard") return;

            // check if it was a bot reaction
            if (user.bot) return;
            // read from staredmessages.json to see if the message has already been starred
            // load via readFileSync
            const staredMessages = JSON.parse(fs.readFileSync("./data/staredmessages.json", "utf8"));

            // check if the message has already been starred
            if (staredMessages[reaction.message.id]) {
                // if it has, get the message in the starboard channel
                const starboardChannel = reaction.message.guild.channels.cache.find(c => c.name === "starboard");
                const starboardMessage = await starboardChannel.messages.fetch(staredMessages[reaction.message.id]);
                
                // edit the message
                const content = ` :star: ***${reaction.count}***`

                starboardMessage.edit({ content: content, embeds: [starboardMessage.embeds[0]] });
                
            }
            else {
                // check if the message has at least 3 stars
                if (reaction.count >= 3) {
                    // if it does, create an embed
                    const content = ` :star: ***${reaction.count}***`
                    const embed = new EmbedBuilder()
                        .setAuthor({name: reaction.message.author.username, iconURL: reaction.message.author.displayAvatarURL()})
                        .setDescription(reaction.message.content)
                        .setTimestamp(reaction.message.createdAt)
                        .setColor(Colors.Gold)
                        .setImage(reaction.message.attachments.first()?.url);
                    console.log(embed);
                    // send the embed to the starboard channel
                    const starboardChannel = reaction.message.guild.channels.cache.find(c => c.name === "starboard");
                    const starboardMessage = await starboardChannel.send({content: content,embeds: [embed], allowedMentions: { parse: [] }});
                    // add the message id to staredmessages.json
                    staredMessages[reaction.message.id] = starboardMessage.id;
                    fs.writeFileSync("./data/staredmessages.json", JSON.stringify(staredMessages, null, 4));
                }
            }
        }

    }

}

export default OnMessageReactionStarboard;