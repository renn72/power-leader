'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'

import { api } from '~/trpc/react'

import { Card, CardContent } from '~/components/ui/card'
import Header from './_components/header'
import MainScreenControl from './_components/main-screen-control'
import LifterInfo from './_components/lifter-info'
import Signals from './_components/signals'
import ActionPanel from './_components/action-panel'
import CompTable from './_components/comp-table'
import CompTableSkeletion from './_components/comp-table-skeletion'

const Competition = ({ params }: { params: { comp: string } }) => {
  const { comp } = params
  const competitonUuid = comp
  const [lift, setLift] = useState('')
  const [bracket, setBracket] = useState('')
  const [index, setIndex] = useState('')
  const [round, setRound] = useState('')
  const [compSet, setCompSet] = useState(false)

  const { data: competition, isLoading: competitionLoading } =
    api.competition.getCompetitionByUuid.useQuery(comp, {
      refetchInterval: 1000 * 60 * 1,
    })

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
    console.log('sync')
    if (competition) {
      console.log('syncing')
      setLift(competition.compDayInfo.lift)
      setBracket(competition.compDayInfo.bracket.toString())
      setIndex(competition.compDayInfo.index.toString())
      setRound(competition.compDayInfo.round.toString())
      console.log(competition.compDayInfo.round.toString(), round)
    }
  }

  if (competitionLoading) return <CompTableSkeletion />
  if (!competition) {
    return (
      <div className='flex flex-col items-center justify-center gap-2'>
        <div className='font-bold text-destructive'>Competition not found</div>
      </div>
    )
  }

  const lifters = competition.entries
    .map((entry) => {
      return { ...entry }
    })
    .filter((entry) => {
      if (lift === 'squat') {
        return entry.squatBracket == Number(bracket) && entry.squatOpener !== ''
      } else if (lift === 'bench') {
        return entry.benchBracket == Number(bracket) && entry.benchOpener !== ''
      } else if (lift === 'deadlift') {
        return (
          entry.deadliftBracket == Number(bracket) &&
          entry.deadliftOpener !== ''
        )
      }
      return false
    })
    .sort((a, b) => {
      const orderA =
        a.lift.find((l) => l.lift == lift && l.liftNumber === Number(round))
          ?.order || null
      const orderB =
        b.lift.find((l) => l.lift == lift && l.liftNumber === Number(round))
          ?.order || null
      if (orderA == null || orderA == undefined) return 1
      if (orderB == null || orderB == undefined) return -1

      return orderA - orderB
    })

  const lifter = lifters.find((l) => {
    if (lift === 'squat') {
      return l.id == Number(index)
    } else if (lift === 'bench') {
      return l.id == Number(index)
    } else if (lift === 'deadlift') {
      return l.id == Number(index)
    }
    return false
  })

  const currentLift = lifter?.lift?.find(
    (item) =>
      item.lift === lift.toLowerCase() && item.liftNumber === Number(round),
  )

  // console.log('comp', competition)
  // console.log('lifter', lifter)
  // console.log('currentLift', currentLift)
  // console.log({ lift, bracket, index, round })
  // console.log('lifters', lifters)

  return (
    <div className='relative flex flex-col items-center justify-center gap-2'>
      <Header competition={competition} />
      <Card className=''>
        <CardContent className='flex flex-col gap-2 px-2 py-2'>
          <div className='grid grid-cols-2 gap-2'>
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

export default Competition
