'use client'
import { api } from '~/trpc/react'
import { useEffect, useState } from 'react'

import { pusherClient } from '~/lib/pusher'

import { cn } from '~/lib/utils'

const CompDayScreen = ({ params }: { params: { comp: string } }) => {
    const [update, setUpdate] = useState<string[]>([])
    const { comp } = params
    console.log(comp)
    const { data: competition } =
        api.competition.getCompetitionByUuid.useQuery(comp)

    useEffect(() => {
        pusherClient.subscribe('competition-' + comp)
        pusherClient.bind('update', (data : string) => {
            setUpdate((prev) => [...prev, data])
        })
        return () => {
            pusherClient.unsubscribe('competition-' + comp)
        }
    }, [comp])

    console.log('update', update)

    return (
        <>
            <div
                className={cn(
                    'flex h-full min-h-[calc(100vh-10rem)] w-full flex-col',
                    ' animate-pulse items-center justify-center text-6xl font-bold',
                )}
            >
                {competition?.compDayInfo.lift}
            </div>
        </>
    )
}

export default CompDayScreen
