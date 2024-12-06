'use client'

import { api } from '~/trpc/react'
import { useEffect, useState } from 'react'

import { pusherClient } from '~/lib/pusher'
import Pusher from 'pusher-js'

import { cn } from '~/lib/utils'
import Image from 'next/image'
import Loading from './loading'

import { calculateDOTS, calculateNewWilks } from '~/lib/utils'

const Sign = ({ isGood }: { isGood: boolean | null | undefined }) => {
  const size = 19
  return (
    <div>
      {isGood === null ? (
        <div className=' h-[19vh] w-[19vh] rounded-full border border-4 border-white/60 '></div>
      ) : isGood ? (
        <div className='good-lift  h-[19vh] w-[19vh] rounded-full '></div>
      ) : (
        <div className='bad-lift  h-[19vh] w-[19vh] rounded-full '></div>
      )}
    </div>
  )
}

const CompDayScreen = ({ params }: { params: { comp: string } }) => {
  const [liftName, setLiftName] = useState('')
  const [bracket, setBracket] = useState('')
  const [index, setIndex] = useState<number | null | undefined>(null)
  const [nextIndex, setNextIndex] = useState('')
  const [round, setRound] = useState('')
  const [isGoodOne, setIsGoodOne] = useState<boolean | null | undefined>(null)
  const [isGoodTwo, setIsGoodTwo] = useState<boolean | null | undefined>(null)
  const [isGoodThree, setIsGoodThree] = useState<boolean | null | undefined>(
    null,
  )
  const { comp } = params
  const ctx = api.useUtils()
  const { data: competition } =
    api.competition.getCompetitionByUuid.useQuery(comp)

  const lifter = competition?.entries?.find(
    (entry) => entry.id === Number(index),
  )

  const lift = lifter?.lift?.find(
    (item) =>
      item.lift === liftName.toLowerCase() && item.liftNumber === Number(round),
  )

  const lifter2 = competition?.entries?.find(
    (entry) => entry.id === Number(nextIndex),
  )

  const lift2 = lifter2?.lift?.find(
    (item) =>
      item.lift === liftName.toLowerCase() && item.liftNumber === Number(round),
  )

  console.log(competition)

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
        setLiftName(data.lift)
        setBracket(data.bracket)
        setIndex(data.index)
        setRound(data.round)
        setNextIndex(data.nextIndex?.toString() || '')
        ctx.competition.getCompetitionByUuid.refetch()
      },
    )
    channel.bind(
      'judge',
      (data: {
        id: number
        entryId: number
        judge: number
        isGood: boolean
      }) => {
        console.log('ping', lift?.id, data.id)
        void ctx.competition.getCompetitionByUuid.refetch()
        if (lift?.id != data.entryId) {
          console.log('not the same')
        }
        console.log('passed')
        if (data.judge === 1) {
          setIsGoodOne(data.isGood)
        } else if (data.judge === 2) {
          setIsGoodTwo(data.isGood)
        } else if (data.judge === 3) {
          setIsGoodThree(data.isGood)
        }
        ctx.competition.getCompetitionByUuid.refetch()
      },
    )
    return () => {
      pusherClient.unsubscribe('competition-' + comp)
    }
  }, [comp, lift])

  useEffect(() => {
    setLiftName(competition?.compDayInfo.lift || '')
    setBracket(competition?.compDayInfo.bracket.toString() || '')
    setIndex(competition?.compDayInfo.index)
    setNextIndex(competition?.compDayInfo?.nextIndex?.toString() || '')
    setRound(competition?.compDayInfo.round.toString() || '')
  }, [competition])

  useEffect(() => {
    setIsGoodOne(lift?.isGoodOne)
    setIsGoodTwo(lift?.isGoodTwo)
    setIsGoodThree(lift?.isGoodThree)
  }, [lift])

  const bracketList = competition?.entries
    ?.filter((e) => {
      if (liftName == 'squat') {
        return e.squatBracket === Number(bracket)
      }
      if (liftName == 'deadlift') {
        return e.deadliftBracket === Number(bracket)
      }
      if (liftName == 'bench') {
        return e.benchBracket === Number(bracket)
      }
      return false
    })
    .sort((a, b) => {
      const orderA =
        a.lift.find((l) => l.lift == liftName && l.liftNumber === Number(round))
          ?.order || null
      const orderB =
        b.lift.find((l) => l.lift == liftName && l.liftNumber === Number(round))
          ?.order || null
      if (orderA == null || orderA == undefined) return 1
      if (orderB == null || orderB == undefined) return -1

      return orderA - orderB
    })
    .filter((e) => {
      if (liftName == 'squat') {
        return e.squatOpener !== ''
      }
      if (liftName == 'deadlift') {
        return e.deadliftOpener !== ''
      }
      if (liftName == 'bench') {
        return e.benchOpener !== ''
      }
      return false
    })
    .map((e) => {
      const lift = e.lift.find(
        (l) => l.lift == liftName && l.liftNumber === Number(round),
      )
      return {
        id: e.id,
        name: e.user?.name || '',
        lift: lift,
      }
    })

  if (!lift) return null

  const dots = calculateDOTS(
    Number(lift.userWeight),
    Number(lift.weight),
    lift.gender?.toLowerCase() === 'female',
  )

  return (
    <div
      className={cn(
        'dark relative grid h-dvh w-dvw grid-cols-2 overflow-hidden',
      )}
    >
      <div className='col-span-1 mt-4 flex flex-col items-center gap-2'>
        <div className='text-2xl font-bold text-muted-foreground'>
          Round: {round}
        </div>
        {bracketList?.map((entry) => {
          const dots = calculateDOTS(
            Number(entry.lift?.userWeight),
            Number(entry.lift?.weight),
            entry.lift?.gender === 'female',
          )
          const wilks = calculateNewWilks(
            Number(entry.lift?.userWeight),
            Number(entry.lift?.weight),
            entry.lift?.gender === 'female',
          )
          const isOne = entry.lift?.isGoodOne
          const isTwo = entry.lift?.isGoodTwo
          const isThree = entry.lift?.isGoodThree

          const isJudged =
            isOne !== null && isTwo !== null && isThree !== null && lift
          const isGood =
            (isOne && isTwo) || (isTwo && isThree) || (isOne && isThree)
          if (!entry.lift?.weight) return null
          return (
            <div
              key={entry.id}
              className={cn(
                'w-full rounded-full border border-4 border-muted py-1 text-2xl leading-7 font-semibold tracking-tighter',
                'grid grid-cols-6 items-center gap-0',
                index == entry.id
                  ? 'border-yellow-400 bg-yellow-400 font-black text-black'
                  : 'bg-muted',
              )}
            >
              <div
                className={cn(
                    'rounded-full h-4 w-4 place-self-center',
                  isJudged
                    ? isGood
                      ? 'border-0 bg-white/80 font-bold'
                      : 'border-0 bg-red-600/50 font-bold'
                    : '',
                )}
              />
              <div className='col-span-2'>{entry.name}</div>
              <div>{entry.lift?.weight}kg</div>
              <div>{entry.lift?.rackHeight}</div>
              <div>{wilks}</div>
            </div>
          )
        })}
      </div>
      <div className='relative col-span-1 flex flex-col items-center w-full h-dvh justify-around text-xl font-bold my-[2vh]'>
          <div className='absolute top-0 left-1/2 -translate-x-1/2 text-center'>
            <Image
              src='/atlas.png'
              alt='RawWar Logo'
              width={100}
              height={100}
              className='w-[4vw]'
            />
          </div>
          <div className='text-sm'>
            {lifter && lift && (
              <Loading
                isLifting={true}
                name={lifter.user?.name || ''}
                weight={Number(lift.weight)}
                rack={lift.rackHeight || ''}
                lift={liftName}
              />
            )}
          </div>
          <div className='text-sm'>
            {lifter2 && lift2 && (
              <Loading
                name={lifter2.user?.name || ''}
                weight={Number(lift2.weight)}
                rack={lift2.rackHeight || ''}
                lift={liftName}
              />
            )}
        </div>
      </div>
    </div>
  )
}

export default CompDayScreen
