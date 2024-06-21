'use client'

import { api } from '~/trpc/react'
import { useEffect, useState } from 'react'

import { pusherClient } from '~/lib/pusher'
import Pusher from 'pusher-js'

import { cn } from '~/lib/utils'

const CompDayScreen = ({ params }: { params: { comp: string } }) => {
    const [update, setUpdate] = useState<string[]>([])
    const [lift, setLift] = useState('')
    const [bracket, setBracket] = useState('')
    const [index, setIndex] = useState('')
    const [round, setRound] = useState('')
    const { comp } = params
    const { data: competition } =
        api.competition.getCompetitionByUuid.useQuery(comp)

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
            }) => {
                setLift(data.lift)
                setBracket(data.bracket)
                setIndex(data.index)
                setRound(data.round)
            },
        )
        return () => {
            pusherClient.unsubscribe('competition-' + comp)
        }
    }, [comp])

    useEffect(() => {
        setLift(competition?.compDayInfo.lift || '')
        setBracket(competition?.compDayInfo.bracket.toString() || '')
        setIndex(competition?.compDayInfo.index.toString() || '')
        setRound(competition?.compDayInfo.round.toString() || '')
    }, [competition])

    console.log('comp', competition)

    return (
        <>
            <div
                className={cn(
                    'flex h-full min-h-[calc(100vh-10rem)] w-full flex-col',
                    ' items-center justify-center text-6xl font-bold',
                )}
            >
                <div>
                    <div>lift: {lift}</div>
                    <div>bracket: {bracket}</div>
                    <div>index: {index}</div>
                    <div>round: {round}</div>
                </div>
            </div>
        </>
    )
}

export default CompDayScreen
