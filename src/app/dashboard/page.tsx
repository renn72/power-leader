'use client'
import { useState } from 'react'
import { api } from '~/trpc/react'
import Link from 'next/link'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '~/components/ui/table'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '~/components/ui/hover-card'
import Create from '~/app/_components/create'

export const dynamic = 'force-dynamic'

export default function Dashboard() {
    const [isOpenClosing, setIsOpenClosing] = useState(false)
    const [open, setOpen] = useState('Open')
    const [close, setClose] = useState('Close')

    const { data: competitions, isLoading: competitionsLoading } =
        api.competition.getMyCompetitions.useQuery()

    const { data: allCompetitions, isLoading: allCompetitionsLoading } =
        api.competition.getAll.useQuery()

    const ctx = api.useUtils()

    const { mutate: openCompetition } =
        api.competition.openCompetition.useMutation({
            onMutate: () => {
                setIsOpenClosing(true)
                setOpen('Opening...')
            },
            onSettled: async () => {
                await ctx.competition.getMyCompetitions.refetch()
                setIsOpenClosing(false)
                setOpen('Open')
            },
        })

    const { mutate: closeCompetition } =
        api.competition.closeCompetition.useMutation({
            onMutate: () => {
                setIsOpenClosing(true)
                setClose('Closing...')
            },
            onSettled: async () => {
                await ctx.competition.getMyCompetitions.refetch()
                setIsOpenClosing(false)
                setClose('Close')
            },
        })

    return (
        <section className='mt-8 flex h-full grow flex-col'>
            <Tabs
                defaultValue='competition'
                orientation='vertical'
                className='flex h-full grow  flex-col space-x-2 lg:flex-row'
            >
                <div className='lg:min-h-[calc(100vh - 10rem)] rounded-md bg-muted p-2'>
                    <TabsList className='flex h-full w-36 justify-start gap-6 space-x-2 lg:flex-col'>
                        <TabsTrigger
                            value='join'
                            className='w-28'
                        >
                            Join
                        </TabsTrigger>
                        <TabsTrigger
                            value='competition'
                            className='w-28'
                        >
                            Competition
                        </TabsTrigger>
                        <TabsTrigger
                            value='create'
                            className='w-28'
                        >
                            Create
                        </TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent
                    className='min-h-[calc(100vh - 10rem)] w-full'
                    value='join'
                >
                    <section className='grid h-full grid-cols-1 place-content-between gap-4'>
                        {competitionsLoading ? (
                            <div className='flex flex-col items-center justify-center gap-2'>
                                <div className='animate-spin'>
                                    <div className='h-4 w-4 rounded-full border-b-2 border-t-2 border-border' />
                                </div>
                            </div>
                        ) : (
                            <Table>
                                <TableCaption>Competitions</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Venue</TableHead>
                                        <TableHead>Federation</TableHead>
                                        <TableHead>City</TableHead>
                                        <TableHead>State</TableHead>
                                        <TableHead>Country</TableHead>
                                        <TableHead>Events</TableHead>
                                        <TableHead>Equipment</TableHead>
                                        <TableHead>Formula</TableHead>
                                        <TableHead>WC Men</TableHead>
                                        <TableHead>WC Women</TableHead>
                                        <TableHead>WC Mix</TableHead>
                                        <TableHead>Divisions</TableHead>
                                        <TableHead>Information</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allCompetitions?.map((competition) => (
                                        <TableRow key={competition.id}>
                                            <TableCell>
                                                {new Date(
                                                    competition.date || '',
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                {competition.name}
                                            </TableCell>
                                            <TableCell>
                                                {competition.venue}
                                            </TableCell>
                                            <TableCell>
                                                {competition.federation}
                                            </TableCell>
                                            <TableCell>
                                                {competition.city}
                                            </TableCell>
                                            <TableCell>
                                                {competition.state}
                                            </TableCell>
                                            <TableCell>
                                                {competition.country}
                                            </TableCell>
                                            <TableCell>
                                                {competition.events
                                                    ?.split('/')
                                                    .map((event) => (
                                                        <div
                                                            key={event}
                                                            className='text-nowrap'
                                                        >
                                                            {event}
                                                        </div>
                                                    ))}
                                            </TableCell>
                                            <TableCell>
                                                {competition.equipment
                                                    ?.split('/')
                                                    .map((event) => (
                                                        <div
                                                            key={event}
                                                            className='text-nowrap'
                                                        >
                                                            {event}
                                                        </div>
                                                    ))}
                                            </TableCell>
                                            <TableCell>
                                                {competition.formular}
                                            </TableCell>
                                            <TableCell>
                                                <HoverCard>
                                                    <HoverCardTrigger>
                                                        <div className='flex gap-1'>
                                                            {competition.wc_male
                                                                ?.split('/')
                                                                .slice(0, 3)
                                                                .map(
                                                                    (event) => (
                                                                        <div
                                                                            key={
                                                                                event
                                                                            }
                                                                            className='text-nowrap'
                                                                        >
                                                                            {
                                                                                event
                                                                            }
                                                                            kg
                                                                        </div>
                                                                    ),
                                                                )}
                                                            {competition.wc_male &&
                                                                competition.wc_male?.split(
                                                                    '/',
                                                                )?.length >
                                                                    3 && (
                                                                    <div className='text-nowrap'>
                                                                        ...
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </HoverCardTrigger>
                                                    <HoverCardContent>
                                                        <div className='grid grid-cols-4 gap-1'>
                                                            {competition.wc_male
                                                                ?.split('/')
                                                                .map(
                                                                    (event) => (
                                                                        <div
                                                                            key={
                                                                                event
                                                                            }
                                                                            className='text-nowrap'
                                                                        >
                                                                            {
                                                                                event
                                                                            }
                                                                            kg
                                                                        </div>
                                                                    ),
                                                                )}
                                                        </div>
                                                    </HoverCardContent>
                                                </HoverCard>
                                            </TableCell>
                                            <TableCell>
                                                <HoverCard>
                                                    <HoverCardTrigger>
                                                        <div className='flex gap-1'>
                                                            {competition.wc_female
                                                                ?.split('/')
                                                                .slice(0, 3)
                                                                .map(
                                                                    (event) => (
                                                                        <div
                                                                            key={
                                                                                event
                                                                            }
                                                                            className='text-nowrap'
                                                                        >
                                                                            {
                                                                                event
                                                                            }
                                                                            kg
                                                                        </div>
                                                                    ),
                                                                )}
                                                            {competition.wc_female &&
                                                                competition.wc_female?.split(
                                                                    '/',
                                                                )?.length >
                                                                    3 && (
                                                                    <div className='text-nowrap'>
                                                                        ...
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </HoverCardTrigger>
                                                    <HoverCardContent>
                                                        <div className='grid grid-cols-4 gap-1'>
                                                            {competition.wc_female
                                                                ?.split('/')
                                                                .map(
                                                                    (event) => (
                                                                        <div
                                                                            key={
                                                                                event
                                                                            }
                                                                            className='text-nowrap'
                                                                        >
                                                                            {
                                                                                event
                                                                            }
                                                                            kg
                                                                        </div>
                                                                    ),
                                                                )}
                                                        </div>
                                                    </HoverCardContent>
                                                </HoverCard>
                                            </TableCell>
                                            <TableCell>
                                                <HoverCard>
                                                    <HoverCardTrigger>
                                                        <div className='flex gap-1'>
                                                            {competition.wc_mix
                                                                ?.split('/')
                                                                .slice(0, 3)
                                                                .map(
                                                                    (event) => (
                                                                        <div
                                                                            key={
                                                                                event
                                                                            }
                                                                            className='text-nowrap'
                                                                        >
                                                                            {
                                                                                event
                                                                            }
                                                                            kg
                                                                        </div>
                                                                    ),
                                                                )}
                                                            {competition.wc_mix &&
                                                                competition.wc_mix?.split(
                                                                    '/',
                                                                )?.length >
                                                                    3 && (
                                                                    <div className='text-nowrap'>
                                                                        ...
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </HoverCardTrigger>
                                                    <HoverCardContent>
                                                        <div className='grid grid-cols-4 gap-1'>
                                                            {competition.wc_mix
                                                                ?.split('/')
                                                                .map(
                                                                    (event) => (
                                                                        <div
                                                                            key={
                                                                                event
                                                                            }
                                                                            className='text-nowrap'
                                                                        >
                                                                            {
                                                                                event
                                                                            }
                                                                            kg
                                                                        </div>
                                                                    ),
                                                                )}
                                                        </div>
                                                    </HoverCardContent>
                                                </HoverCard>
                                            </TableCell>
                                            <TableCell>
                                                <HoverCard>
                                                    <HoverCardTrigger>
                                                        <div className='flex flex-col gap-1'>
                                                            {competition.divisions
                                                                ?.slice(0, 3)
                                                                .map(
                                                                    (
                                                                        division,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                division.id
                                                                            }
                                                                            className='text-nowrap'
                                                                        >
                                                                            {
                                                                                division.name
                                                                            }
                                                                        </div>
                                                                    ),
                                                                )}
                                                            {competition
                                                                .divisions
                                                                ?.length >
                                                                3 && (
                                                                <div className='text-nowrap'>
                                                                    ...
                                                                </div>
                                                            )}
                                                        </div>
                                                    </HoverCardTrigger>
                                                    <HoverCardContent>
                                                        <div className='flex flex-col gap-1'>
                                                            <div className='grid grid-cols-6 gap-1'>
                                                                <div className='col-span-2'>
                                                                    Name
                                                                </div>
                                                                <div>Min</div>
                                                                <div>Max</div>
                                                                <div className='col-span-2'>
                                                                    Info
                                                                </div>
                                                            </div>
                                                            {competition.divisions.map(
                                                                (
                                                                    division,
                                                                    i,
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            division.id
                                                                        }
                                                                        className='grid grid-cols-6 gap-1'
                                                                    >
                                                                        {i !==
                                                                            0 && (
                                                                            <Separator className='col-span-6' />
                                                                        )}
                                                                        <div className='col-span-2'>
                                                                            {
                                                                                division.name
                                                                            }
                                                                        </div>
                                                                        <div>
                                                                            {division.minAge ||
                                                                                '-'}
                                                                        </div>
                                                                        <div>
                                                                            {division.maxAge ||
                                                                                '-'}
                                                                        </div>
                                                                        <div className='col-span-2'>
                                                                            {
                                                                                division.info
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    </HoverCardContent>
                                                </HoverCard>
                                            </TableCell>
                                            <TableCell>
                                                {competition.notes}
                                            </TableCell>
                                            <TableCell>
                                                {(competition.currentState ===
                                                    '' ||
                                                    competition.currentState ===
                                                        null ||
                                                    competition.currentState ===
                                                        'closed') && (
                                                    <div className='flex flex-col items-center gap-2'>
                                                        <div className='font-bold text-destructive'>
                                                            Closed
                                                        </div>
                                                        <Button
                                                            variant='outline_card'
                                                            className='min-w-[130px]'
                                                            onClick={() => {
                                                                openCompetition(
                                                                    competition.id,
                                                                )
                                                            }}
                                                        >
                                                            {isOpenClosing && (
                                                                <div className='mr-3 animate-spin'>
                                                                    <div className='h-4 w-4 rounded-full border-b-2 border-t-2 border-border' />
                                                                </div>
                                                            )}
                                                            {open}
                                                        </Button>
                                                    </div>
                                                )}
                                                {competition.currentState ===
                                                    'open' && (
                                                    <div className='flex flex-col items-center gap-2'>
                                                        <div className='font-bold text-secondary'>
                                                            Open
                                                        </div>
                                                        <Button
                                                            variant='outline_card'
                                                            className='min-w-[130px]'
                                                            onClick={() => {
                                                                closeCompetition(
                                                                    competition.id,
                                                                )
                                                            }}
                                                        >
                                                            {isOpenClosing && (
                                                                <div className='mr-3 animate-spin'>
                                                                    <div className='h-4 w-4 rounded-full border-b-2 border-t-2 border-border' />
                                                                </div>
                                                            )}
                                                            {close}
                                                        </Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                        <Link href='/dashboard/create'>
                            <Button>Create</Button>
                        </Link>
                    </section>
                </TabsContent>

                <TabsContent
                    className='min-h-[calc(100vh - 10rem)] w-full'
                    value='competition'
                >
                    <section className='grid h-full grid-cols-1 place-content-between gap-4'>
                        {competitionsLoading ? (
                            <div className='flex flex-col items-center justify-center gap-2'>
                                <div className='animate-spin'>
                                    <div className='h-4 w-4 rounded-full border-b-2 border-t-2 border-border' />
                                </div>
                            </div>
                        ) : (
                            <Table>
                                <TableCaption>Competitions</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Venue</TableHead>
                                        <TableHead>Federation</TableHead>
                                        <TableHead>City</TableHead>
                                        <TableHead>State</TableHead>
                                        <TableHead>Country</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Days</TableHead>
                                        <TableHead>Platforms</TableHead>
                                        <TableHead>Rules</TableHead>
                                        <TableHead>Events</TableHead>
                                        <TableHead>Equipment</TableHead>
                                        <TableHead>Formula</TableHead>
                                        <TableHead>WC Men</TableHead>
                                        <TableHead>WC Women</TableHead>
                                        <TableHead>WC Mix</TableHead>
                                        <TableHead>Divisions</TableHead>
                                        <TableHead>Information</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {competitions?.map((competition) => (
                                        <TableRow key={competition.id}>
                                            <TableCell>
                                                {competition.name}
                                            </TableCell>
                                            <TableCell>
                                                {competition.venue}
                                            </TableCell>
                                            <TableCell>
                                                {competition.federation}
                                            </TableCell>
                                            <TableCell>
                                                {competition.city}
                                            </TableCell>
                                            <TableCell>
                                                {competition.state}
                                            </TableCell>
                                            <TableCell>
                                                {competition.country}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    competition.date || '',
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                {competition.daysOfCompetition}
                                            </TableCell>
                                            <TableCell>
                                                {competition.platforms}
                                            </TableCell>
                                            <TableCell>
                                                {competition.rules}
                                            </TableCell>
                                            <TableCell>
                                                {competition.events
                                                    ?.split('/')
                                                    .map((event) => (
                                                        <div
                                                            key={event}
                                                            className='text-nowrap'
                                                        >
                                                            {event}
                                                        </div>
                                                    ))}
                                            </TableCell>
                                            <TableCell>
                                                {competition.equipment
                                                    ?.split('/')
                                                    .map((event) => (
                                                        <div
                                                            key={event}
                                                            className='text-nowrap'
                                                        >
                                                            {event}
                                                        </div>
                                                    ))}
                                            </TableCell>
                                            <TableCell>
                                                {competition.formular}
                                            </TableCell>
                                            <TableCell>
                                                <HoverCard>
                                                    <HoverCardTrigger>
                                                        <div className='flex gap-1'>
                                                            {competition.wc_male
                                                                ?.split('/')
                                                                .slice(0, 3)
                                                                .map(
                                                                    (event) => (
                                                                        <div
                                                                            key={
                                                                                event
                                                                            }
                                                                            className='text-nowrap'
                                                                        >
                                                                            {
                                                                                event
                                                                            }
                                                                            kg
                                                                        </div>
                                                                    ),
                                                                )}
                                                            {competition.wc_male &&
                                                                competition.wc_male?.split(
                                                                    '/',
                                                                )?.length >
                                                                    3 && (
                                                                    <div className='text-nowrap'>
                                                                        ...
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </HoverCardTrigger>
                                                    <HoverCardContent>
                                                        <div className='grid grid-cols-4 gap-1'>
                                                            {competition.wc_male
                                                                ?.split('/')
                                                                .map(
                                                                    (event) => (
                                                                        <div
                                                                            key={
                                                                                event
                                                                            }
                                                                            className='text-nowrap'
                                                                        >
                                                                            {
                                                                                event
                                                                            }
                                                                            kg
                                                                        </div>
                                                                    ),
                                                                )}
                                                        </div>
                                                    </HoverCardContent>
                                                </HoverCard>
                                            </TableCell>
                                            <TableCell>
                                                <HoverCard>
                                                    <HoverCardTrigger>
                                                        <div className='flex gap-1'>
                                                            {competition.wc_female
                                                                ?.split('/')
                                                                .slice(0, 3)
                                                                .map(
                                                                    (event) => (
                                                                        <div
                                                                            key={
                                                                                event
                                                                            }
                                                                            className='text-nowrap'
                                                                        >
                                                                            {
                                                                                event
                                                                            }
                                                                            kg
                                                                        </div>
                                                                    ),
                                                                )}
                                                            {competition.wc_female &&
                                                                competition.wc_female?.split(
                                                                    '/',
                                                                )?.length >
                                                                    3 && (
                                                                    <div className='text-nowrap'>
                                                                        ...
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </HoverCardTrigger>
                                                    <HoverCardContent>
                                                        <div className='grid grid-cols-4 gap-1'>
                                                            {competition.wc_female
                                                                ?.split('/')
                                                                .map(
                                                                    (event) => (
                                                                        <div
                                                                            key={
                                                                                event
                                                                            }
                                                                            className='text-nowrap'
                                                                        >
                                                                            {
                                                                                event
                                                                            }
                                                                            kg
                                                                        </div>
                                                                    ),
                                                                )}
                                                        </div>
                                                    </HoverCardContent>
                                                </HoverCard>
                                            </TableCell>
                                            <TableCell>
                                                <HoverCard>
                                                    <HoverCardTrigger>
                                                        <div className='flex gap-1'>
                                                            {competition.wc_mix
                                                                ?.split('/')
                                                                .slice(0, 3)
                                                                .map(
                                                                    (event) => (
                                                                        <div
                                                                            key={
                                                                                event
                                                                            }
                                                                            className='text-nowrap'
                                                                        >
                                                                            {
                                                                                event
                                                                            }
                                                                            kg
                                                                        </div>
                                                                    ),
                                                                )}
                                                            {competition.wc_mix &&
                                                                competition.wc_mix?.split(
                                                                    '/',
                                                                )?.length >
                                                                    3 && (
                                                                    <div className='text-nowrap'>
                                                                        ...
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </HoverCardTrigger>
                                                    <HoverCardContent>
                                                        <div className='grid grid-cols-4 gap-1'>
                                                            {competition.wc_mix
                                                                ?.split('/')
                                                                .map(
                                                                    (event) => (
                                                                        <div
                                                                            key={
                                                                                event
                                                                            }
                                                                            className='text-nowrap'
                                                                        >
                                                                            {
                                                                                event
                                                                            }
                                                                            kg
                                                                        </div>
                                                                    ),
                                                                )}
                                                        </div>
                                                    </HoverCardContent>
                                                </HoverCard>
                                            </TableCell>
                                            <TableCell>
                                                <HoverCard>
                                                    <HoverCardTrigger>
                                                        <div className='flex flex-col gap-1'>
                                                            {competition.divisions
                                                                ?.slice(0, 3)
                                                                .map(
                                                                    (
                                                                        division,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                division.id
                                                                            }
                                                                            className='text-nowrap'
                                                                        >
                                                                            {
                                                                                division.name
                                                                            }
                                                                        </div>
                                                                    ),
                                                                )}
                                                            {competition
                                                                .divisions
                                                                ?.length >
                                                                3 && (
                                                                <div className='text-nowrap'>
                                                                    ...
                                                                </div>
                                                            )}
                                                        </div>
                                                    </HoverCardTrigger>
                                                    <HoverCardContent>
                                                        <div className='flex flex-col gap-1'>
                                                            <div className='grid grid-cols-6 gap-1'>
                                                                <div className='col-span-2'>
                                                                    Name
                                                                </div>
                                                                <div>Min</div>
                                                                <div>Max</div>
                                                                <div className='col-span-2'>
                                                                    Info
                                                                </div>
                                                            </div>
                                                            {competition.divisions.map(
                                                                (
                                                                    division,
                                                                    i,
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            division.id
                                                                        }
                                                                        className='grid grid-cols-6 gap-1'
                                                                    >
                                                                        {i !==
                                                                            0 && (
                                                                            <Separator className='col-span-6' />
                                                                        )}
                                                                        <div className='col-span-2'>
                                                                            {
                                                                                division.name
                                                                            }
                                                                        </div>
                                                                        <div>
                                                                            {division.minAge ||
                                                                                '-'}
                                                                        </div>
                                                                        <div>
                                                                            {division.maxAge ||
                                                                                '-'}
                                                                        </div>
                                                                        <div className='col-span-2'>
                                                                            {
                                                                                division.info
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    </HoverCardContent>
                                                </HoverCard>
                                            </TableCell>
                                            <TableCell>
                                                {competition.notes}
                                            </TableCell>
                                            <TableCell>
                                                {(competition.currentState ===
                                                    '' ||
                                                    competition.currentState ===
                                                        null ||
                                                    competition.currentState ===
                                                        'closed') && (
                                                    <div className='flex flex-col items-center gap-2'></div>
                                                )}
                                                {competition.currentState ===
                                                    'open' && (
                                                    <div className='flex flex-col items-center gap-2'>
                                                        <div className='font-bold text-secondary'>
                                                            join
                                                        </div>
                                                        <Button
                                                            variant='outline_card'
                                                            className='min-w-[130px]'
                                                            onClick={() => {
                                                            }}
                                                        >
                                                            {isOpenClosing && (
                                                                <div className='mr-3 animate-spin'>
                                                                    <div className='h-4 w-4 rounded-full border-b-2 border-t-2 border-border' />
                                                                </div>
                                                            )}
                                                            {close}
                                                        </Button>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                        <Link href='/dashboard/create'>
                            <Button>Create</Button>
                        </Link>
                    </section>
                </TabsContent>
                <TabsContent
                    className='min-h-[calc(100vh - 10rem)] w-full'
                    value='create'
                >
                    <Create />
                </TabsContent>
            </Tabs>
        </section>
    )
}
