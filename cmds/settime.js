import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import {DateTime} from "luxon";
import fs from "fs";

const SetTime = {
    IS_DISABLED: false,
    COMMAND_INFO: {
        name: "settime",
        description: "Sets your time for others to read from!",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: "timezone",
                description: "Enter a timezone, E.X (EST or America/New_York",
                require: true,
                type: ApplicationCommandOptionType.String
            }
        ]
    },
    ON_INTERACTION: (cmd) => {
        const timezone = cmd.options.getString("timezone");
        // check if the timezone is valid

        // load dat/timezones.json from fs
        const timezones = JSON.parse(fs.readFileSync("./data/timezones.json"));

        if (!DateTime.local().setZone(timezone).isValid) {
            cmd.reply({ content: "Invalid timezone", ephemeral: true });
            return;
        }

        timezones[cmd.user.id] = timezone;

        // save the timezones to fs
        fs.writeFileSync("./data/timezones.json", JSON.stringify(timezones));

        // get the current time in the timezone
        const time = DateTime.local().setZone(timezone).toLocaleString(DateTime.TIME_SIMPLE);

        // tell them that the timezone was set
        cmd.reply({ content: `Timezone set to ${timezone}, your current time is ${time}`, ephemeral: true });
    }
}

export default SetTime;