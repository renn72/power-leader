'use client'

import { useEffect } from 'react'

import BenchBracket from '@/app/flights2/_components/bench-bracket'
import CompBracket from '@/app/flights2/_components/comp-bracket'
import DeadBracket from '@/app/flights2/_components/dead-bracket'
import SquatBracket from '@/app/flights2/_components/squat-bracket'
import LeaderBoard from '~/app/_components/board/leader-board'
import { env } from '~/env'
import { api } from '~/trpc/react'
import Pusher from 'pusher-js'

import { CompDayScreen as Loading } from '../admin/comp-day/loading/[comp]/comp-day-screen'
import { CompDayScreen as Screen } from '../admin/comp-day/screen/[comp]/comp-day-screen'

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

  const screen = competition.compDayInfo.screen1
  const screenSize = competition.compDayInfo.screen1Size

  return (
    <div className='w-full h-screen overflow-hidden'>
      <div className={`scale-${screenSize}`}>
        {screen === 'nil' ? null : null}
        {screen === 'screen' ? (
          <Screen
            competition={competition}
            comp={comp}
          />
        ) : null}
        {screen === 'loading' ? (
          <Loading
            competition={competition}
            comp={comp}
          />
        ) : null}
        {screen === 'comp-bracket' ? (
          <CompBracket competition={competition} />
        ) : null}
        {screen === 'squat-bracket' ? (
          <SquatBracket competition={competition} />
        ) : null}
        {screen === 'bench-bracket' ? (
          <BenchBracket competition={competition} />
        ) : null}

        {screen === 'dead-bracket' ? (
          <DeadBracket competition={competition} />
        ) : null}
        {screen === 'board-pro' ? (
          <LeaderBoard
            competition={competition}
            table={'pro'}
            gender={''}
            wc={''}
          />
        ) : null}
        {screen === 'board-novice' ? (
          <LeaderBoard
            competition={competition}
            table={'novice'}
            gender={''}
            wc={''}
          />
        ) : null}
        {screen === 'board-first-timers' ? (
          <LeaderBoard
            competition={competition}
            table={'first-timers'}
            gender={''}
            wc={''}
          />
        ) : null}
        {screen === 'board-open' ? (
          <LeaderBoard
            competition={competition}
            table={'open'}
            gender={''}
            wc={''}
          />
        ) : null}
      </div>
    </div>
  )
}
