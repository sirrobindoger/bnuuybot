import { ActionRowBuilder, StringSelectMenuBuilder } from "@discordjs/builders"
import { GuildMemberRoleManager } from "discord.js";
import { DiscordMenu } from "../bot";


const role_dict:{[key: string]: string[]} = {
    "OS": ["os/Debian", "os/ZorinOS","os/Mint" ,"os/Pop!_OS" , "os/Fedora","os/Ubuntu", "os/Arch", "os/nixOS", "os/macOS", "os/Windows10", "os/Windows11", "os/FreeBSD", "os/NetBSD"],
    "DE (or WM)": ["de/GNOME", "de/KDE", "de/XFCE", "de/CDE", "de/Cinnamon", "wm/i3"],
    "System": ["sys/BSD", "sys/Linux", "sys/NT", "sys/Darwin"],
    "Pronouns": ["He/Him", "She/Her", "They/Them", "Any Pronouns"],
    "Art Software": ["art/Blender", "art/ClipStudioPaint", "art/Photoshop", "art/Procreate", "art/Sai", "art/Krita"],
}

const SelectMenu : DiscordMenu = {
    name: "roleselect",
    channel: "1051218518206578708",
    buildMenu: (channel) => {
        const rows = [];
        for (const key of Object.keys(role_dict)) {
            const menu = new StringSelectMenuBuilder()
                .setCustomId(key)
                .setPlaceholder(`What ${key} do you use?`)
                .setMaxValues(role_dict[key].length)
                .addOptions(
                    ...role_dict[key].map(role => (
                        {
                            label: role,
                            value: role,
                            //description: `Select ${role} to get the ${role} role`,
                        }
                    )),
                    {
                        // RESET option
                        label: "Reset",
                        value: "reset",
                        description: `Remove all roles pretaining to ${key}`,
                    }
                )
            const row = new ActionRowBuilder()
                .addComponents(menu);
            rows.push(row);
        }
        return rows;
    },
    onInteraction: async (cmd) => {
        // check if interaction is a select menu via role_dict in customId
        if (Object.keys(role_dict).includes(cmd.customId)) {
            // Roles are an array of strings
            console.log(cmd.values);
            const roles = cmd.values;
            const guild = cmd.guild;
            const member = cmd.member;
            if (!guild || !member) return;

            const memberRoles = member.roles as GuildMemberRoleManager;

            // check if reset value is in roles
            if (roles.includes("reset")) {
                // remove all roles based on cmd.customId as role_dict key
                
                memberRoles.remove(guild.roles.cache.filter(r => role_dict[cmd.customId].includes(r.name)));
                // reply to user with message only visible to them
                cmd.reply({ content: "Roles removed!", ephemeral: true });
                return;
            }


            // find roles by name
            const roleObjs = roles.map(role => guild.roles.cache.find(r => r.name === role));
    
            // @ts-ignore
            memberRoles.add(roleObjs);

            // reply to user with message only visible to them
            cmd.reply({ content: "Roles added!", ephemeral: true });
        }
    }

}

export default SelectMenu