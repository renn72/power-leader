'use client'

import { useEffect } from 'react'

import { env } from '~/env'
import { api } from '~/trpc/react'
import Pusher from 'pusher-js'

import { CompDayScreen as Screen } from '../admin/comp-day/screen/[comp]/comp-day-screen'
import { CompDayScreen as Loading } from '../admin/comp-day/loading/[comp]/comp-day-screen'

export default function Home() {
  const ctx = api.useUtils()
  const { data: competition } = api.competition.get.useQuery(1, {
    refetchInterval: 1000 * 160 * 1,
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

  const screen = competition.compDayInfo.screen1
  const screenSize = competition.compDayInfo.screen1Size

  return (
    <div className='w-full h-screen overflow-hidden'>
      <div className={`scale-${screenSize}`}>
        {screen === 'nil' ? null : null}
        {screen === 'screen' ? <Screen
          competition={competition}
          comp={comp}
        /> : null}
        {screen === 'loading' ? <Loading
          competition={competition}
          comp={comp}
        /> : null}
      </div>
    </div>
  )
}
