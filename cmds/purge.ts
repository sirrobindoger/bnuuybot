import { ApplicationCommandOptionType, ApplicationCommandType, GuildTextBasedChannel, PermissionsBitField } from "discord.js";
import { DiscordCommand } from "../bot";

const PurgeCommand : DiscordCommand = {
    COMMAND_INFO: {
        name: "purge",
        description: "Deletes a specified amount of messages from the channel the command is used in.",
        type: ApplicationCommandType.ChatInput,
        defaultMemberPermissions: PermissionsBitField.Flags.ManageChannels,
        options: [
            {
                name: "amount",
                description: "The amount of messages to delete.",
                type: ApplicationCommandOptionType.Integer,
                required: true
            },
            {
                name: "user",
                description: "The user to delete messages from.",
                type: ApplicationCommandOptionType.User,
                required: false
            }
        ]
    },
    ON_INTERACTION: async (interaction) => {
        // get the amount of messages to delete
        const amount = interaction.options.getInteger("amount")!;
        // get the user to delete messages from
        const user = interaction.options.getUser("user");
        // if the user is not null, delete messages from that user

        // channel
        const channel = interaction.channel as GuildTextBasedChannel;

        if (user) {
            // get the messages
            const messages = await channel.messages.fetch({limit: amount});
            // filter the messages
            const filteredMessages = messages.filter(message => message.author.id === user.id);
            // delete the messages
            await channel.bulkDelete(filteredMessages);
        } else {
            // delete the messages
            await channel.bulkDelete(amount);
        }

        // send a message saying the messages were deleted
        await interaction.reply(`Deleted ${amount} messages.`);
    }

}

export default PurgeCommand;