'use client'

import { api } from '~/trpc/react'
import { useSearchParams } from 'next/navigation'
import LeaderBoard from '~/app/_components/board/leader-board'

const Board = ({ params }: { params: { comp: string } }) => {
  const searchParams = useSearchParams()
  const table = searchParams.get('table')
  const { comp } = params
  const { data } = api.competition.getCompetitionByUuid.useQuery(comp)

  if (!data) return null
  if (!table) return null

  return (
    <div className='w-full h-screen overflow-hidden'>
      <LeaderBoard competition={data} table={table} />
    </div>
  )
}

export default Board
