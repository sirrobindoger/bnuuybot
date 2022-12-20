import { Events } from "discord.js";
import {Bot} from "../bot.js";

const inviteCodes = new Map();

export const regenCache = async () => {
    // get guild "unixcore" by its name
    const guild = await Bot.guilds.cache.find(g => g.id === "1051191635347767357");

    // get all invites from the guild
    const invites = await guild.invites.fetch();

    invites.forEach((invite) => {
        // add the invite code and uses to the map
        inviteCodes.set(invite.code, invite.uses);
    });

    console.log(inviteCodes);
    console.log("Cache regenerated");
}


const Join = {
    EVENT_NAME: Events.GuildMemberAdd,
    ON_REGISTER: regenCache,

    ON_FIRE: async (member) => {
        // get channel "enter-exit" from the guild "unixcore"
        const channel = member.guild.channels.cache.find(ch => ch.name === "enter-exit");
        // if the channel doesn't exist, stop
        if (!channel) return;

        const invite = await member.guild.invites.fetch();
        const inviteUsed = invite.find((i) => inviteCodes.get(i.code) < i.uses);

        if (!inviteUsed) return;

        // send a message to the channel
        channel.send(`:green_square: ${member} joined using invite code ${inviteUsed.code} generated by ${inviteUsed.inviter} (${inviteUsed.uses} uses)`);

        // update the cache
        await regenCache();
    }
}

export default Join;