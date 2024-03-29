import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";

import { DateTime } from "luxon";
import { DiscordCommand } from "../bot";
import {Resource} from "../util"

const GetTime : DiscordCommand = {
    COMMAND_INFO: {
        name: "gettime",
        description: "Gets the time of a user",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: "user",
                description: "The user to get the time of, defaults to you if not specified",
                required: false,
                type: ApplicationCommandOptionType.User
            }
        ]
    },
    ON_INTERACTION: async (cmd) => {
        // read the timezones from fs
        const timezones = new Resource("timezones.json");

        // get the user from the command
        const user = cmd.options.getUser("user") || cmd.user;

        // get the timezone of the user
        const timezone = timezones.resource[user.id];

        // if the timezone doesn't exist, tell them
        if (!timezone) {
            cmd.reply({ content: "This user has not set their timezone, they must use /setime to do so!", ephemeral: true });
            return;
        }

        // get the current time in the timezone
        const time = DateTime.local().setZone(timezone).toLocaleString(DateTime.TIME_SIMPLE);

        // tell them the time
        cmd.reply({ content: `${user.username}'s time is ${time}`, ephemeral: false });
    }
}

export default GetTime;