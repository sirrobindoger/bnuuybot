import { EmbedBuilder } from "@discordjs/builders";
import { Embed, Events, MessageReaction, User, Colors } from "discord.js";

import { Resource } from "../util.js";
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
            const staredMessages = new Resource("staredmessages.json");

            // check if the message has already been starred
            if (staredMessages.resource[reaction.message.id]) {
                // if it has, get the message in the starboard channel
                const starboardChannel = reaction.message.guild.channels.cache.find(c => c.name === "starboard");
                const starboardMessage = await starboardChannel.messages.fetch(staredMessages.resource[reaction.message.id]);
                
                // edit the message
                const content = ` :star: ***${reaction.count}***`

                starboardMessage.edit({ content: content, embeds: [starboardMessage.embeds[0]] });
                
            }
            else {
                // check if the message has at least 3 stars
                if (reaction.count >= 3 || reaction.message.author.id === "979931438466101308") {
                    // if it does, create an embed
                    const content = ` :star: ***${reaction.count}***`
                    const embed = new EmbedBuilder()
                        .setAuthor({name: reaction.message.author.username, iconURL: reaction.message.author.displayAvatarURL()})
                        .setTitle("Jump to message")
                        .setDescription(reaction.message.content || "No content")
                        .setTimestamp(reaction.message.createdAt)
                        .setColor(Colors.Gold)
                        .setImage(reaction.message.attachments.first()?.url)
                        .setURL(reaction.message.url)
                        .setFooter({text: `#${reaction.message.channel.name}`});
                    // send the embed to the starboard channel
                    const starboardChannel = reaction.message.guild.channels.cache.find(c => c.name === "starboard");
                    const starboardMessage = await starboardChannel.send({content: content,embeds: [embed], allowedMentions: { parse: [] }});
                    // add the message id to staredmessages.json
                    staredMessages.resource[reaction.message.id] = starboardMessage.id;
                    staredMessages.save();
                }
            }
        }

    }

}

export default OnMessageReactionStarboard;