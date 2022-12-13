import { ActionRowBuilder, StringSelectMenuBuilder } from "@discordjs/builders"

const SelectMenu = {
    info: {
        name: "roleselect",
        channel: "rules-and-roles",
    },
    role_dict: {
        "OS": ["os/Debian", "os/Mint" ,"os/Pop!_OS" ,"os/Ubuntu", "os/Arch", "os/nixOS", "os/macOS", "os/Windows10", "os/Windows11", "os/FreeBSD", "os/NetBSD"],
        "Desktop Env": ["de/GNOME", "de/KDE", "de/XFCE", "de/Cinnamon"],
        "System": ["sys/BSD", "sys/Linux", "sys/NT", "sys/Darwin"],
    },
    buildMenu: (channel) => {
        const rows = [];
        for (const [key, value] of Object.entries(SelectMenu.role_dict)) {
            const menu = new StringSelectMenuBuilder()
                .setCustomId(key)
                .setPlaceholder(`What ${key} do you use?`)
                .setMaxValues(SelectMenu.role_dict[key].length)
                .addOptions(
                    ...SelectMenu.role_dict[key].map(role => (
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
    ON_INTERACTION: (cmd) => {
        // check if interaction is a select menu via role_dict in customId
        if (Object.keys(SelectMenu.role_dict).includes(cmd.customId)) {
            // Roles are an array of strings
            console.log(cmd.values);
            const roles = cmd.values;
            const guild = cmd.guild;
            const member = cmd.member;

            // check if reset value is in roles
            if (roles.includes("reset")) {
                // remove all roles based on cmd.customId as role_dict key
                member.roles.remove(guild.roles.cache.filter(r => SelectMenu.role_dict[cmd.customId].includes(r.name)));
                // reply to user with message only visible to them
                cmd.reply({ content: "Roles removed!", ephemeral: true });
                return;
            }


            // find roles by name
            const roleObjs = roles.map(role => guild.roles.cache.find(r => r.name === role));
            // add roles to member
            member.roles.add(roleObjs);
            // reply to user with message only visible to them
            cmd.reply({ content: "Roles added!", ephemeral: true });
        }
    }

}

export default SelectMenu