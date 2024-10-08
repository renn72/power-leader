'use client'
import { useEffect, useState } from 'react'
export const dynamic = 'force-dynamic'
import { api } from '~/trpc/react'
import { pusherClient } from '~/lib/pusher'
import Pusher from 'pusher-js'

import { cn } from '~/lib/utils'
import Image from 'next/image'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
const Judge = ({ params }: { params: { judge: string; comp: string } }) => {
  const [liftName, setLiftName] = useState('')
  const [bracket, setBracket] = useState('')
  const [index, setIndex] = useState<number | null | undefined>(null)
  const [nextIndex, setNextIndex] = useState('')
  const [round, setRound] = useState('')
  const [isGood, setIsGood] = useState<boolean | null | undefined>(null)
  const { comp, judge } = params
  const judgeNumber = Number(judge.split('-')[1])
  const { data: competition, isLoading: competitionLoading } =
    api.competition.getCompetitionByUuid.useQuery(comp, {
    refetchInterval: 1000 * 60 * 5
  })

  const lifter = competition?.entries?.find(
    (entry) => entry.id === Number(index),
  )

  const lift = lifter?.lift?.find(
    (item) =>
      item.lift === liftName.toLowerCase() && item.liftNumber === Number(round),
  )

  const ctx = api.useUtils()
  const { mutate: updateIsLiftGood } =
    api.competitionDay.updateIsLiftGood.useMutation({
      onSettled: () => {
        ctx.competition.getCompetitionByUuid.refetch()
      },
    })

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
    return () => {
      pusherClient.unsubscribe('competition-' + comp)
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

  console.log('competition', competition)
  console.log('lift', lift)
  console.log('lifter', lifter)
  console.log(isGood)

  const name = lifter.user.name
  const weight = lift.weight

  return (
    <div className='flex h-dvh flex-col items-center justify-around text-xl font-semibold text-primary/90'>
      <Image
        src='/RawWar_Logo.png'
        alt='RawWar Logo'
        width={200}
        height={50}
      />
      <div className='text-xl font-bold'>
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
