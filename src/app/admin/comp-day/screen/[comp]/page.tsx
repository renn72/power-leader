'use client'

import { useEffect, useRef, useState } from 'react'

import Image from 'next/image'

import { env } from '~/env'
import { sortEntriesFilter } from '~/lib/comp-day'
import { GetCompetitionById } from '~/lib/types'
import { calculateDOTS, calculateNewWilks, cn } from '~/lib/utils'
import { api } from '~/trpc/react'
import Pusher from 'pusher-js'
import Countdown from 'react-countdown'

import Loading from './loading'

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

const Page = ({ params }: { params: { comp: string } }) => {
  const { comp } = params
  const { data: competition } = api.competition.getCompetitionByUuid.useQuery(
    comp,
    {
      refetchInterval: 1000 * 60 * 1,
    },
  )
  if (!competition) return null

  return (
    <CompDayScreen
      competition={competition}
      comp={comp}
    />
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
          ?.weight || null
      const orderB =
        b.lift.find((l) => l.lift == liftName && l.liftNumber === Number(round))
          ?.weight || null
      if (orderA == null || orderA == undefined) return 1
      if (orderB == null || orderB == undefined) return -1

      return Number(orderA) - Number(orderB)
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

  const dots = calculateDOTS(
    Number(lift?.userWeight),
    Number(lift?.weight),
    lift?.gender?.toLowerCase() === 'female',
  )
  const wilks = calculateNewWilks(
    Number(lift?.userWeight),
    Number(lift?.weight),
    lift?.gender?.toLowerCase() === 'female',
  )

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
  return (
    <div className={cn('dark relative h-full h-screen w-full')}>
      <div className='absolute left-1/2 top-6 -translate-x-1/2 text-center text-muted-foreground'></div>
      {!lift ? null : (
        <div className='grid h-full w-full'>
          <div className='absolute left-10 top-4 flex hidden flex-col items-center gap-[1.3vh] '>
            <div className='text-xl font-bold text-muted-foreground'>
              Round: {round}
            </div>
            {bracketList?.map((entry) => (
              <div
                key={entry.id}
                className={cn(
                  'w-full rounded-full border border-4 border-muted p-0 text-center text-lg font-semibold tracking-tighter',
                  index == entry.id
                    ? 'border-yellow-400 bg-yellow-400 font-black text-black'
                    : 'bg-muted',
                )}
              >
                {entry.user?.name}
              </div>
            ))}
          </div>
          <div className='relative col-span-1 flex flex-col items-center justify-center'>
            <div className='mt-32 flex w-full flex-col items-center gap-12 text-[6rem] font-bold'>
              <div className='flex flex-col items-center'>
                <div className='uppercase'>{lifter?.user?.name}</div>
                {lift?.team ? (
                  <div className='text-3xl uppercase'>{lift.team}</div>
                ) : null}
              </div>
              <div className='relative flex w-full justify-center'>
                <div className='font-extrabold'>{lift?.weight}kg</div>
                <div className='absolute right-24 top-1/2 -translate-y-1/2 text-center text-xl text-muted-foreground'>
                  WILKS: {wilks}
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
              <div className='text-6xl text-muted-foreground'>
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
                name={lifter?.user?.name || ''}
                weight={Number(lift.weight)}
                rack={lift.rackHeight || ''}
                lift={liftName}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Page
