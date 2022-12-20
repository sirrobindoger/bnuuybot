import { Events } from 'discord.js'

import { regenCache } from './join.js'

const InviteCreate = {
    EVENT_NAME: Events.InviteCreate,
    ON_FIRE: async (invite) => {
        regenCache()
    }
}

export default InviteCreate