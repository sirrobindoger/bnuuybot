import { ApplicationCommandOptionType, ApplicationCommandType, ColorResolvable, GuildMember, HexColorString, resolveColor } from "discord.js";
import { DiscordCommand } from "../bot";
import { Resource } from "../util";

const SetRole: DiscordCommand = {
    COMMAND_INFO: {
        name: "setrole",
        description: "Set or update a role with specified name, color, and icon. (Boosters only)",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: "rolename",
                description: "The name of the role",
                required: true,
                type: ApplicationCommandOptionType.String,
            },
            {
                name: "rolecolor",
                description: "The color of the role",
                required: true,
                type: ApplicationCommandOptionType.String,
                choices: [
                    { name: "White", value: "White" },
                    { name: "Aqua", value: "Aqua" },
                    { name: "Green", value: "Green" },
                    { name: "Blue", value: "Blue" },
                    { name: "Yellow", value: "Yellow" },
                    { name: "Purple", value: "Purple" },
                    { name: "Luminous Vivid Pink", value: "LuminousVividPink" },
                    { name: "Fuchsia", value: "Fuchsia" },
                    { name: "Gold", value: "Gold" },
                    { name: "Orange", value: "Orange" },
                    { name: "Red", value: "Red" },
                    { name: "Grey", value: "Grey" },
                    { name: "Navy", value: "Navy" },
                    { name: "Dark Aqua", value: "DarkAqua" },
                    { name: "Dark Green", value: "DarkGreen" },
                    { name: "Dark Purple", value: "DarkPurple" },
                    { name: "Dark Vivid Pink", value: "DarkVividPink" },
                    { name: "Dark Gold", value: "DarkGold" },
                    { name: "Dark Orange", value: "DarkOrange" },
                    { name: "Dark Red", value: "DarkRed" },
                    { name: "Dark Grey", value: "DarkGrey" },
                    { name: "Darker Grey", value: "DarkerGrey" },
                    { name: "Light Grey", value: "LightGrey" },
                    { name: "Dark Navy", value: "DarkNavy" },
                    { name: "Dark But Not Black", value: "DarkButNotBlack" },
                ],
            },
            {
                name: "roleicon",
                description: "The icon of the role",
                required: false,
                type: ApplicationCommandOptionType.Attachment,
            },
            {
                name: "hexcolor",
                description: "The hex color of the role",
                required: false,
                type: ApplicationCommandOptionType.String,
            }
        ],
    },
    ON_INTERACTION: async (cmd) => {
        // Check if the command was invoked by a booster or premium user

        // @ts-ignore
        if (!cmd.member!.premiumSince) {
            cmd.reply({ content: "You must be a server booster to use this command.", ephemeral: true });
            return;
        }

        // Get command options
        const roleName = cmd.options.getString("rolename", true);
        const roleColor = cmd.options.getString("rolecolor", true);
        const hexColor = cmd.options.getString("hexcolor");
        console.log(roleColor);
        const roleIcon = cmd.options.getAttachment("roleicon");

        const userId = cmd.user.id;

        // Read the roles from a local resource
        const rolesResource = new Resource("roles.json");
        const userRoleId = rolesResource.resource[userId];

        // Function to save role id to local resource
        const saveUserRoleId = (userId: string, roleId: string) => {
            rolesResource.resource[userId] = roleId;
            rolesResource.save();
        };

        // Function to remove role id from local resource
        const removeUserRoleId = (userId: string) => {
            delete rolesResource.resource[userId];
            rolesResource.save();
        };

        if (userRoleId) {
            // Edit existing role
            const role = cmd.guild!.roles.cache.get(userRoleId);
            if (role) {
                await role.edit({
                    name: roleName,
                    //color: resolveColor(roleColor as ColorResolvable),
                    color: hexColor ? resolveColor(hexColor as HexColorString) : resolveColor(roleColor as ColorResolvable),
                    icon: roleIcon ? roleIcon.url : null,
                });
                cmd.reply({ content: `Your role has been updated: ${roleName}`, ephemeral: true });
                return;
            } else {
                // If role doesn't exist, remove the reference and create a new one
                removeUserRoleId(userId);
            }
        }

        // Get the position of the role "unix team" and create the new role below it
        const unixTeamRole = cmd.guild!.roles.cache.find((role) => role.name === "unix team");


        // Create a new role
        const newRole = await cmd.guild!.roles.create({
            name: roleName,
            color: resolveColor(roleColor as ColorResolvable),
            icon: roleIcon ? roleIcon.url : null,
            position: unixTeamRole ? unixTeamRole.position - 1 : 0,
            hoist: true,
        });

        // Save the new role id
        saveUserRoleId(userId, newRole.id);

        // Assign the new role to the user
        // @ts-ignore
        await cmd.member!.roles.add(newRole);

        cmd.reply({ content: `Your new role has been created: ${roleName}`, ephemeral: true });
    },
};

export default SetRole;
