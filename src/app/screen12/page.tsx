'use client'

import { useEffect } from 'react'

import { env } from '~/env'
import { api } from '~/trpc/react'
import Pusher from 'pusher-js'
import { Screen } from '../_components/screen/screen'

export default function Home() {
  const ctx = api.useUtils()
  const { data: competition } = api.competition.get.useQuery(1, {
    refetchInterval: 1000 * 60 * 1,
  })
  const comp = 'Show-Down-22-3-2025'

  useEffect(() => {
    // console.log('channel', 'competition-' + comp)
    const pusherClient = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
    })
    const channel = pusherClient.subscribe('competition-' + comp)
    channel.bind('update', () => {
      ctx.competition.get.refetch()
    })
    return () => {
      pusherClient.unsubscribe('competition-' + comp)
      pusherClient.disconnect()
    }
  }, [comp])
  if (!competition) return null

  const screen = competition.compDayInfo.screen12
  const screenSize = competition.compDayInfo.screen12Size

  return (
    <Screen
      screen={screen}
      screenSize={screenSize}
      competition={competition}
    />
  )
}
