'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'

import { api } from '~/trpc/react'
import { pusherClient } from '~/lib/pusher'
import Pusher from 'pusher-js'

import {
  Card,
  CardContent,
} from '~/components/ui/card'
import Header from './_components/header'
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

  const ctx = api.useUtils()

  const { data: competition, isLoading: competitionLoading } =
    api.competition.getCompetitionByUuid.useQuery(comp)

  useEffect(() => {
    if (competition) {
      setLift(competition.compDayInfo.lift)
      setBracket(competition.compDayInfo.bracket.toString())
      setIndex(competition.compDayInfo.index.toString())
      setRound(competition.compDayInfo.round.toString())
    }
  }, [competition])

  useEffect(() => {
    Pusher.logToConsole = true
    const channel = pusherClient.subscribe('competition-' + competitonUuid)

    channel.bind(
      'judge',
      (data: {
        id: number
        entryId: number
        judge: number
        isGood: boolean
      }) => {
        if (!competition) {
          return
        }
        console.log('data', data)
        ctx.competition.get.setData(competition.id, {
          ...competition,
          entries: competition.entries.map((entry) => {
            return {
              ...entry,
              lift: entry.lift.map((i) => {
                return {
                  ...i,
                  isGoodOne:
                    i.id === data.id && data.judge === 1
                      ? data.isGood
                      : i.isGoodOne,
                  isGoodTwo:
                    i.id === data.id && data.judge === 2
                      ? data.isGood
                      : i.isGoodTwo,
                  isGoodThree:
                    i.id === data.id && data.judge === 3
                      ? data.isGood
                      : i.isGoodThree,
                }
              }),
            }
          }),
        })
      },
    )
    return () => {
      pusherClient.unsubscribe('competition-' + competitonUuid)
    }
  }, [competition])

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
        return entry.squatBracket == Number(bracket)
      } else if (lift === 'bench') {
        return entry.benchBracket == Number(bracket)
      } else if (lift === 'deadlift') {
        return entry.deadliftBracket == Number(bracket)
      }
      return false
    })
    .sort((a, b) => {
      if (a.squatOrderOne == null || b.squatOrderOne == null) {
        return 0
      }
      if (a.benchOrderOne == null || b.benchOrderOne == null) {
        return 0
      }
      if (a.deadliftOrderOne == null || b.deadliftOrderOne == null) {
        return 0
      }
      if (lift === 'squat') {
        return a?.squatOrderOne - b?.squatOrderOne
      } else if (lift === 'bench') {
        return a.benchOrderOne - b.benchOrderOne
      } else if (lift === 'deadlift') {
        return a.deadliftOrderOne - b.deadliftOrderOne
      }
      return 0
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
    <div className='flex flex-col items-center justify-center gap-2'>
      <Header competition={competition} />
      <Card className=''>
        <CardContent className='flex flex-col gap-2 py-2 px-2'>
          <div className='grid grid-cols-2 gap-2'>
            <LifterInfo
              lifter={lifter}
              round={round}
              currentLift={currentLift}
              lift={lift}
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
