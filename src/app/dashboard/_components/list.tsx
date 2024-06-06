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
export const dynamic = 'force-dynamic'

const List = () => {
    const { data: allCompetitions, isLoading: allCompetitionsLoading } =
        api.competition.getAll.useQuery()
    return (
<section className='grid h-full grid-cols-1 place-content-between gap-4'>
                        {allCompetitionsLoading ? (
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
                                        <Link href={`/join/${competition.uuid}`}>
                                            <Button>Join</Button>
                                        </Link>
                                    </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </section>
    )
}

export default List
