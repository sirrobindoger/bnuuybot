import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import {DateTime} from "luxon";
import { DiscordCommand } from "../bot";
import {Resource} from "../util";


const SetTime : DiscordCommand = {
    IS_DISABLED: false,
    COMMAND_INFO: {
        name: "settime",
        description: "Sets your time for others to read from!",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: "timezone",
                description: "Enter a timezone, E.X (EST or America/New_York",
                required: true,
                type: ApplicationCommandOptionType.String
            }
        ]
    },
    ON_INTERACTION: async (cmd) => {
        const timezone = cmd.options.getString("timezone") || "";
        // check if the timezone is valid

        // load dat/timezones.json from fs
        const timezones = new Resource("timezones.json");

        if (!DateTime.local().setZone(timezone).isValid) {
            cmd.reply({ content: "Invalid timezone", ephemeral: true });
            return;
        }

        timezones.resource[cmd.user.id] = timezone;

        // save the timezones to fs
        timezones.save();

        // get the current time in the timezone
        const time = DateTime.local().setZone(timezone).toLocaleString(DateTime.TIME_SIMPLE);

        // tell them that the timezone was set
        cmd.reply({ content: `Timezone set to ${timezone}, your current time is ${time}`, ephemeral: true });
    }
}

export default SetTime;