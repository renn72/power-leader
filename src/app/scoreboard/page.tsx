'use client'

import { api } from '~/trpc/react'
import { useSearchParams } from 'next/navigation'
import LeaderBoard from '~/app/_components/board/leader-board'

export const dynamic = 'force-dynamic'
const Board = () => {
  const searchParams = useSearchParams()
  const table = searchParams.get('table')
  const gender = searchParams.get('gender')
  const g = gender ? gender : null
  const comp = 'Atlas-Classic-7-12-2024'
  const ctx = api.useUtils()
  const { data } = api.competition.getCompetitionByUuid.useQuery(comp, {
    refetchInterval: 60000
  })
  console.log(new Date().getMinutes())

  if (!data) return null
  if (!table) return null

  return (
    <div className='h-screen w-full '>
      <LeaderBoard
        competition={data}
        table={table}
        gender={g}
      />
    </div>
  )
}

export default Board
