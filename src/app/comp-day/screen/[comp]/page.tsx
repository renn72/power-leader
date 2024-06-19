'use client'

import { api } from '~/trpc/react'
import { useEffect, useState } from 'react'

import { pusherClient } from '~/lib/pusher'
import Pusher from 'pusher-js'

import { cn } from '~/lib/utils'

const CompDayScreen = ({ params }: { params: { comp: string } }) => {
    const [update, setUpdate] = useState<string[]>([])
    const [lift, setLift] = useState<string>('')
    const { comp } = params
    const { data: competition } =
        api.competition.getCompetitionByUuid.useQuery(comp)

    useEffect(() => {
        console.log('channel', 'competition-' + comp)
        Pusher.logToConsole = true
        const channel = pusherClient.subscribe('competition-' + comp)
        channel.bind('update', (data : { data: string }) => {
            setLift(data.data)
        })
        return () => {
            pusherClient.unsubscribe('competition-' + comp)
        }
    }, [comp])

    useEffect(() => {
        setLift(competition?.compDayInfo.lift || '')
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
                {lift}
            </div>
        </>
    )
}

export default CompDayScreen
