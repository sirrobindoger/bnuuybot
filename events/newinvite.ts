import { Events } from 'discord.js'

import { regenCache } from './join'

const InviteCreate = {
    EVENT_NAME: Events.InviteCreate,
    ON_FIRE: async () => {
        regenCache()
    }
}

export default InviteCreate