'use client'

import { useEffect, useState } from 'react'

import { api } from '~/trpc/react'

import CompBracket from './_components/comp-bracket'

const Bracket = () => {
  const [compId, setCompId] = useState('1')

  const { data: competitions, isLoading: competitionsLoading } =
    api.competition.getMyCompetitions.useQuery()

  const competition = competitions?.find(
    (competition) => competition.id === +compId,
  )

  useEffect(() => {
    setCompId(competitions?.[0]?.id.toString() || '')
  }, [competitions])

  if (competitionsLoading) {
    return (
      <div className='flex flex-col items-center justify-center gap-2'>
        <div className='font-bold text-destructive'>Loading...</div>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-4 p-2'>
      {competition && <CompBracket competition={competition} />}
    </div>
  )
}

export default Bracket
