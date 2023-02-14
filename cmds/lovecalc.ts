import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { DiscordCommand } from "../bot";
import random from "seedrandom";
import seedrandom from "seedrandom";
const LoveCalc : DiscordCommand =  {
    COMMAND_INFO: {
        name: "lovecalc",
        description: "Calculate the love between two people",
        options: [
            {
                name: "person1",
                description: "The first person",
                type:ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: "person2",
                description: "The second person",
                type:ApplicationCommandOptionType.User,
                required: true
            }
        ],
        type: ApplicationCommandType.ChatInput
    },
    ON_INTERACTION : async (interaction) => {
        const person1 = interaction.options.getUser("person1");
        const person2 = interaction.options.getUser("person2");

        const Love = seedrandom(person1!.id + person2!.id);
        // get a random number between 0 and 100
        const love = Math.floor(Love() * 100);
        
        let loveemote = ":heart:"
        // use different heart emoji based on the love percentage
        if (love < 20) {
            loveemote = ":broken_heart:";
        } else if (love < 40) {
            loveemote = ":heart_exclamation:";
        } else if (love < 60) {
            loveemote = ":heart:";
        } else if (love < 80) {
            loveemote = ":sparkling_heart:";
        } else {
            loveemote = ":heart_eyes:";
        }

        await interaction.reply(`** ${person1!.username} ** x ** ${person2!.username} ** : **${loveemote}%** :heart:`);
    }
}

export default LoveCalc;