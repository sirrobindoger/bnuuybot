import { ApplicationCommandOptionType, ApplicationCommandType, Colors, EmbedBuilder, GuildMemberRoleManager, PermissionFlagsBits } from "discord.js";
import { DiscordCommand } from "../bot";
import {Rcon} from "rcon-client"

const RconCommand : DiscordCommand = {
    COMMAND_INFO: {
        name: "rcon",
        description: "Send a command to the server",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: "command",
                description: "The command to send",
                type:ApplicationCommandOptionType.String,
                required: true
            }
        ],
        defaultMemberPermissions: PermissionFlagsBits.ManageMessages,
    },
    ON_INTERACTION: async (interaction) => {
        const command = interaction.options.getString("command")!;
        const embedResponse = new EmbedBuilder();
        const rcon = new Rcon({
            host: process.env.SERVER_IP!,
            port: 25575,
            password: process.env.SERVER_RCON_PASSWORD!
        });
        // check if they have role to use command
        const memberRoles = interaction.member!.roles as GuildMemberRoleManager;
        if (!memberRoles.cache.has(process.env.MINERAFT_ROLEID!)) {
            embedResponse
                .setTitle("No Permission")
                .setDescription("You do not have permission to use this command!")
                .setColor(Colors.Red)
                .setTimestamp();
            await interaction.reply({embeds: [embedResponse], ephemeral: true});
            return;
        }
        try{
            await rcon.connect();
            const response = await rcon.send(command);
            await rcon.end();
            embedResponse
                .setTitle("Command Output")
                .setDescription(`\`\`\`>${command}\n${response}\`\`\``)
                .setColor(Colors.Green)
                .setTimestamp();
        } catch (e) {
            embedResponse
                .setTitle("Error Occured")
                .setDescription(`\`\`\`${e}\`\`\``)
                .setColor(Colors.Red)
                .setTimestamp();
        }
        await interaction.reply({embeds: [embedResponse]});
    }
}

export default RconCommand;