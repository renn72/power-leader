'use client'
import { useState } from 'react'

import { api } from '~/trpc/react'

import type { GetCompetitionById, GetCompetitionEntryById } from '~/lib/types'
import { cn } from '~/lib/utils'

import { Badge } from '~/components/ui/badge'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '~/components/ui/card'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'

import { ChevronLeft, ChevronRight } from 'lucide-react'

const Bracket = ({
    entries,
    lift,
    title,
    bracket,
}: {
    entries: GetCompetitionEntryById[]
    lift: string
    title: string
    bracket: number
}) => {
    const ctx = api.useUtils()
    const { mutate: updateOrder } = api.compEntry.updateOrder.useMutation({
        onSettled: () => {
            ctx.competition.getMyCompetitions.refetch()
        },
    })

    const commit = () => {
        if (lift === 'squat') {
            for (const [i, entry] of entries.entries()) {
                updateOrder({
                    id: entry.id,
                    squatOrder: i,
                    squatBracket: bracket,
                })
            }
        } else if (lift === 'bench') {
            for (const [i, entry] of entries.entries()) {
                updateOrder({
                    id: entry.id,
                    benchOrder: i,
                    benchBracket: bracket,
                })
            }
        } else if (lift === 'deadlift') {
            for (const [i, entry] of entries.entries()) {
                updateOrder({
                    id: entry.id,
                    deadliftOrder: i,
                    deadliftBracket: bracket,
                })
            }
        }
    }
    return (
        <Card>
            <CardHeader className='mb-4'>
                <CardTitle className='flex items-center justify-around text-3xl'>
                    <span className=''>{title}</span>
                    <Button
                        onClick={commit}
                        size='sm'
                        variant='secondary'
                    >
                        Commit
                    </Button>
                </CardTitle>
                <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
                <div className='flex flex-col gap-2'>
                    {entries.map((entry, i, arr) => {
                        const opener =
                            lift === 'squat'
                                ? entry.squatOpener
                                : lift === 'bench'
                                  ? entry.benchOpener
                                  : entry.deadliftOpener
                        return (
                            <div
                                key={entry.id}
                                className={cn(
                                    'grid grid-cols-6 place-items-center gap-2 border border-input',
                                    'rounded-full p-1 hover:bg-muted',
                                    entry.wc !== arr[i + 1]?.wc ? 'mb-4' : '',
                                    lift === 'squat' &&
                                        entry.squatOrder !== null &&
                                        'border-complete',
                                    lift === 'bench' &&
                                        entry.benchOrder !== null &&
                                        'border-complete',
                                    lift === 'deadlift' &&
                                        entry.deadliftOrder !== null &&
                                        'border-complete',
                                )}
                            >
                                <div className='text-xs text-muted-foreground'>
                                    {i + 1}
                                </div>
                                <Badge className='flex w-16 items-center justify-center'>
                                    {entry.wc?.split('-')[0]}kg
                                </Badge>
                                <div className='col-span-2'>
                                    {entry.user?.name}
                                </div>
                                <div className='col-span-2'>{opener}kg</div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}

const UpdateComp = ({
    title,
    children,
}: {
    title: string
    children: React.ReactNode
}) => {
    return (
        <Card className='flex flex-col items-center gap-2'>
            <CardHeader>
                <CardTitle className='text-xl'>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className='flex items-center gap-2 text-xl font-bold'>
                    {children}
                </div>
            </CardContent>
        </Card>
    )
}

const Competition = ({ competition }: { competition: GetCompetitionById }) => {
    const ctx = api.useUtils()
    const { mutate: updateDaysOfCompetition } =
        api.competition.updateDaysOfCompetition.useMutation({
            onSettled: () => {
                ctx.competition.getMyCompetitions.refetch()
                toast('Updated')
            },
        })

    const { mutate: updatePlatforms } =
        api.competition.updatePlatforms.useMutation({
            onSettled: () => {
                ctx.competition.getMyCompetitions.refetch()
                toast('Updated')
            },
        })

    //squat
    const menSquat = competition.entries
        .filter((entry) => entry.gender?.toLowerCase() == 'male')
        .map((e) => {
            return {
                ...e,
                wc: e.wc || '',
            }
        })
        .sort((a, b) => Number(a.squatOpener) - Number(b.squatOpener))
        .sort((a, b) => Number(a.wc.split('-')[0]) - Number(b.wc.split('-')[0]))

    const womenSquat = competition.entries
        .filter((entry) => entry.gender?.toLowerCase() == 'female')
        .map((e) => {
            return {
                ...e,
                wc: e.wc || '',
            }
        })
        .sort((a, b) => Number(a.squatOpener) - Number(b.squatOpener))
        .sort((a, b) => Number(a.wc.split('-')[0]) - Number(b.wc.split('-')[0]))

    //bench
    const menBench = competition.entries
        .filter((entry) => entry.gender?.toLowerCase() == 'male')
        .map((e) => {
            return {
                ...e,
                wc: e.wc || '',
            }
        })
        .sort((a, b) => Number(a.benchOpener) - Number(b.benchOpener))
        .sort((a, b) => Number(a.wc.split('-')[0]) - Number(b.wc.split('-')[0]))

    const womenBench = competition.entries
        .filter((entry) => entry.gender?.toLowerCase() == 'female')
        .map((e) => {
            return {
                ...e,
                wc: e.wc || '',
            }
        })
        .sort((a, b) => Number(a.benchOpener) - Number(b.benchOpener))
        .sort((a, b) => Number(a.wc.split('-')[0]) - Number(b.wc.split('-')[0]))

    //Dead
    const menDead = competition.entries
        .filter((entry) => entry.gender?.toLowerCase() == 'male')
        .map((e) => {
            return {
                ...e,
                wc: e.wc || '',
            }
        })
        .sort((a, b) => Number(a.deadliftOpener) - Number(b.deadliftOpener))
        .sort((a, b) => Number(a.wc.split('-')[0]) - Number(b.wc.split('-')[0]))
    const womenDead = competition.entries
        .filter((entry) => entry.gender?.toLowerCase() == 'female')
        .map((e) => {
            return {
                ...e,
                wc: e.wc || '',
            }
        })
        .sort((a, b) => Number(a.deadliftOpener) - Number(b.deadliftOpener))
        .sort((a, b) => Number(a.wc.split('-')[0]) - Number(b.wc.split('-')[0]))

    return (
        <div className=' flex w-full flex-col  items-center gap-8'>
            <div className='flex w-full max-w-sm items-center justify-between'>
                <UpdateComp title='Days'>
                    <ChevronLeft
                        size={32}
                        strokeWidth={3}
                        className='cursor-pointer hover:scale-110 hover:text-muted-foreground'
                        onClick={() => {
                            if (competition?.daysOfCompetition == 1) {
                                toast('You can not delete the first day')
                                return
                            }
                            updateDaysOfCompetition({
                                id: competition.id,
                                daysOfCompetition:
                                    Number(competition?.daysOfCompetition) - 1,
                            })
                        }}
                    />
                    <div>{competition.daysOfCompetition}</div>
                    <ChevronRight
                        size={32}
                        strokeWidth={3}
                        className='cursor-pointer hover:scale-110 hover:text-muted-foreground'
                        onClick={() => {
                            updateDaysOfCompetition({
                                id: competition.id,
                                daysOfCompetition:
                                    Number(competition?.daysOfCompetition) + 1,
                            })
                        }}
                    />
                </UpdateComp>
                <UpdateComp title='Platforms'>
                    <ChevronLeft
                        size={32}
                        strokeWidth={3}
                        className='cursor-pointer hover:scale-110 hover:text-muted-foreground'
                        onClick={() => {
                            if (competition?.platforms == 1) {
                                toast('You need to have at least one platform')
                                return
                            }
                            updatePlatforms({
                                id: competition.id,
                                platforms: Number(competition?.platforms) - 1,
                            })
                        }}
                    />
                    <div>{competition.platforms}</div>
                    <ChevronRight
                        size={32}
                        strokeWidth={3}
                        className='cursor-pointer hover:scale-110 hover:text-muted-foreground '
                        onClick={() => {
                            updatePlatforms({
                                id: competition.id,
                                platforms: Number(competition?.platforms) + 1,
                            })
                        }}
                    />
                </UpdateComp>
            </div>
            <div className='flex w-full justify-center gap-16'>
                <Bracket
                    entries={menSquat}
                    lift='squat'
                    title={`Men\'s Squat`}
                    bracket={1}
                />
                <Bracket
                    entries={womenSquat}
                    lift='squat'
                    title={`Women\'s Squat`}
                    bracket={2}
                />
            </div>
            <div className='flex w-full justify-center gap-16'>
                <Bracket
                    entries={menBench}
                    lift='bench'
                    title={`Men\'s Bench`}
                    bracket={1}
                />
                <Bracket
                    entries={womenBench}
                    lift='bench'
                    title={`Women\'s Bench`}
                    bracket={2}
                />
            </div>
            <div className='flex w-full justify-center gap-16'>
                <Bracket
                    entries={menDead}
                    lift='deadlift'
                    title={`Men\'s Deadlift`}
                    bracket={1}
                />
                <Bracket
                    entries={womenDead}
                    lift='deadlift'
                    title={`Women\'s Deadlift`}
                    bracket={2}
                />
            </div>
        </div>
    )
}

export default Competition
