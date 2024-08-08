'use client'

import { api } from '~/trpc/react'
import { useEffect, useState } from 'react'

import { pusherClient } from '~/lib/pusher'
import Pusher from 'pusher-js'

import { cn } from '~/lib/utils'

const CompDayScreen = ({ params }: { params: { comp: string } }) => {
  const [update, setUpdate] = useState<string[]>([])
  const [liftName, setLiftName] = useState('')
  const [bracket, setBracket] = useState('')
  const [index, setIndex] = useState('')
  const [nextIndex, setNextIndex] = useState('')
  const [round, setRound] = useState('')
  const [isGoodOne, setIsGoodOne] = useState<boolean | null>(null)
  const [isGoodTwo, setIsGoodTwo] = useState<boolean | null>(null)
  const [isGoodThree, setIsGoodThree] = useState<boolean | null>(null)
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
        index: string
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
        if(lift?.id != data.entryId) {
          console.log('not the same')
        }
        console.log('passed')
        if(data.judge === 1) {
          setIsGoodOne(data.isGood)
        } else if(data.judge === 2) {
          setIsGoodTwo(data.isGood)
        } else if(data.judge === 3) {
          setIsGoodThree(data.isGood)
        }
      },
    )
    return () => {
      pusherClient.unsubscribe('competition-' + comp)
    }
  }, [comp, lift])

  // console.log('comp', competition)

  useEffect(() => {
    setLiftName(competition?.compDayInfo.lift || '')
    setBracket(competition?.compDayInfo.bracket.toString() || '')
    setIndex(competition?.compDayInfo.index.toString() || '')
    setNextIndex(competition?.compDayInfo?.nextIndex?.toString() || '')
    setRound(competition?.compDayInfo.round.toString() || '')
  }, [competition])

  useEffect(() => {
    setIsGoodOne(lift?.isGoodOne || null)
    setIsGoodTwo(lift?.isGoodTwo || null)
    setIsGoodThree(lift?.isGoodThree || null)

  }, [lift])

  console.log('lift', lift)


  return (
    <>
      <div
        className={cn(
          'flex h-full min-h-[calc(100vh-10rem)] w-full flex-col',
          ' relative items-center justify-center',
        )}
      >
        <div className='absolute left-0 top-0 text-sm'>
          <div className='capitalize'>{liftName}</div>
          <div>bracket: {bracket}</div>
          <div>index: {index}</div>
          <div>nextIndex: {nextIndex}</div>
          <div>round: {round}</div>
        </div>
        <div className='flex flex-col items-center gap-12 text-6xl font-bold'>
          <div className=''>{lift?.weight}kg</div>
          <div className='flex gap-10 justify-center'>
            <div>
              {isGoodOne === null ? (
                <div className=' h-16 w-16 rounded-full border border-4 border-white/60 '></div>
              ) : isGoodOne ? (
                <div className='good-lift h-16 w-16 rounded-full '></div>
              ) : (
                <div className='bad-lift h-16 w-16 rounded-full '></div>
              )}
            </div>
            <div>
              {isGoodTwo === null ? (
                <div className=' h-16 w-16 rounded-full border border-4 border-white/60 '></div>
              ) : isGoodTwo ? (
                <div className='good-lift h-16 w-16 rounded-full '></div>
              ) : (
                <div className='bad-lift h-16 w-16 rounded-full '></div>
              )}
            </div>
            <div>
              {isGoodThree === null ? (
                <div className=' h-16 w-16 rounded-full border border-4 border-white/60 '></div>
              ) : isGoodThree ? (
                <div className='good-lift h-16 w-16 rounded-full '></div>
              ) : (
                <div className='bad-lift h-16 w-16 rounded-full '></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CompDayScreen
