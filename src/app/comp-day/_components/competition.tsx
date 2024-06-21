'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

import { api } from '~/trpc/react'
import { pusherClient } from '~/lib/pusher'
import Pusher from 'pusher-js'

import { cn } from '~/lib/utils'

import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group-bold'
import { toast } from 'sonner'
import {
    Card,
    CardContent,
    CardTitle,
    CardHeader,
    CardDescription,
} from '~/components/ui/card'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Badge } from '~/components/ui/badge'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '~/components/ui/table-scroll'
import { Check, Circle, CircleCheckBig, User, UserCheck, X } from 'lucide-react'

const Competition = ({
    competitionId,
    competitonUuid,
}: {
    competitionId: number
    competitonUuid: string
}) => {
    const [lift, setLift] = useState('')
    const [bracket, setBracket] = useState('')
    const [index, setIndex] = useState('')
    const [round, setRound] = useState('')

    const ctx = api.useUtils()

    const { data: competition, isLoading: competitionLoading } =
        api.competition.get.useQuery(competitionId)

    const { mutate: startCompetition } =
        api.competition.startCompetition.useMutation({
            onSettled: () => {
                ctx.competition.get.refetch()
            },
        })
    const { mutate: pauseCompetition } =
        api.competition.pauseCompetition.useMutation({
            onSettled: () => {
                ctx.competition.get.refetch()
            },
        })
    const { mutate: updateLift } = api.competitionDay.updateLift.useMutation({
        onSettled: () => {
            ctx.competition.get.refetch()
        },
        onSuccess: (e) => {
            toast(JSON.stringify(e))
        },
    })
    const { mutate: updateIsLiftGood } =
        api.competitionDay.updateIsLiftGood.useMutation({
            onSettled: () => {
                ctx.competition.get.refetch()
            },
        })

    useEffect(() => {
        if (competition) {
            setLift(competition.compDayInfo.lift)
            setBracket(competition.compDayInfo.bracket.toString())
            setIndex(competition.compDayInfo.index.toString())
            setRound(competition.compDayInfo.round.toString())
        }
    }, [competition])

    useEffect(() => {
        Pusher.logToConsole = true
        const channel = pusherClient.subscribe('competition-' + competitonUuid)

        channel.bind(
            'judge',
            (data: {
                id: number
                entryId: number
                judge: number
                isGood: boolean
            }) => {
                if (!competition) {
                    return
                }
                console.log('data', data)
                ctx.competition.get.setData(competitionId, {
                    ...competition,
                    entries: competition.entries.map((entry) => {
                        return {
                            ...entry,
                            lift: entry.lift.map((i) => {
                                return {
                                    ...i,
                                    isGoodOne:
                                        (i.id === data.id &&
                                        data.judge === 1) ?
                                        data.isGood : i.isGoodOne,
                                    isGoodTwo:
                                        (i.id === data.id &&
                                        data.judge === 2) ?
                                        data.isGood : i.isGoodTwo,
                                    isGoodThree:
                                        (i.id === data.id &&
                                        data.judge === 3) ?
                                        data.isGood : i.isGoodThree,
                                }
                            }),
                        }
                    }),
                })
            },
        )
        return () => {
            pusherClient.unsubscribe('competition-' + competitonUuid)
        }
    }, [competition])

    if (competitionLoading) {
        return (
            <>
                <Skeleton className='h-[100px] w-[800px] rounded-full' />
                <Skeleton className='h-[100px] w-[800px] rounded-full' />
                <Skeleton className='h-[800px] w-[800px] rounded-xl' />
            </>
        )
    }
    if (!competition) {
        return (
            <div className='flex flex-col items-center justify-center gap-2'>
                <div className='font-bold text-destructive'>
                    Competition not found
                </div>
            </div>
        )
    }

    const lifters = competition.entries
        .map((entry) => {
            return { ...entry }
        })
        .filter((entry) => {
            if (lift === 'squat') {
                return entry.squatBracket == Number(bracket)
            } else if (lift === 'bench') {
                return entry.benchBracket == Number(bracket)
            } else if (lift === 'deadlift') {
                return entry.deadliftBracket == Number(bracket)
            }
            return false
        })
        .sort((a, b) => {
            if (a.squatOrder == null || b.squatOrder == null) {
                return 0
            }
            if (a.benchOrder == null || b.benchOrder == null) {
                return 0
            }
            if (a.deadliftOrder == null || b.deadliftOrder == null) {
                return 0
            }
            if (lift === 'squat') {
                return a?.squatOrder - b?.squatOrder
            } else if (lift === 'bench') {
                return a.benchOrder - b.benchOrder
            } else if (lift === 'deadlift') {
                return a.deadliftOrder - b.deadliftOrder
            }
            return 0
        })

    const lifter = lifters.find((l) => {
        if (lift === 'squat') {
            return l.squatOrder == Number(index)
        } else if (lift === 'bench') {
            return l.benchOrder == Number(index)
        } else if (lift === 'deadlift') {
            return l.deadliftOrder == Number(index)
        }
        return false
    })

    const currentLift = lifter?.lift?.find(
        (item) =>
            item.lift === lift.toLowerCase() &&
            item.liftNumber === Number(round),
    )

    console.log('comp', competition)
    console.log('lifter', lifter)
    console.log('currentLift', currentLift)
    // console.log({ lift, bracket, index, round })
    // console.log('lifters', lifters)

    return (
        <div className='flex flex-col items-center justify-center gap-2'>
            <div className='flex w-full items-start gap-2'>
                <Button
                    variant='secondary'
                    className='w-[130px]'
                >
                    <Link href={`/comp-day/screen/${competition.uuid}`}>
                        Screen
                    </Link>
                </Button>
                {competition.currentState === 'closed' ||
                competition.currentState === 'paused' ? (
                    <Button
                        onClick={() => {
                            startCompetition(competition.id)
                        }}
                    >
                        Start
                    </Button>
                ) : (
                    <Button
                        onClick={() => {
                            pauseCompetition(competition.id)
                        }}
                    >
                        Pause
                    </Button>
                )}
            </div>
            <div className='w-full'>
                <h1 className='text-3xl font-bold'>{competition.name}</h1>
                <h2 className='text-lg capitalize text-muted-foreground'>
                    {competition.currentState}
                </h2>
            </div>

            <Card className=''>
                <CardHeader>
                    <CardTitle>Info</CardTitle>
                    <CardDescription className=''></CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col gap-2'>
                    <div className='grid grid-cols-2 gap-2'>
                        <Card>
                            <CardHeader></CardHeader>
                            <CardContent>
                                <div>
                                    {lifter && lifter.user && lifter.user.name}
                                </div>
                                <div>Round {round}</div>
                                <div className='capitalize'>{lift}</div>
                                <div>{currentLift?.weight}kg</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader></CardHeader>
                            <CardContent className='flex w-full justify-around'>
                                <div className='flex flex-col items-center gap-4'>
                                    <Check
                                        className='cursor-pointer'
                                        onClick={() => {
                                            updateIsLiftGood({
                                                id: currentLift?.id || -1,
                                                entryId: lifter?.id || -1,
                                                uuid: competition.uuid || '',
                                                isGoodOne: true,
                                            })
                                        }}
                                    />
                                    <div>
                                        {currentLift?.isGoodOne === null ? (
                                            <Circle
                                                size={44}
                                                strokeWidth={3}
                                            />
                                        ) : currentLift?.isGoodOne ? (
                                            <Circle
                                                strokeWidth={3}
                                                size={44}
                                                className='text-green-700'
                                                fill='green'
                                            />
                                        ) : (
                                            <Circle
                                                strokeWidth={3}
                                                size={44}
                                                className='text-red-600'
                                                fill='#dc2626'
                                            />
                                        )}
                                    </div>
                                    <X
                                        className='cursor-pointer'
                                        onClick={() => {
                                            updateIsLiftGood({
                                                id: currentLift?.id || -1,
                                                entryId: lifter?.id || -1,
                                                uuid: competition.uuid || '',
                                                isGoodOne: false,
                                            })
                                        }}
                                    />
                                    <Button
                                        variant='outline'
                                        className='opacity-50'
                                        size='sm'
                                        onClick={() => {
                                            updateIsLiftGood({
                                                id: currentLift?.id || -1,
                                                entryId: lifter?.id || -1,
                                                uuid: competition.uuid || '',
                                                isGoodOne: null,
                                            })
                                        }}
                                    >
                                        Clear
                                    </Button>
                                </div>
                                <div className='flex flex-col items-center gap-4'>
                                    <Check
                                        className='cursor-pointer'
                                        onClick={() => {
                                            updateIsLiftGood({
                                                id: currentLift?.id || -1,
                                                entryId: lifter?.id || -1,
                                                uuid: competition.uuid || '',
                                                isGoodTwo: true,
                                            })
                                        }}
                                    />
                                    <div>
                                        {currentLift?.isGoodTwo === null ? (
                                            <Circle
                                                size={44}
                                                strokeWidth={3}
                                            />
                                        ) : currentLift?.isGoodTwo ? (
                                            <Circle
                                                strokeWidth={3}
                                                size={44}
                                                className='text-green-700'
                                                fill='green'
                                            />
                                        ) : (
                                            <Circle
                                                strokeWidth={3}
                                                size={44}
                                                className='text-red-600'
                                                fill='#dc2626'
                                            />
                                        )}
                                    </div>
                                    <X
                                        className='cursor-pointer'
                                        onClick={() => {
                                            updateIsLiftGood({
                                                id: currentLift?.id || -1,
                                                entryId: lifter?.id || -1,
                                                uuid: competition.uuid || '',
                                                isGoodTwo: false,
                                            })
                                        }}
                                    />
                                    <Button
                                        variant='outline'
                                        className='opacity-50'
                                        size='sm'
                                        onClick={() => {
                                            updateIsLiftGood({
                                                id: currentLift?.id || -1,
                                                entryId: lifter?.id || -1,
                                                uuid: competition.uuid || '',
                                                isGoodTwo: null,
                                            })
                                        }}
                                    >
                                        Clear
                                    </Button>
                                </div>
                                <div className='flex flex-col items-center gap-4'>
                                    <Check
                                        className='cursor-pointer'
                                        onClick={() => {
                                            updateIsLiftGood({
                                                id: currentLift?.id || -1,
                                                entryId: lifter?.id || -1,
                                                uuid: competition.uuid || '',
                                                isGoodThree: true,
                                            })
                                        }}
                                    />
                                    <div>
                                        {currentLift?.isGoodThree === null ? (
                                            <Circle
                                                size={44}
                                                strokeWidth={3}
                                            />
                                        ) : currentLift?.isGoodThree ? (
                                            <Circle
                                                strokeWidth={3}
                                                size={44}
                                                className='text-green-700'
                                                fill='green'
                                            />
                                        ) : (
                                            <Circle
                                                strokeWidth={3}
                                                size={44}
                                                className='text-red-600'
                                                fill='#dc2626'
                                            />
                                        )}
                                    </div>
                                    <X
                                        className='cursor-pointer'
                                        onClick={() => {
                                            updateIsLiftGood({
                                                id: currentLift?.id || -1,
                                                entryId: lifter?.id || -1,
                                                uuid: competition.uuid || '',
                                                isGoodThree: false,
                                            })
                                        }}
                                    />
                                    <Button
                                        variant='outline'
                                        className='opacity-50'
                                        size='sm'
                                        onClick={() => {
                                            updateIsLiftGood({
                                                id: currentLift?.id || -1,
                                                entryId: lifter?.id || -1,
                                                uuid: competition.uuid || '',
                                                isGoodThree: null,
                                            })
                                        }}
                                    >
                                        Clear
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className='grid grid-cols-3 gap-2'>
                        <div className='hidden'>
                            <div>Day</div>
                            <div>{competition.compDayInfo.day + 1}</div>
                        </div>
                        <div className='rounded-md border border-input p-2'>
                            <div className='text-lg font-bold'>Lift</div>
                            <ToggleGroup
                                type='single'
                                variant='outline'
                                size='lg'
                                defaultValue={competition.compDayInfo.lift.toLowerCase()}
                                onValueChange={(value) => {
                                    setLift(value)
                                    updateLift({
                                        id: competition.id,
                                        uuid: competition.uuid || '',
                                        round: +round,
                                        lift: value,
                                        bracket: +bracket,
                                        index: +index,
                                    })
                                }}
                            >
                                <ToggleGroupItem value='squat'>
                                    Squat
                                </ToggleGroupItem>
                                <ToggleGroupItem value='bench'>
                                    Bench
                                </ToggleGroupItem>
                                <ToggleGroupItem value='deadlift'>
                                    Deadlift
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </div>
                        <div className='rounded-md border border-input p-2'>
                            <div className='text-lg font-bold'>Round</div>
                            <ToggleGroup
                                type='single'
                                size='lg'
                                variant='outline'
                                defaultValue={competition.compDayInfo.round.toString()}
                                onValueChange={(value) => {
                                    setRound(value)
                                    updateLift({
                                        id: competition.id,
                                        uuid: competition.uuid || '',
                                        round: +value,
                                        lift: lift,
                                        bracket: +bracket,
                                        index: +index,
                                    })
                                }}
                            >
                                <ToggleGroupItem value='1'>1</ToggleGroupItem>
                                <ToggleGroupItem value='2'>2</ToggleGroupItem>
                                <ToggleGroupItem value='3'>3</ToggleGroupItem>
                            </ToggleGroup>
                        </div>
                        <div className='rounded-md border border-input p-2'>
                            <div className='text-lg font-bold'>Bracket</div>
                            <ToggleGroup
                                type='single'
                                size='lg'
                                variant='outline'
                                defaultValue={competition.compDayInfo.bracket.toString()}
                                onValueChange={(value) => {
                                    setBracket(value)
                                    updateLift({
                                        id: competition.id,
                                        uuid: competition.uuid || '',
                                        round: +round,
                                        lift: lift,
                                        bracket: +value,
                                        index: +index,
                                    })
                                }}
                            >
                                <ToggleGroupItem value='1'>1</ToggleGroupItem>
                                <ToggleGroupItem value='2'>2</ToggleGroupItem>
                            </ToggleGroup>
                        </div>
                    </div>
                    <div className='rounded-md border border-input p-2'>
                        <ScrollArea className='h-[700px]'>
                            <Table className='text-lg'>
                                <TableCaption>
                                    A list of your recent invoices.
                                </TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>WC</TableHead>
                                        <TableHead>Squat Rack</TableHead>
                                        <TableHead>Squat 1</TableHead>
                                        <TableHead></TableHead>
                                        <TableHead>Squat 2</TableHead>
                                        <TableHead></TableHead>
                                        <TableHead>Squat 3</TableHead>
                                        <TableHead></TableHead>
                                        <TableHead>Bench Rack</TableHead>
                                        <TableHead>Bench 1</TableHead>
                                        <TableHead></TableHead>
                                        <TableHead>Bench 2</TableHead>
                                        <TableHead></TableHead>
                                        <TableHead>Bench 3</TableHead>
                                        <TableHead></TableHead>
                                        <TableHead>Deadlift 1</TableHead>
                                        <TableHead></TableHead>
                                        <TableHead>Deadlift 2</TableHead>
                                        <TableHead></TableHead>
                                        <TableHead>Deadlift 3</TableHead>
                                        <TableHead></TableHead>
                                        <TableHead>Lifting</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className='h-40 overflow-y-auto'>
                                    {lifters.map((lifter, i) => (
                                        <TableRow
                                            key={lifter.id}
                                            className={cn(
                                                +index === i
                                                    ? 'bg-secondary'
                                                    : '',
                                            )}
                                        >
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell>
                                                {lifter?.user?.name}
                                            </TableCell>
                                            <TableCell className=''>
                                                <Badge className='w-14 items-center justify-center'>
                                                    {lifter?.wc?.split('-')[0]}
                                                    kg
                                                </Badge>
                                            </TableCell>
                                            <TableCell className='text-right'>
                                                {lifter?.squarRackHeight}
                                            </TableCell>
                                            <TableCell className='p-2'>
                                                <div
                                                    className={cn(
                                                        'cursor-pointer rounded-md border border-input p-2',
                                                    )}
                                                >
                                                    {lifter?.lift?.find(
                                                        (item) =>
                                                            item.lift ===
                                                                'squat' &&
                                                            item.liftNumber ===
                                                                1,
                                                    ) &&
                                                        `${lifter?.lift?.find((item) => item.lift === 'squat' && item.liftNumber === 1)?.weight}kg`}
                                                </div>
                                            </TableCell>
                                            <TableCell className=''></TableCell>
                                            <TableCell>
                                                {lifter?.lift?.find(
                                                    (item) =>
                                                        item.lift === 'squat' &&
                                                        item.liftNumber === 2,
                                                ) &&
                                                    `${lifter?.lift?.find((item) => item.lift === 'squat' && item.liftNumber === 2)?.weight}kg`}
                                            </TableCell>
                                            <TableCell className=''></TableCell>
                                            <TableCell>
                                                {lifter?.lift?.find(
                                                    (item) =>
                                                        item.lift === 'squat' &&
                                                        item.liftNumber === 3,
                                                ) &&
                                                    `${lifter?.lift?.find((item) => item.lift === 'squat' && item.liftNumber === 3)?.weight}kg`}
                                            </TableCell>
                                            <TableCell className=''></TableCell>
                                            <TableCell>
                                                {lifter?.benchRackHeight}
                                            </TableCell>
                                            <TableCell>
                                                {lifter?.lift?.find(
                                                    (item) =>
                                                        item.lift === 'bench' &&
                                                        item.liftNumber === 1,
                                                ) &&
                                                    `${lifter?.lift?.find((item) => item.lift === 'bench' && item.liftNumber === 1)?.weight}kg`}
                                            </TableCell>
                                            <TableCell className=''></TableCell>
                                            <TableCell>
                                                {lifter?.lift?.find(
                                                    (item) =>
                                                        item.lift === 'bench' &&
                                                        item.liftNumber === 2,
                                                ) &&
                                                    `${lifter?.lift?.find((item) => item.lift === 'bench' && item.liftNumber === 2)?.weight}kg`}
                                            </TableCell>
                                            <TableCell className=''></TableCell>
                                            <TableCell>
                                                {lifter?.lift?.find(
                                                    (item) =>
                                                        item.lift === 'bench' &&
                                                        item.liftNumber === 3,
                                                ) &&
                                                    `${lifter?.lift?.find((item) => item.lift === 'bench' && item.liftNumber === 3)?.weight}kg`}
                                            </TableCell>
                                            <TableCell className=''></TableCell>
                                            <TableCell>
                                                {lifter?.lift?.find(
                                                    (item) =>
                                                        item.lift ===
                                                            'deadlift' &&
                                                        item.liftNumber === 1,
                                                ) &&
                                                    `${lifter?.lift?.find((item) => item.lift === 'deadlift' && item.liftNumber === 1)?.weight}kg`}
                                            </TableCell>
                                            <TableCell className=''></TableCell>
                                            <TableCell>
                                                {lifter?.lift?.find(
                                                    (item) =>
                                                        item.lift ===
                                                            'deadlift' &&
                                                        item.liftNumber === 2,
                                                ) &&
                                                    `${lifter?.lift?.find((item) => item.lift === 'deadlift' && item.liftNumber === 2)?.weight}kg`}
                                            </TableCell>
                                            <TableCell className=''></TableCell>
                                            <TableCell>
                                                {lifter?.lift?.find(
                                                    (item) =>
                                                        item.lift ===
                                                            'deadlift' &&
                                                        item.liftNumber === 3,
                                                ) &&
                                                    `${lifter?.lift?.find((item) => item.lift === 'deadlift' && item.liftNumber === 3)?.weight}kg`}
                                            </TableCell>
                                            <TableCell className=''></TableCell>
                                            <TableCell>
                                                {+index === i ? (
                                                    <Button
                                                        variant='ghost'
                                                        className='cursor-auto text-complete hover:bg-muted/10 hover:text-complete'
                                                    >
                                                        <UserCheck
                                                            size={32}
                                                            strokeWidth={3}
                                                            className={cn('')}
                                                        />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant='ghost'
                                                        className='hover:text-muted-foreground'
                                                        onClick={() => {
                                                            setIndex(
                                                                i.toString(),
                                                            )
                                                            updateLift({
                                                                id: competition.id,
                                                                uuid:
                                                                    competition.uuid ||
                                                                    '',
                                                                round: +round,
                                                                lift: lift,
                                                                bracket:
                                                                    +bracket,
                                                                index: i,
                                                            })
                                                        }}
                                                    >
                                                        <User
                                                            size={24}
                                                            className={cn('')}
                                                        />
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Competition
