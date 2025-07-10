'use client'

import { useEffect, useState } from 'react'

import { Card, CardContent } from '~/components/ui/card'
import { sortEntriesFilter } from '~/lib/comp-day'
import { api } from '~/trpc/react'

import { RefreshCw } from 'lucide-react'

import type { GetCompetitionByUuid } from '~/lib/types'

import  CompTable  from '~/app/_components/comp-table/comp-table'

export const dynamic = 'force-dynamic'

const Competition = ({
  competition,
  comp,
}: {
  competition: GetCompetitionByUuid
  comp: string
}) => {
  const ctx = api.useUtils()
  const competitonUuid = comp
  const [lift, setLift] = useState('')
  const [bracket, setBracket] = useState('')
  const [index, setIndex] = useState('')
  const [round, setRound] = useState('')
  const [compSet, setCompSet] = useState(false)

  useEffect(() => {
    if (competition && !compSet) {
      setLift(competition.compDayInfo.lift)
      setBracket(competition.compDayInfo.bracket.toString())
      setIndex(competition.compDayInfo.index.toString())
      setRound(competition.compDayInfo.round.toString())
      setCompSet(true)
    }
  }, [competition])

  useEffect(() => {
    if (competition) {
      setIndex(competition.compDayInfo.index.toString())
    }
  }, [competition])

  const lifters = competition.entries.sort((a, b) => {
    return a.user?.name?.localeCompare(b?.user?.name || '') || 0
  })

  return (
    <div className='relative flex flex-col sm:items-center gap-1 xl:gap-2 w-full'>
			<RefreshCw
				size={20}
				className='absolute left-1 top-1 cursor-pointer text-muted-foreground hover:text-primary z-100'
				onClick={() => {
					ctx.competition.getCompetitionByUuid.refetch()
				}}
			/>
      <Card className='w-full max-w-full'>
        <CardContent className='flex flex-col gap-1 xl:gap-2 px-2 py-2 w-full max-w-full'>
          <CompTable
            competitonUuid={competitonUuid}
            lifters={lifters}
            competition={competition}
            lift={lift}
            bracket={bracket}
            round={round}
            index={index}
            setIndex={setIndex}
          />
        </CardContent>
      </Card>
    </div>
  )
}

const Page = ({ params }: { params: { comp: string } }) => {
  const { comp } = params
  const { data: competition, isLoading: competitionLoading } =
    api.competition.getCompetitionByUuid.useQuery(comp, {
      refetchInterval: 1000 * 60 * 1,
    })
  if (competitionLoading) return null
  if (!competition) return null

  return (
    <Competition
      competition={competition}
      comp={comp}
    />
  )
}

export default Page
