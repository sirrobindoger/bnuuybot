import { ApplicationCommandType, Colors, EmbedBuilder } from "discord.js";
import { DiscordCommand } from "../bot";
import Query from "gamedig";

const StatusCommand : DiscordCommand = {
    COMMAND_INFO: {
        name: "status",
        description: "Get the status of the server",
        type: ApplicationCommandType.ChatInput,
    },

    ON_INTERACTION: async (interaction) => {
        const query = new Query();
        const embedResponse = new EmbedBuilder();
        try {
            const data = await query.query({
                type: "minecraft",
                host: process.env.SERVER_IP!,
            });
            const players = data.players;
            const maxPlayers = data.maxplayers;
            embedResponse
                .setTitle(`Online ${players.length}/${maxPlayers} | \`${process.env.SERVER_IP!}\``)
                .setDescription(`\`\`\`${
                    (players.length) ? players.map(player => player.name) : "No Players Online"
                }\`\`\``)
                .setColor(Colors.Gold)
                .setTimestamp();
        } catch (e) {
            embedResponse
                .setTitle("Server Offline")
                .setColor(Colors.Red)
                .setTimestamp()
        }
        await interaction.reply({embeds: [embedResponse]});
    }
}

export default StatusCommand;