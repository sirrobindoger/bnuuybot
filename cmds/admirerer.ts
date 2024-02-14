import { ApplicationCommandOptionType, ApplicationCommandType, Colors, Embed, EmbedBuilder, GuildTextBasedChannel, PermissionFlagsBits } from "discord.js";
import { DiscordCommand } from "../bot";
import { Resource, getChannelByName } from "../util";


const Admierer : DiscordCommand = {
    GUILD_ID: process.env.GUILD_ID!,
    COMMAND_INFO: {
        name: "admire",
        description: "Admire someone",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: "user",
                description: "Who do you wana (secretly) admire?",
                required: true,
                type: ApplicationCommandOptionType.User
            },
            {
                name: "message",
                description: "A nice message for them!",
                required: true,
                type: ApplicationCommandOptionType.String
            }
        ],
        defaultMemberPermissions: PermissionFlagsBits.KickMembers
    },

    ON_INTERACTION: async (cmd) => {
        const AdmirerDB = new Resource("admirer.json");

        // How this works:
        // admirer.json is a JSON object 
        //      [userid]: {
        //          [admired]: "userid",
        //      }

        // If user already admired someone, we tell them they already did and exit

        const user = cmd.options.getUser("user");
        const message = cmd.options.getString("message") || "";

        AdmirerDB.resource[cmd.user.id] = AdmirerDB.resource[cmd.user.id] || {};

        if (AdmirerDB.resource[cmd.user.id]?.admired ) {
            cmd.reply({ content: "Hey!! You already admired someone, pleas wait to do that again ehe", ephemeral: true });
            return;
        }
        
        AdmirerDB.resource[cmd.user.id].admired = user!.id;

        AdmirerDB.save();

        cmd.reply({ content: `Okay!! I sent them a message and posted it to #secret-admirer :D I hope they like your message!`, ephemeral: true });

        const channel = await getChannelByName("secret-admirer") as GuildTextBasedChannel;

        const embedMessage = new EmbedBuilder();

        embedMessage
            .setTitle(`**Someone** wrote a message for **${user?.username}**!`)
            .setDescription("```" + message + "```")
            .setTimestamp()
            .setThumbnail("https://cdn.discordapp.com/attachments/1051216641494634638/1207123343971713024/Screenshot_2024-02-13_at_19.37.04.png?ex=65de8038&is=65cc0b38&hm=c63cd718e972749cdf81d608bac812afd30f628d0a228bc3e522ae46cb07e8cf&")
            .setColor(Colors.LuminousVividPink);

        const admireMessage = await channel.send({ embeds: [embedMessage], allowedMentions: { parse: [] } });

        // dm the target user that they have a secret admirer
        try {
            user?.send({ content: `Hey!! Someone wrote a message for you! Check it out in ${admireMessage.url}!` });
        } catch (e) {
            console.error(e);
        }

    }
}

export default Admierer;