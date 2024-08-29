'use client'

import { api } from '~/trpc/react'
import { useEffect, useState } from 'react'

import { pusherClient } from '~/lib/pusher'
import Pusher from 'pusher-js'

import { cn } from '~/lib/utils'
import Image from 'next/image'

const Sign = ({ isGood }: { isGood: boolean | null | undefined }) => {
  return (
    <div>
      {isGood === null ? (
        <div className=' h-64 w-64 rounded-full border border-4 border-white/60 '></div>
      ) : isGood ? (
        <div className='good-lift  h-64 w-64 rounded-full '></div>
      ) : (
        <div className='bad-lift  h-64 w-64 rounded-full '></div>
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
      },
    )
    return () => {
      pusherClient.unsubscribe('competition-' + comp)
    }
  }, [comp, lift])

  console.log('comp', competition)

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

  const bracketList = competition?.entries?.filter((e) => {
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
      const orderA = a.lift.find((l) => l.lift == liftName && l.liftNumber === Number(round))?.order || null
      const orderB = b.lift.find((l) => l.lift == liftName && l.liftNumber === Number(round))?.order || null
      if (orderA == null || orderA == undefined) return 1
      if (orderB == null || orderB == undefined) return -1

      return orderA - orderB
    }).filter((e) => {
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

  console.log('bracketList', bracketList)
  console.log('lift', lift)

  if (!lift) return null

  return (
      <div
        className={cn(
          'dark grid grid-cols-7 h-full h-screen w-full relative overflow-hidden',
        )}
      >
      <div className='flex flex-col col-span-1 items-center gap-4 mt-12'>
        {
          bracketList?.map((entry, ) => (
            <div
              key={entry.id}
              className={cn('text-lg tracking-tight font-semibold rounded-full border border-4 border-muted p-1 w-full text-center',
                index == entry.id ? 'bg-yellow-400 border-yellow-400 text-black font-black' : 'bg-muted',
              )}
            >
              {entry.user?.name}
              </div>
          ))
        }
      </div>
      <div className='flex flex-col col-span-6 items-center justify-center relative'>
        <div className='absolute right-0 top-0 text-sm hidden'>
          <div className='capitalize'>{liftName}</div>
          <div>bracket: {bracket}</div>
          <div>index: {index}</div>
          <div>nextIndex: {nextIndex}</div>
          <div>round: {round}</div>
        </div>
        <div className='flex w-full flex-col items-center gap-4 text-8xl font-bold'>
          <div className='absolute left-1/2 top-10 -translate-x-1/2 text-center text-7xl text-muted-foreground'>
            <Image
              src='/RawWar_Logo.png'
              alt='RawWar Logo'
              width={400}
              height={100}
            />
          </div>
          <div className='uppercase'>{lifter?.user?.name}</div>
          <div className='flex w-full justify-center relative'>
            <div>{lift?.weight}kg</div>
            {
            lift?.rackHeight && (
              <div className='absolute right-24 top-1/2 -translate-y-1/2 text-center text-5xl text-muted-foreground'>
                {lift?.rackHeight}
              </div>
            )
          }
          </div>
          <div className='flex w-full justify-center gap-24'>
            <Sign isGood={isGoodOne} />
            <Sign isGood={isGoodTwo} />
            <Sign isGood={isGoodThree} />
          </div>
        </div>
        <div className='absolute bottom-0 left-0 text-sm'>
          <div className='capitalize'>{lifter2?.user?.name}</div>
          <div className='capitalize'>{lift2?.weight}kg</div>
        </div>
      </div>
      </div>
  )
}

export default CompDayScreen
