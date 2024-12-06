'use client'
import { useEffect, useState } from 'react'
export const dynamic = 'force-dynamic'
import { api } from '~/trpc/react'
import { env } from '~/env'
import Pusher from 'pusher-js'

import { cn } from '~/lib/utils'
import Image from 'next/image'
import { ChevronRightCircle, ThumbsDown, ThumbsUp } from 'lucide-react'
import { Button } from '~/components/ui/button'

const Judge = ({ params }: { params: { judge: string; comp: string } }) => {
  const [liftName, setLiftName] = useState('')
  const [bracket, setBracket] = useState('')
  const [index, setIndex] = useState<number | null | undefined>(null)
  const [nextIndex, setNextIndex] = useState('')
  const [round, setRound] = useState('')
  const [isGood, setIsGood] = useState<boolean | null | undefined>(null)
  const { comp, judge } = params
  const judgeNumber = Number(judge.split('-')[1])
  const ctx = api.useUtils()
  const { data: competition, isLoading: competitionLoading } =
    api.competition.getCompetitionByUuid.useQuery(comp, {
      refetchInterval: 1000 * 60 * 1,
    })
  const { mutate: startTimer } = api.competitionDay.startTimer.useMutation()
  const { mutate: stopTimer } = api.competitionDay.stopTimer.useMutation()
  const { mutate: resetTimer } = api.competitionDay.resetTimer.useMutation()

  const { mutate: updateLift } = api.competitionDay.updateLift.useMutation({
    onSettled: () => {
      ctx.competition.getCompetitionByUuid.refetch()
    },
  })
  const lifter = competition?.entries?.find(
    (entry) => entry.id === Number(index),
  )

  const lift = lifter?.lift?.find(
    (item) =>
      item.lift === liftName.toLowerCase() && item.liftNumber === Number(round),
  )

  const lifters = competition?.entries
    .filter((entry) => {
      if (liftName === 'squat') {
        return entry.squatBracket == Number(bracket) && entry.squatOpener !== ''
      } else if (liftName === 'bench') {
        return entry.benchBracket == Number(bracket) && entry.benchOpener !== ''
      } else if (liftName === 'deadlift') {
        return (
          entry.deadliftBracket == Number(bracket) &&
          entry.deadliftOpener !== ''
        )
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

  const nextLifterIndex =
    lifters?.findIndex((entry) => entry.id === Number(nextIndex)) || 1000
  const newNextLifterId = lifters?.[nextLifterIndex + 1]?.id || null
  console.log('newNextLifterId', newNextLifterId)
  console.log('nextIndex', nextIndex)
  console.log('nextLifterIndex', nextLifterIndex)

  console.log('lifters', lifters)

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
    resetTimer({
      id: competition.id,
      uuid: competition.uuid || '',
    })
  }

  const { mutate: updateIsLiftGood } =
    api.competitionDay.updateIsLiftGood.useMutation({
      onSettled: () => {
        ctx.competition.getCompetitionByUuid.refetch()
      },
    })

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
        setLiftName(data.lift)
        setBracket(data.bracket)
        setIndex(data.index)
        setRound(data.round)
        setNextIndex(data.nextIndex?.toString() || '')
        ctx.competition.getCompetitionByUuid.refetch()
      },
    )
    return () => {
      pusherClient.unsubscribe('competition-' + comp)
      pusherClient.disconnect()
    }
  }, [comp])

  useEffect(() => {
    setLiftName(competition?.compDayInfo.lift || '')
    setBracket(competition?.compDayInfo.bracket.toString() || '')
    setIndex(competition?.compDayInfo.index)
    setNextIndex(competition?.compDayInfo?.nextIndex?.toString() || '')
    setRound(competition?.compDayInfo.round.toString() || '')
  }, [competition])

  useEffect(() => {
    if (judgeNumber === 1) setIsGood(lift?.isGoodOne)
    if (judgeNumber === 2) setIsGood(lift?.isGoodTwo)
    if (judgeNumber === 3) setIsGood(lift?.isGoodThree)
  }, [lift])

  if (!competition) return null
  if (competitionLoading) return null
  if (!lift) return null
  if (!lifter) return null
  if (!lifter.user) return null
  if (judgeNumber !== 1 && judgeNumber !== 2 && judgeNumber !== 3)
    return <div>Not Found</div>

  const name = lifter.user.name
  const weight = lift.weight

  if (params.judge === 'judge-1') {
    return (
      <div className='flex h-dvh flex-col items-center justify-around text-xl font-semibold text-primary/90'>
        <div className='flex items-center gap-2'>
          <Image
            src='/atlas.png'
            alt='RawWar Logo'
            width={50}
            height={50}
          />
          <div className='text-3xl font-bold'>
            Judge {params.judge.split('-')[1]}
          </div>
        </div>
        <div className='flex w-full flex-col items-center gap-2'>
          <div className='relative flex w-full items-center justify-center'>
            <div className='rounded-full bg-muted px-4 py-2 text-yellow-400'>
              {name}
            </div>
            {nextIndex ? (
              <ChevronRightCircle
                size={36}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground'
                onClick={updateLifter}
              />
            ) : null}
          </div>
          <div className='flex gap-4'>
            <div>{weight}kg</div>
            <div className='capitalize'>{liftName}</div>
            <div>Rd: {round}</div>
          </div>
          <div className='flex items-center gap-4'>
            <div>Timer</div>
            <Button
              onClick={() => {
                startTimer({
                  id: competition.id,
                  uuid: competition.uuid || '',
                })
              }}
              variant='secondary'
            >
              Start
            </Button>
            <Button
              onClick={() => {
                resetTimer({
                  id: competition.id,
                  uuid: competition.uuid || '',
                })
              }}
              variant='secondary'
            >
              Reset
            </Button>
            <Button
              onClick={() => {
                stopTimer({
                  id: competition.id,
                  uuid: competition.uuid || '',
                })
              }}
              variant='secondary'
            >
              Stop
            </Button>
          </div>
        </div>
        <div
          className={cn(
            'flex h-32 w-32 items-center justify-center rounded-full border border-4 border-white/60',
            isGood !== null
              ? isGood
                ? 'border-white bg-white '
                : 'border-red-500 bg-red-500'
              : '',
          )}
        />
        <div className='flex w-full justify-around'>
          <div
            onClick={() => {
              if (!competition.uuid) return
              let field = ''
              if (judgeNumber === 1) field = 'isGoodOne'
              if (judgeNumber === 2) field = 'isGoodTwo'
              if (judgeNumber === 3) field = 'isGoodThree'
              setIsGood(true)
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
              if (judgeNumber === 2) field = 'isGoodTwo'
              if (judgeNumber === 3) field = 'isGoodThree'
              setIsGood(false)
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
            if (judgeNumber === 2) field = 'isGoodTwo'
            if (judgeNumber === 3) field = 'isGoodThree'
            setIsGood(null)
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
              setIsGood(true)
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
              setIsGood(false)
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
              setIsGood(null)
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
    <div className='flex h-dvh flex-col items-center justify-around text-xl font-semibold text-primary/90'>
      <Image
        src='/atlas.png'
        alt='RawWar Logo'
        width={50}
        height={50}
      />
      <div className='text-3xl font-bold'>
        Judge {params.judge.split('-')[1]}
      </div>
      <div className='flex flex-col items-center gap-2'>
        <div className='rounded-full bg-muted px-4 py-2 text-yellow-400'>
          {name}
        </div>
        <div className='flex gap-4'>
          <div>{weight}kg</div>
          <div className='capitalize'>{liftName}</div>
          <div>Rd: {round}</div>
        </div>
      </div>
      <div
        className={cn(
          'flex h-32 w-32 items-center justify-center rounded-full border border-4 border-white/60',
          isGood !== null
            ? isGood
              ? 'border-white bg-white '
              : 'border-red-500 bg-red-500'
            : '',
        )}
      />
      <div className='flex w-full justify-around'>
        <div
          onClick={() => {
            if (!competition.uuid) return
            let field = ''
            if (judgeNumber === 1) field = 'isGoodOne'
            if (judgeNumber === 2) field = 'isGoodTwo'
            if (judgeNumber === 3) field = 'isGoodThree'
            setIsGood(true)
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
            if (judgeNumber === 2) field = 'isGoodTwo'
            if (judgeNumber === 3) field = 'isGoodThree'
            setIsGood(false)
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
          if (judgeNumber === 2) field = 'isGoodTwo'
          if (judgeNumber === 3) field = 'isGoodThree'
          setIsGood(null)
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

export default Judge
