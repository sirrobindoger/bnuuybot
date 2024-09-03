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
        let love = Math.floor(Love() * 100);
        
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
        if (person1!.id == "979931438466101308" && person2!.id == "231951310734360577" || person1!.id == "231951310734360577" && person2!.id == "979931438466101308") {
            love = 0;
            loveemote = "no.";
        }

        // if person1.username and person1.username is "sirro" and "molokov_cocktail", then set love = 1000, loveemote = ":star2:"
        //await interaction.reply(`** ${person1!.username} ** x ** ${person2!.username} ** : **${love}%** ${loveemote}`);

        if (person1!.username == "sirro" && person2!.username == "molokov_cocktail" || person1!.username == "molokov_cocktail" && person2!.username == "sirro") {
            love = 1000;
            loveemote = ":heart_eyes:";
        }

        await interaction.reply(`** ${person1!.username} ** x ** ${person2!.username} ** : **${love}%** ${loveemote}`);
    }
}

export default LoveCalc;