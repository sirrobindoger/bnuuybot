import { GuildMember, PermissionFlagsBits } from "discord.js";
import { DiscordCommand } from "../bot";

/**
 * @Author Sirro
 * 
 * @Description
 *  Prune user accounts under spesific paramters, and ban them if given the option.
 */
const UserScan : DiscordCommand = {
    GUILD_ID: process.env.GUILD_ID!,
    COMMAND_INFO: {
        name: "userscan",
        description: "Prune user accounts under spesific paramters, and ban them if given the option.",
        type: 1,
        options: [
            {
                name: "days",
                description: "The number of days to scan back",
                type: 4,
                required: true
            },
            {
                name: "ban",
                description: "Whether or not to ban the users",
                type: 5,
                required: false
            }
        ],
        defaultMemberPermissions: PermissionFlagsBits.Administrator
    },

    ON_INTERACTION: async (cmd) => {
        // Get collection of users with in guild

        const GuildMembers = await cmd.guild!.members.fetch();

        // Get the number of days to scan back
        const days = cmd.options.getInteger("days");

        // Get the option to ban the users
        const ban = cmd.options.getBoolean("ban");
        
        // Collection of positive matches
        const positiveMatches = new Array<GuildMember>();

        // Iterate through the collection of users
        // For good measure we'll also check if their discord registration date is less than a month
        GuildMembers.forEach(async (member) => {
            if (member.user.createdTimestamp > Date.now() - (30 * 86400000)) {
                positiveMatches.push(member);
            }
        });

        // Print match count to inetraction
        cmd.reply(`Found ${positiveMatches.length} users that match the criteria. ${ban ? "Banning them now..." : ""}\n\n${positiveMatches.map(member => member.user.tag).join("\n")}`);

        // ban them
        if (ban)
            positiveMatches.forEach(async member => member.kick("pruned by user scan"))
    }
}

export default UserScan;