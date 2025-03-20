'use client'

import { useEffect, useState } from 'react'


import Image from 'next/image'

import { sortEntriesFilter } from '~/lib/comp-day'
import { pusherClient } from '~/lib/pusher'
import { calculateDOTS,  } from '~/lib/dots'
import { cn } from '~/lib/utils'
import { api } from '~/trpc/react'

import Loading from './loading'
import { GetCompetitionById } from '~/lib/types'

const CompDayScreen = ({ competition, comp }: { competition: GetCompetitionById, comp: string }) => {
  const [liftName, setLiftName] = useState('')
  const [bracket, setBracket] = useState('')
  const [index, setIndex] = useState<number | null | undefined>(null)
  const [nextIndex, setNextIndex] = useState('')
  const [round, setRound] = useState('')

  // console.log({liftName, bracket, index, nextIndex, round})

  const ctx = api.useUtils()

  const entries = sortEntriesFilter(
    competition?.entries,
    liftName,
    bracket,
    round,
  )

  const lifter = entries?.filter(
    (_entry, i) => i === Number(index),
  )[0]

  const lift = lifter?.lift?.find(
    (item) =>
      item.lift === liftName.toLowerCase() && item.liftNumber === Number(round),
  )

  const lifter2 = entries?.filter(
    (_entry, i) => i === Number(index) + 1,
  )[0]

  const lift2 = lifter2?.lift?.find(
    (item) =>
      item.lift === liftName.toLowerCase() && item.liftNumber === Number(round),
  )

  useEffect(() => {
    console.log('channel', 'competition-' + comp)
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
        // setLiftName(data.lift)
        // setBracket(data.bracket)
        // setIndex(data.index)
        // setRound(data.round)
        // setNextIndex(data.nextIndex?.toString() || '')
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
        ctx.competition.getCompetitionByUuid.refetch()
      },
    )
    return () => {
      pusherClient.unsubscribe('competition-' + comp)
    }
  }, [comp, lift])

  useEffect(() => {
    if (competition?.compDayInfo.lift)
      setLiftName(competition?.compDayInfo.lift)
    if (competition?.compDayInfo.bracket)
      setBracket(competition?.compDayInfo.bracket.toString())
    if (Number.isInteger(competition?.compDayInfo.index)) setIndex(competition?.compDayInfo.index)
    if (competition?.compDayInfo?.nextIndex)
      setNextIndex(competition?.compDayInfo?.nextIndex?.toString())
    if (competition?.compDayInfo.round)
      setRound(competition?.compDayInfo.round.toString())
  }, [competition])

  const bracketList = entries
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
        {bracketList?.map((entry, i) => {
          const dots = calculateDOTS(
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
                'w-full rounded-full border border-4 border-muted py-1 text-2xl font-semibold leading-7 tracking-tighter',
                'grid grid-cols-5 items-center gap-0',
                index == i
                  ? 'border-yellow-400 bg-yellow-400 font-black text-black'
                  : 'bg-muted',
              )}
            >
              <div
                className={cn(
                  'h-4 w-4 place-self-center rounded-full',
                  isJudged
                    ? isGood
                      ? 'border-0 bg-white/80 font-bold'
                      : 'border-0 bg-red-600/50 font-bold'
                    : '',
                )}
              />
              <div className='col-span-2 capitalize'>{entry.name}</div>
              <div>{entry.lift?.weight}kg</div>
              <div>{entry.lift?.rackHeight}</div>
            </div>
          )
        })}
      </div>
      <div className='relative col-span-1 mt-[2vh] flex h-dvh w-full flex-col items-start justify-around text-xl font-bold pl-20'>
        <div className='absolute left-1/2 top-1 -translate-x-1/2 z-[-10]'>
          <Image
            src='/showdown.jpeg'
            alt='RawWar Logo'
            width={1440}
            height={1440}
            style={{ width: '10vw', height: '100%' }}
          />

        </div>
        <div className='text-sm mt-44'>
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

export { CompDayScreen }
