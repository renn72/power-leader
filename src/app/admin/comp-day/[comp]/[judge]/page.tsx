'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'

import { Button } from '~/components/ui/button'
import { env } from '~/env'
import { sortEntriesFilter } from '~/lib/comp-day'
import { GetCompetitionById } from '~/lib/types'
import { cn } from '~/lib/utils'
import { api } from '~/trpc/react'
import {
  ChevronRightCircle,
  LoaderCircle,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react'
import Pusher from 'pusher-js'
import { toast } from 'sonner'

import Loading from './loading'

export const dynamic = 'force-dynamic'

const Judge = ({
  competition,
  comp,
  judgeNumber,
}: {
  competition: GetCompetitionById
  comp: string
  judgeNumber: number
}) => {
  // const [liftName, setLiftName] = useState('')
  // const [bracket, setBracket] = useState('')
  // const [index, setIndex] = useState<number | null | undefined>(null)
  // const [nextIndex, setNextIndex] = useState('')
  // const [round, setRound] = useState('')
  // const [isGood, setIsGood] = useState<boolean | null | undefined>(null)

  const [isVoting, setIsVoting] = useState(false)
  const ctx = api.useUtils()

  const { mutate: updateLift } = api.competitionDay.updateLift.useMutation({
    onSettled: () => {
      ctx.competition.getCompetitionByUuid.refetch()
      setIsVoting(false)
    },
    onError: () => {
      toast('Error Updating Lift')
    },
  })

  const liftName = competition?.compDayInfo.lift || ''
  const bracket = competition?.compDayInfo.bracket.toString() || ''
  const index = competition?.compDayInfo.index
  const nextIndex = competition?.compDayInfo?.nextIndex?.toString() || ''
  const round = competition?.compDayInfo.round.toString() || ''

  const lifters = sortEntriesFilter(
    competition?.entries,
    liftName,
    bracket,
    round,
  )
  const lifter = lifters?.find((entry, i) => i === Number(index))

  const lift = lifter?.lift?.find(
    (item) =>
      item.lift === liftName.toLowerCase() && item.liftNumber === Number(round),
  )

  const newNextLifterId = Number(nextIndex) + 1

  const updateLifter = () => {
    if (!competition) return
    updateLift({
      id: competition.id,
      uuid: competition.uuid || '',
      round: +round,
      lift: liftName,
      bracket: +bracket,
      index: Number(nextIndex),
      nextIndex: newNextLifterId,
    })
  }

  const { mutate: updateIsLiftGood } =
    api.competitionDay.updateIsLiftGood.useMutation({
      onSettled: async () => {
        ctx.competition.getCompetitionByUuid.refetch()
        setTimeout(() => {
          setIsVoting(false)
        }, 1000)
      },
      onMutate: () => {
        setIsVoting(true)
      },
    })

  useEffect(() => {
    if (!isVoting) return
    setIsVoting(false)
  }, [competition])

  const { mutate: headJudgeFailLift } =
    api.competitionDay.headJudgeFailLift.useMutation({
      onSettled: () => {
        ctx.competition.getCompetitionByUuid.refetch()
      },
    })
  const { mutate: headJudgeClearLift } =
    api.competitionDay.headJudgeClearLift.useMutation({
      onSettled: () => {
        ctx.competition.getCompetitionByUuid.refetch()
      },
    })
  const { mutate: headJudgePassLift } =
    api.competitionDay.headJudgePassLift.useMutation({
      onSettled: () => {
        ctx.competition.getCompetitionByUuid.refetch()
      },
    })

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
        if (data.timerStarted) return
        if (data.timerReset) return
        if (data.timerStopped) return
        // setLiftName(data.lift)
        // setBracket(data.bracket)
        // setIndex(data.index)
        // setRound(data.round)
        // setNextIndex(data.nextIndex?.toString() || '')
        ctx.competition.getCompetitionByUuid.refetch()
      },
    )
    return () => {
      pusherClient.unsubscribe('competition-' + comp)
      pusherClient.disconnect()
    }
  }, [comp])

  // useEffect(() => {
  //   // setLiftName(competition?.compDayInfo.lift || '')
  //   // setBracket(competition?.compDayInfo.bracket.toString() || '')
  //   // setIndex(competition?.compDayInfo.index)
  //   // setNextIndex(competition?.compDayInfo?.nextIndex?.toString() || '')
  //   // setRound(competition?.compDayInfo.round.toString() || '')
  // }, [competition])

  // useEffect(() => {
  //   if (judgeNumber === 1) setIsGood(lift?.isGoodOne)
  //   if (judgeNumber === 2) setIsGood(lift?.isGoodTwo)
  //   if (judgeNumber === 3) setIsGood(lift?.isGoodThree)
  // }, [lift])


  if (!lift) return null
  if (!lifter) return null
  if (!lifter.user) return null
  if (judgeNumber !== 1 && judgeNumber !== 2 && judgeNumber !== 3)
    return <div>Not Found</div>

  const isGood =
    judgeNumber === 1 ? lift?.isGoodOne : judgeNumber === 2 ? lift?.isGoodTwo : lift?.isGoodThree
  const name = lifter.user.name
  const weight = lift.weight

  if (judgeNumber === 1) {
    return (
      <div className='flex h-dvh flex-col items-center justify-around text-xl font-semibold text-primary/90 relative'>
        {isVoting ? (
          <div className='absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center h-screen w-screen z-[100] bg-black/60'>
            <LoaderCircle
              size={96}
              className='text-primary animate-spin'
            />
          </div>
        ) : null}
        <div className='flex items-center gap-2 '>
      <Image
        src='/atlas.png'
        alt='RawWar Logo'
        width={350}
        height={650}
        style={{
          objectFit: 'cover',
          width: '100vw',
        }}
        className='absolute top-20 left-1/2 -translate-x-1/2 z-[-10] opacity-15'
      />
          <div className='text-3xl font-bold z-50'>Middle Judge</div>
        </div>
        <div className='flex w-full flex-col items-center gap-2'>
          <div className='relative flex w-full items-center justify-center'>
            <div className='flex gap-2 items-center'>
              <div className='rounded-full bg-muted px-4 py-2 text-yellow-400 capitalize'>
                {name}
              </div>
              <Loading
                name={''}
                weight={Number(weight)}
                rack={''}
                lift={liftName}
                isLifting={false}
              />
            </div>
          </div>
          <div className='flex gap-4'>
            <div>{weight}kg</div>
            <div className='capitalize'>{liftName}</div>
            <div>Rd: {round}</div>
          </div>
        </div>
        <div
          className={cn(
            'flex h-32 w-32 items-center justify-center rounded-full border border-4 border-white/60 relative',
            isGood !== null
              ? isGood
                ? 'border-white bg-white '
                : 'border-red-500 bg-red-500'
              : '',
          )}
        />
        {lift?.isRecord === true ? (
          <div className='absolute top-0 -right-24 bottom-0 flex items-center justify-center'>
            <div className='text-2xl font-black text-yellow-500 h-10 w-10 rounded-full border-2 border-yellow-500 flex items-center justify-center'>
              R
            </div>
          </div>
        ) : null}
        <div className='flex w-full justify-around'>
          <div
            onClick={() => {
              if (!competition.uuid) return
              let field = ''
              if (judgeNumber === 1) field = 'isGoodOne'
              updateIsLiftGood({
                id: lift.id,
                entryId: lifter.id,
                uuid: competition.uuid,
                [`${field}`]: true,
              })
            }}
            className='rounded-full bg-muted p-8 active:bg-muted-foreground'
          >
            <ThumbsUp size={96} />
          </div>
          <div
            onClick={() => {
              if (!competition.uuid) return
              let field = ''
              if (judgeNumber === 1) field = 'isGoodOne'
              updateIsLiftGood({
                id: lift.id,
                entryId: lifter.id,
                uuid: competition.uuid,
                [`${field}`]: false,
              })
            }}
            className='rounded-full bg-muted p-8 active:bg-muted-foreground'
          >
            <ThumbsDown
              size={96}
              className='text-red-500'
            />
          </div>
        </div>
        <div
          className='flex w-[70vw] items-center justify-center rounded-full bg-muted p-1 active:bg-muted-foreground'
          onClick={() => {
            if (!competition.uuid) return
            let field = ''
            if (judgeNumber === 1) field = 'isGoodOne'
            updateIsLiftGood({
              id: lift.id,
              entryId: lifter.id,
              uuid: competition.uuid,
              [`${field}`]: null,
            })
          }}
        >
          Clear
        </div>

        <div className='text-bold flex items-center gap-4'>
          <Button
            onClick={() => {
              if (!competition.uuid) return
              headJudgePassLift({
                id: lift.id,
                entryId: lifter.id,
                uuid: competition.uuid,
              })
            }}
            className='font-bold text-white'
            variant='outline'
          >
            Pass Lift
          </Button>
          <Button
            onClick={() => {
              if (!competition.uuid) return
              headJudgeFailLift({
                id: lift.id,
                entryId: lifter.id,
                uuid: competition.uuid,
              })
            }}
            className='font-extrabold text-red-600'
            variant='outline'
          >
            Fail Lift
          </Button>
          <Button
            onClick={() => {
              if (!competition.uuid) return
              headJudgeClearLift({
                id: lift.id,
                entryId: lifter.id,
                uuid: competition.uuid,
              })
            }}
            className='font-extrabold text-white'
            variant='outline'
          >
            Clear
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='flex h-dvh flex-col items-center justify-around text-xl font-semibold text-primary/90 relative'>
        {isVoting ? (
          <div className='absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center h-screen w-screen z-[100] bg-black/60'>
            <LoaderCircle
              size={96}
              className='text-primary animate-spin'
            />
          </div>
        ) : null}
      <Image
        src='/atlas.png'
        alt='RawWar Logo'
        width={350}
        height={650}
        style={{
          objectFit: 'cover',
          width: '100vw',
        }}
        className='absolute top-20 left-1/2 -translate-x-1/2 z-[-10] opacity-15'
      />
      <div className='text-3xl font-bold'>{judgeNumber === 2 ? 'Left' : 'Right'} Judge</div>
      <div className='flex flex-col items-center gap-2'>
        <div className='flex gap-2 items-center'>
          <div className='rounded-full bg-muted px-4 py-2 text-yellow-400 capitalize'>
            {name}
          </div>
          <Loading
            name={''}
            weight={Number(weight)}
            rack={''}
            lift={liftName}
            isLifting={false}
          />
        </div>
        <div className='flex gap-4'>
          <div>{weight}kg</div>
          <div className='capitalize'>{liftName}</div>
          <div>Rd: {round}</div>
        </div>
      </div>
      <div
        className={cn(
          'flex h-32 w-32 items-center justify-center rounded-full border border-4 border-white/60 relative',
          isGood !== null
            ? isGood
              ? 'border-white bg-white '
              : 'border-red-500 bg-red-500'
            : '',
        )}
      >
        {lift?.isRecord === true ? (
          <div className='absolute top-0 -right-24 bottom-0 flex items-center justify-center'>
            <div className='text-2xl font-black text-yellow-500 h-10 w-10 rounded-full border-2 border-yellow-500 flex items-center justify-center'>
              R
            </div>
          </div>
        ) : null}
      </div>
      <div className='flex w-full justify-around'>
        <div
          onClick={() => {
            if (!competition.uuid) return
            let field = ''
            if (judgeNumber === 2) field = 'isGoodTwo'
            if (judgeNumber === 3) field = 'isGoodThree'
            updateIsLiftGood({
              id: lift.id,
              entryId: lifter.id,
              uuid: competition.uuid,
              [`${field}`]: true,
            })
          }}
          className='rounded-full bg-muted p-8 active:bg-muted-foreground'
        >
          <ThumbsUp size={96} />
        </div>
        <div
          onClick={() => {
            if (!competition.uuid) return
            let field = ''
            if (judgeNumber === 2) field = 'isGoodTwo'
            if (judgeNumber === 3) field = 'isGoodThree'
            updateIsLiftGood({
              id: lift.id,
              entryId: lifter.id,
              uuid: competition.uuid,
              [`${field}`]: false,
            })
          }}
          className='rounded-full bg-muted p-8 active:bg-muted-foreground'
        >
          <ThumbsDown
            size={96}
            className='text-red-500'
          />
        </div>
      </div>
      <div
        className='flex w-[70vw] items-center justify-center rounded-full bg-muted p-1 active:bg-muted-foreground'
        onClick={() => {
          if (!competition.uuid) return
          let field = ''
          if (judgeNumber === 2) field = 'isGoodTwo'
          if (judgeNumber === 3) field = 'isGoodThree'
          updateIsLiftGood({
            id: lift.id,
            entryId: lifter.id,
            uuid: competition.uuid,
            [`${field}`]: null,
          })
        }}
      >
        Clear
      </div>
    </div>
  )
}

const Page = ({ params }: { params: { comp: string; judge: string } }) => {
  const { comp, judge } = params
  const judgeNumber = Number(judge.split('-')[1])
  const { data: competition, isLoading: competitionLoading } =
    api.competition.getCompetitionByUuid.useQuery(comp, {
      refetchInterval: 1000 * 5 * 1,
    })
  if (competitionLoading) return null
  if (!competition) return null

  console.log('refresh')

  return (
    <Judge
      competition={competition}
      comp={comp}
      judgeNumber={judgeNumber}
    />
  )
}

export default Page
