'use client'

import { useEffect } from 'react'
import { api } from '~/trpc/react'
import { useSearchParams } from 'next/navigation'
import LeaderBoard from '~/app/_components/board/leader-board'

import { pusherClient } from '~/lib/pusher'
import Pusher from 'pusher-js'

const Board = ({ params }: { params: { comp: string } }) => {
  const searchParams = useSearchParams()
  const table = searchParams.get('table')
  const { comp } = params
  const ctx = api.useUtils()
  const { data } = api.competition.getCompetitionByUuid.useQuery(comp)

  useEffect(() => {
    console.log('channel', 'competition-' + comp)
    Pusher.logToConsole = true
    const channel = pusherClient.subscribe('competition-' + comp)
    channel.bind(
      'update',
      (data: {
        lift: string
        round: string
        bracket: string
        index: number | null
        nextIndex: string | null
      }) => {
        void ctx.competition.getCompetitionByUuid.refetch(comp)
      },
    )
    return () => {
      pusherClient.unsubscribe('competition-' + comp)
    }
  }, [comp])
  if (!data) return null
  if (!table) return null

  return (
    <div className='h-screen w-full '>
      <LeaderBoard
        competition={data}
        table={table}
      />
    </div>
  )
}

export default Board
