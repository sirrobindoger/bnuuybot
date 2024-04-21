import { ApplicationCommandOptionType, ApplicationCommandType, Colors, GuildTextBasedChannel, PermissionFlagsBits } from "discord.js";
import { DiscordCommand } from "../bot";
import fs from "fs-extra";
import path from "path";
import ffmpeg from "fluent-ffmpeg";

const Vox : DiscordCommand = {
    GUILD_ID: process.env.GUILD_ID!,
    COMMAND_INFO: {
        name: "vox",
        description: "Create a vox line",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: "content",
                description: "Vox string",
                required: true,
                type: ApplicationCommandOptionType.String
            }
        ],
    },

    ON_INTERACTION: async (cmd) => {
        await cmd.deferReply();

        // Navigate up one directory to get to the root, then to 'data/vox'
        const voxPath = path.join(__dirname, '..', 'data', 'vox');
        // Navigate up one directory to get to the root, then to 'data/vox-results'
        const resultsPath = path.join(__dirname, '..', 'data', 'vox-results');
        fs.ensureDirSync(resultsPath); // Ensure the results directory exists

        const content = cmd.options.getString("content", true);
        const rawString = content.split(" ");
        let commandAudioFiles = [];
        let voxFileTitle = "";

        for (const voxString of rawString) {
            const filePath = path.join(voxPath, `${voxString}.wav`);
            if (fs.existsSync(filePath)) {
                commandAudioFiles.push(filePath);
                voxFileTitle += `_${voxString}`;
            }
        }

        if (commandAudioFiles.length > 0) {
            const outputFilePath = path.join(resultsPath, `${voxFileTitle}.wav`);

            const audioMerge = ffmpeg();
            commandAudioFiles.forEach(file => audioMerge.input(file));
            audioMerge
                .on('error', function (err : Error) {
                    console.log('An error occurred: ' + err.message);
                    cmd.editReply("Error processing audio files.");
                })
                .on('end', async function () {
                    console.log('Audio file has been created successfully.');
                    await cmd.editReply({ files: [outputFilePath] });
                    fs.remove(outputFilePath); // Clean up the created file
                })
                .mergeToFile(outputFilePath, resultsPath);

        } else {
            await cmd.editReply("Audio failed, no vox strings detected.");
        }
    }


}

export default Vox;