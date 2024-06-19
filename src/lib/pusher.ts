import PusherClient from 'pusher-js'
import PusherServer from 'pusher'

import { env } from '~/env'

export const pusherServer = new PusherServer({
    appId: env.PUSHER_APP_ID,
    key: env.PUSHER_KEY,
    secret: env.PUSHER_SECRET,
    cluster: env.PUSHER_CLUSTER,
    useTLS: true,
})

export const pusherClient = new PusherClient(env.NEXT_PUBLIC_PUSHER_APP_ID, {
    cluster: env.PUSHER_CLUSTER,
})
