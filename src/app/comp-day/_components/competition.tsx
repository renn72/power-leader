'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

import { api } from '~/trpc/react'

import { cn } from '~/lib/utils'

import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group'
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
import { CircleCheckBig, User, UserCheck } from 'lucide-react'

const Competition = ({ competitionId }: { competitionId: number }) => {
    const [lift, setLift] = useState('')
    const [bracket, setBracket] = useState('')
    const [index, setIndex] = useState('')

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
            toast(`${e?.[0]?.lift} set`)
        },
    })

    useEffect(() => {
        if (competition) {
            setLift(competition.compDayInfo.lift)
            setBracket(competition.compDayInfo.bracket.toString())
            setIndex(competition.compDayInfo.index.toString())
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

    console.log('comp', competition)
    console.log({ lift, bracket, index })
    console.log('lifters', lifters)

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
                                    lift: value,
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
                        <div className='text-lg font-bold'>Bracket</div>
                        <ToggleGroup
                            type='single'
                            size='lg'
                            variant='outline'
                            defaultValue={competition.compDayInfo.bracket.toString()}
                            onValueChange={(value) => {
                                setBracket(value)
                            }}
                        >
                            <ToggleGroupItem value='1'>1</ToggleGroupItem>
                            <ToggleGroupItem value='2'>2</ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                    <div className='rounded-md border border-input p-2'>
                        <ScrollArea className='h-[800px]'>
                            <Table
                                className='text-lg'
                            >
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
                                        <TableHead>Squat 2</TableHead>
                                        <TableHead>Squat 3</TableHead>
                                        <TableHead>Bench Rack</TableHead>
                                        <TableHead>Bench 1</TableHead>
                                        <TableHead>Bench 2</TableHead>
                                        <TableHead>Bench 3</TableHead>
                                        <TableHead>Deadlift 1</TableHead>
                                        <TableHead>Deadlift 2</TableHead>
                                        <TableHead>Deadlift 3</TableHead>
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
                                            <TableCell
                                                className=''
                                            >
                                                <Badge
                                                    className='w-14 items-center justify-center'
                                                >
                                                {lifter?.wc?.split('-')[0]}kg
                                                </Badge>
                                            </TableCell>
                                            <TableCell className='text-right'>
                                                {lifter?.squarRackHeight}
                                            </TableCell>
                                            <TableCell
                                                className='p-2'
                                            >
                                                <div
                                                    className={cn('border border-input p-2 rounded-md cursor-pointer',)}
                                                >
                                                {lifter?.lift?.find(
                                                    (item) =>
                                                        item.lift === 'squat' &&
                                                        item.liftNumber === 1,
                                                ) &&
                                                    `${lifter?.lift?.find((item) => item.lift === 'squat' && item.liftNumber === 1)?.weight}kg`}
                                                    </div>
                                            </TableCell>
                                            <TableCell>
                                                {lifter?.lift?.find(
                                                    (item) =>
                                                        item.lift === 'squat' &&
                                                        item.liftNumber === 2,
                                                ) &&
                                                    `${lifter?.lift?.find((item) => item.lift === 'squat' && item.liftNumber === 2)?.weight}kg`}
                                            </TableCell>
                                            <TableCell>
                                                {lifter?.lift?.find(
                                                    (item) =>
                                                        item.lift === 'squat' &&
                                                        item.liftNumber === 3,
                                                ) &&
                                                    `${lifter?.lift?.find((item) => item.lift === 'squat' && item.liftNumber === 3)?.weight}kg`}
                                            </TableCell>
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
                                            <TableCell>
                                                {lifter?.lift?.find(
                                                    (item) =>
                                                        item.lift === 'bench' &&
                                                        item.liftNumber === 2,
                                                ) &&
                                                    `${lifter?.lift?.find((item) => item.lift === 'bench' && item.liftNumber === 2)?.weight}kg`}
                                            </TableCell>
                                            <TableCell>
                                                {lifter?.lift?.find(
                                                    (item) =>
                                                        item.lift === 'bench' &&
                                                        item.liftNumber === 3,
                                                ) &&
                                                    `${lifter?.lift?.find((item) => item.lift === 'bench' && item.liftNumber === 3)?.weight}kg`}
                                            </TableCell>
                                            <TableCell>
                                                {lifter?.lift?.find(
                                                    (item) =>
                                                        item.lift ===
                                                            'deadlift' &&
                                                        item.liftNumber === 1,
                                                ) &&
                                                    `${lifter?.lift?.find((item) => item.lift === 'deadlift' && item.liftNumber === 1)?.weight}kg`}
                                            </TableCell>
                                            <TableCell>
                                                {lifter?.lift?.find(
                                                    (item) =>
                                                        item.lift ===
                                                            'deadlift' &&
                                                        item.liftNumber === 2,
                                                ) &&
                                                    `${lifter?.lift?.find((item) => item.lift === 'deadlift' && item.liftNumber === 2)?.weight}kg`}
                                            </TableCell>
                                            <TableCell>
                                                {lifter?.lift?.find(
                                                    (item) =>
                                                        item.lift ===
                                                            'deadlift' &&
                                                        item.liftNumber === 3,
                                                ) &&
                                                    `${lifter?.lift?.find((item) => item.lift === 'deadlift' && item.liftNumber === 3)?.weight}kg`}
                                            </TableCell>
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
