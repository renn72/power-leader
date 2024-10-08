'use client'

import { api } from '~/trpc/react'
import { useSearchParams } from 'next/navigation'
import LeaderBoard from '~/app/_components/board/leader-board'

const Board = ({ params }: { params: { comp: string } }) => {
  const searchParams = useSearchParams()
  const table = searchParams.get('table')
  const { comp } = params
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
      />
    </div>
  )
}

export default Board
