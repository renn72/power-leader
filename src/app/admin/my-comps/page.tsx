'use client'

import { api } from '~/trpc/react'

import {
    Card,
    CardContent,
    CardTitle,
    CardHeader,
    CardDescription,
} from '~/components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"

import { Button } from '~/components/ui/button'

import { getFormattedDate } from '~/lib/utils'
import { SeparatorVertical } from 'lucide-react'

const Upcoming = () => {
    const { data: compEntries, isLoading: compEntriesLoading } =
        api.compEntry.getMyCompEntries.useQuery()

    console.log(compEntries)

    if (compEntriesLoading) {
        return (
            <div className='flex flex-col items-center justify-center gap-2'>
                <div className='font-bold text-destructive'>Loading...</div>
            </div>
        )
    }

    return (
        <div className='flex flex-col items-center justify-center gap-2'>
            {compEntries?.map((compEntry) => (
                <div
                    key={compEntry.id}
                    className=''
                >
                    <Card className='w-full sm:max-w-2xl'>
                        <CardHeader>
                            <CardTitle>{compEntry.competition?.name}</CardTitle>
                            <CardDescription className='flex flex-col gap-1'>
                                <div>
                                    {compEntry.competition?.date
                                        ? getFormattedDate(
                                              compEntry.competition.date,
                                          )
                                        : ''}
                                </div>
                                <div>
                                    {compEntry.competition?.venue
                                        ? compEntry.competition.venue + ','
                                        : ''}
                                </div>
                                <div className='flex items-center gap-1 text-xs'>
                                    <div>
                                        {compEntry.competition?.city
                                            ? compEntry.competition.city + ','
                                            : ''}
                                    </div>
                                    <div>
                                        {compEntry.competition?.state
                                            ? compEntry.competition.state + ','
                                            : ''}
                                    </div>
                                </div>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='flex flex-col gap-2'></CardContent>
                    </Card>
                    <Card className='w-full sm:max-w-2xl'>
                        <CardHeader>
                            <CardTitle>Info</CardTitle>
                        </CardHeader>
                        <CardContent className='mt-2 flex flex-col gap-2'>
                            <div className='flex items-baseline gap-4'>
                                <div className='font-medium'>
                                    Target Body Weight:
                                </div>
                                <div className='text-sm text-muted-foreground'>
                                    {compEntry.predictedWeight
                                        ? compEntry.predictedWeight
                                        : '...'}
                                </div>
                            </div>
                            <div className='flex items-baseline gap-4'>
                                <div className='font-medium'>Events:</div>
                                <div className='flex gap-1 text-sm text-muted-foreground'>
                                    {compEntry?.events
                                        ?.split('/')
                                        .map((event, i, arr) => (
                                            <div
                                                key={event}
                                                className='flex items-center gap-1 text-nowrap'
                                            >
                                                {event}
                                                {i !== arr.length - 1 && (
                                                    <SeparatorVertical
                                                        size={16}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                </div>
                            </div>
                            <div className='flex items-baseline gap-4'>
                                <div className='font-medium'>Divisions:</div>
                                <div className='flex gap-1 text-sm text-muted-foreground'>
                                    {compEntry?.compEntryToDivisions.map(
                                        (division, i, arr) => (
                                            <div
                                                key={division.id}
                                                className='flex items-center gap-1 text-nowrap'
                                            >
                                                {division.division?.name}
                                                {i !== arr.length - 1 && (
                                                    <SeparatorVertical
                                                        size={16}
                                                    />
                                                )}
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                            <div className='flex items-baseline gap-4'>
                                <div className='font-medium'>Equipment:</div>
                                <div className='text-sm text-muted-foreground'>
                                    {compEntry?.equipment}
                                </div>
                            </div>
                            <Card className='mt-4'>
                                <CardHeader>Lifts</CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableCaption>Lifts</TableCaption>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Lift</TableHead>
                                                <TableHead>Opener</TableHead>
                                                <TableHead>Rack</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Squat</TableCell>
                                                <TableCell>{compEntry.squatOpener ? compEntry.squatOpener : '...'}</TableCell>
                                                <TableCell>{compEntry?.squarRackHeight ? compEntry.squarRackHeight : '...'}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Bench</TableCell>
                                                <TableCell>{compEntry?.benchOpener ? compEntry.benchOpener : '...'}</TableCell>
                                                <TableCell>{compEntry?.benchRackHeight ? compEntry.benchRackHeight : '...'}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Deadlift</TableCell>
                                                <TableCell>{compEntry?.deadliftOpener ? compEntry.deadliftOpener : '...'}</TableCell>
                                                <TableCell>n/a</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                            <Button
                                variant='secondary'
                                className='w-[130px] mx-auto'
                            >
                                edit
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            ))}
        </div>
    )
}

export default Upcoming
