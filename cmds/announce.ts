import { EmbedBuilder } from "@discordjs/builders";
import { ApplicationCommandOptionType, ApplicationCommandType, Colors, GuildTextBasedChannel, PermissionFlagsBits } from "discord.js";
import { DiscordCommand } from "../bot";
import { getChannelByID } from "../util";

const Announce : DiscordCommand = {
    GUILD_ID: process.env.GUILD_ID!,
    COMMAND_INFO: {
        name: "announce",
        description: "Announces a message to a channel",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: "content",
                description: "The content of the announcement",
                required: true,
                type: ApplicationCommandOptionType.String
            },
            {
                name: "channel",
                description: "The channel to send the announcement to",
                required: false,
                type: ApplicationCommandOptionType.Channel
            },
            {
                name: "attachment",
                description: "The attachment of the announcement",
                required: false,
                type: ApplicationCommandOptionType.Attachment
            },
            {
                name: "noembed",
                description: "Whether or not the announcement should be embedded",
                required: false,
                type: ApplicationCommandOptionType.Boolean
            }
        ],
        // only allow admins to use this command
        defaultMemberPermissions: PermissionFlagsBits.Administrator
    },

    ON_INTERACTION: async (cmd) => {
        // get annonucement channel object
        const channel = await getChannelByID(cmd.options.getChannel("channel")?.id || process.env.ANNOUNCEMENTS_CHANNEL!) as GuildTextBasedChannel;

        if (!channel) {
            cmd.reply({ content: "Announcement channel not found!", ephemeral: true });
            return;
        }

        // get the content of the announcement
        const content = cmd.options.getString("content");
        const attachment = cmd.options.getAttachment("attachment");
        const noembed = cmd.options.getBoolean("noembed");

        // build the message content
        const msgContent : {embeds?: [EmbedBuilder], content?: string} = {};

        
        if (!noembed) {
            // build the embed
            const embed = new EmbedBuilder()
            .setTitle("Announcement")
            .setDescription(content)
            .setColor(Colors.Gold)
            .setTimestamp();
            if (attachment) embed
            .setImage(attachment.url);
            msgContent.embeds = [embed];
        } else {
            msgContent.content = content!;
        }
        
        // send the announcement
        channel.send({ ...msgContent });

        // tell the user that the announcement was sent
        cmd.reply({ content: "Announcement sent!", ephemeral: false });
    }


}

export default Announce;