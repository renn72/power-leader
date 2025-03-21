'use client'

import { useEffect, useState } from 'react'

import { Card, CardContent } from '~/components/ui/card'
import { sortEntriesFilter } from '~/lib/comp-day'
import { api } from '~/trpc/react'

import ActionPanel from './_components/action-panel'
import CompTable from './_components/comp-table'
import CompTableSkeletion from './_components/comp-table-skeletion'
import Header from './_components/header'
import LifterInfo from './_components/lifter-info'
import MainScreenControl from './_components/main-screen-control'
import Signals from './_components/signals'

import { GetCompetitionByUuid } from '~/lib/types'

export const dynamic = 'force-dynamic'

const Competition = ({
  competition,
  comp,
}: {
  competition: GetCompetitionByUuid
  comp: string
}) => {
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

  const syncToCompetition = () => {
    if (competition) {
      setLift(competition.compDayInfo.lift)
      setBracket(competition.compDayInfo.bracket.toString())
      setIndex(competition.compDayInfo.index.toString())
      setRound(competition.compDayInfo.round.toString())
      console.log(competition.compDayInfo.round.toString(), round)
    }
  }

  const lifters = sortEntriesFilter(competition.entries, lift, bracket, round)

  const lifter = lifters.find((l, i) => {
      return i== Number(index)
  })

  const currentLift = lifter?.lift?.find(
    (item) =>
      item.lift === lift.toLowerCase() && item.liftNumber === Number(round),
  )

  return (
    <div className='relative flex flex-col sm:items-center gap-1 xl:gap-2 w-full'>
      <Header competition={competition} />
      <Card className='w-full max-w-full'>
        <CardContent className='flex flex-col gap-1 xl:gap-2 px-2 py-2 w-full max-w-full'>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2 w-full'>
            <MainScreenControl
              competition={competition}
              lift={lift}
              bracket={bracket}
              round={round}
              index={index}
              setLift={setLift}
              setBracket={setBracket}
              setRound={setRound}
              syncToCompetition={syncToCompetition}
            />
            <Signals
              currentLift={currentLift}
              lifter={lifter}
              uuid={competition.uuid || ''}
            />
          </div>
          <ActionPanel
            competition={competition}
            lift={lift}
            bracket={bracket}
            round={round}
            index={index}
            setLift={setLift}
            setBracket={setBracket}
            setRound={setRound}
          />
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
  if (competitionLoading) return <CompTableSkeletion />
  if (!competition) return null

  return (
    <Competition
      competition={competition}
      comp={comp}
    />
  )
}

export default Page
