'use client'

import { useEffect, useRef, useState } from 'react'

import Image from 'next/image'

import { env } from '~/env'
import { liftState, sortEntriesFilter } from '~/lib/comp-day'
import { calculateDOTS } from '~/lib/dots'
import { GetCompetitionById } from '~/lib/types'
import { cn } from '~/lib/utils'
import { api } from '~/trpc/react'
import Pusher from 'pusher-js'
import Countdown from 'react-countdown'

import Loading from './loading'

const Sign = ({ isGood }: { isGood: boolean | null | undefined }) => {
  return (
    <div>
      {isGood === null ? (
        <div className=' h-[25vh] w-[25vh] rounded-full border border-4 border-white/60 '></div>
      ) : isGood ? (
        <div className='good-lift  h-[25vh] w-[25vh] rounded-full '></div>
      ) : (
        <div className='bad-lift  h-[25vh] w-[25vh] rounded-full '></div>
      )}
    </div>
  )
}

const CompDayScreen = ({
  competition,
  comp,
}: {
  competition: GetCompetitionById
  comp: string
}) => {
  const [dateNow, setDateNow] = useState<number>(Date.now())
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
  const ctx = api.useUtils()

  const entries = sortEntriesFilter(
    competition?.entries,
    liftName,
    bracket,
    round,
  )

  const lifter = entries?.filter((_entry, i) => i === Number(index))[0]

  const previousLifts = lifter?.lift?.filter((l, i) => {
    if (
      l.lift === liftName.toLowerCase() &&
      l.liftNumber === Number(round) &&
      i === Number(index)
    ) {
      return false
    }
    const s = liftState(l)
    return s.isJudged
  })

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

  console.log('comp', competition)

  useEffect(() => {
    // console.log('channel', 'competition-' + comp)
    const pusherClient = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
    })
    const channel = pusherClient.subscribe('competition-' + comp)
    channel.bind(
      'update',
      (data: {
        lift: string
        round: string
        bracket: string
        index: number | null
        nextIndex: string | null
        timerStarted: boolean
        timerReset: boolean
        timerStopped: boolean
      }) => {
        console.log('update', data)
        if (data.timerStarted) {
          countdownRef.current?.start()
          return
        }
        if (data.timerReset) {
          countdownRef.current?.stop()
          setDateNow(Date.now())
          return
        }
        if (data.timerStopped) {
          countdownRef.current?.pause()
          return
        }
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
        // console.log('ping', lift?.id, data.id)
        if (lift?.id != data.entryId) {
          // console.log('not the same')
        }
        // console.log('passed')
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
      pusherClient.disconnect()
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

  const dots = calculateDOTS(
    Number(lift?.userWeight),
    Number(lift?.weight),
    lift?.gender?.toLowerCase() === 'female',
  )
  // const wilks = calculateNewWilks(
  //   Number(lift?.userWeight),
  //   Number(lift?.weight),
  //   lift?.gender?.toLowerCase() === 'female',
  // )

  const countdownRef = useRef<any>()
  // @ts-ignore
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <>0</>
    } else {
      // Render a countdown
      if (minutes > 0) {
        return <span>{minutes}:00</span>
      }
      return <span>{seconds}</span>
    }
  }

  const pb =
    liftName === 'squat'
      ? lifter?.squatPB
      : liftName === 'bench'
        ? lifter?.benchPB
        : lifter?.deadliftPB

  const isPb = pb !== null && Number(pb) < Number(lift?.weight)

  console.log({ pb, isPb })

  return (
    <div className={cn('dark relative h-full h-screen w-full')}>
      <div className='absolute left-1/2 -translate-x-1/2 w-screen h-screen flex items-center justify-center'>
        <Image
          src='/showdown.jpeg'
          alt='board'
          width={1440}
          height={1440}
          style={{
            objectFit: 'cover',
            width: '70%',
            height: '',
          }}
          className='opacity-25'
        />
      </div>
      {!lift ? null : (
        <div className='grid h-full w-full'>
          <div className='relative col-span-1 flex flex-col items-center justify-center'>
            <div className='absolute left-10 top-4 flex  flex-col items-center gap-1'>
              {previousLifts?.map((l) => {
                const s = liftState(l)
                return (
                  <div
                    key={l.id}
                    className={cn(
                      'grid grid-cols-4 place-items-center text-3xl font-semibold',
                      s.isGood ? '' : 'text-muted-foreground',
                    )}
                  >
                    <div className='capitalize'>{l.lift}</div>
                    <div>{l.liftNumber}</div>
                    <div>{Number(l.weight).toFixed(2)}kg</div>
                    <div>
                      {s.isGood ? (
                        <div className='rounded-full h-5 w-5 bg-white' />
                      ) : (
                        <div className='rounded-full h-4 w-4 bg-red-500' />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className='mt-10 flex w-full flex-col items-center gap-12 text-7xl font-extrabold relative'>
              <div className='absolute -top-36 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4'>
                {lift.isRecord ? (
                  <div className='text-center text-5xl bg-yellow-500 text-black ring-2 ring-yellow-500 rounded-full py-4 px-8'>
                    Record Attempt
                  </div>
                ) : null}
                {isPb ? (
                  <div className='text-center text-5xl ring-2 ring-green-500 bg-green-500 text-black rounded-full py-4 px-8'>
                    Personal Best
                  </div>
                ) : null}
              </div>
              <div className='flex flex-col items-center mt-44'>
                <div className='uppercase'>{lifter?.user?.name}</div>
              </div>
              <div className='relative flex w-full justify-center'>
                <div className='font-extrabold'>{lift?.weight}kg</div>
                <div className='absolute right-24 top-1/2 -translate-y-1/2 text-center text-xl text-muted-foreground'>
                  DOTS: {dots}
                </div>
              </div>
              <div className='relative flex w-full justify-center gap-24'>
                <Sign
                  isGood={
                    isGoodOne === null ||
                    isGoodTwo === null ||
                    isGoodThree === null
                      ? null
                      : isGoodOne
                  }
                />
                <Sign
                  isGood={
                    isGoodOne === null ||
                    isGoodTwo === null ||
                    isGoodThree === null
                      ? null
                      : isGoodTwo
                  }
                />
                <Sign
                  isGood={
                    isGoodOne === null ||
                    isGoodTwo === null ||
                    isGoodThree === null
                      ? null
                      : isGoodThree
                  }
                />
                {lift?.rackHeight && (
                  <div className='absolute right-12 top-1/2 -translate-y-1/2 text-center text-4xl text-muted-foreground'>
                    {lift?.rackHeight}
                  </div>
                )}
              </div>
              <div className='text-3xl text-muted-foreground'>
                <Countdown
                  autoStart={false}
                  ref={countdownRef}
                  date={dateNow + 60000}
                  renderer={renderer}
                />
              </div>
            </div>
            <div className='absolute bottom-0 left-[1vw] text-sm'>
              <Loading
                name={''}
                weight={Number(lift.weight)}
                rack={lift.rackHeight || ''}
                lift={liftName}
                isLifting={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export { CompDayScreen }
