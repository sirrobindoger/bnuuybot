import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
import { DiscordCommand } from "../bot";
import { Resource } from "../util";

const Register : DiscordCommand = {
    //GUILD_ID: process.env.GUILD_ID,
    COMMAND_INFO: {
        name:"register",
        description: "Register a new account to the minecraft server",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: "username",
                description: "The username you want to register",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    ON_INTERACTION: async (cmd) => {
        const username = cmd.options.getString("username", true);
        
        const userNameDB = new Resource("mcusers.json");
  
        if (userNameDB.get(cmd.user.id)) {
            cmd.reply({ephemeral: true, content: `You already have a registered username: \`${userNameDB.get(cmd.user.id)}\``});
            return;
        }

        userNameDB.set(cmd.user.id, username);

        cmd.reply({ephemeral: true, content: `Registered \`${username}\``});
    }
}

export default Register;