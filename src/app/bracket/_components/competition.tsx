import type { GetCompetitionById, GetCompetitionEntryById } from '~/lib/types'
import { cn } from '~/lib/utils'

import { Badge } from '~/components/ui/badge'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '~/components/ui/card'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const Bracket = ({
    entries,
    lift,
    title,
}: {
    entries: GetCompetitionEntryById[]
    lift: string
    title: string
}) => {
    return (
        <Card>
            <CardHeader className='mb-4'>
                <CardTitle className='text-3xl'>{title}</CardTitle>
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
                                    'grid grid-cols-6 gap-2 place-items-center border border-input',
                                    'rounded-full p-1 hover:bg-muted',
                                    entry.wc !== arr[i + 1]?.wc ? 'mb-4' : '',
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

const Competition = ({ competition }: { competition: GetCompetitionById }) => {
    console.log(competition)

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
        <div className='flex w-full flex-col items-center  gap-8'>
            <div>
                <div>Days</div>
                <div>
                    <ChevronLeft />
                <div>{competition.daysOfCompetition}</div>
                    <ChevronRight />
            </div>
            </div>
            <div>
                <div>Platforms</div>
                <div>{competition.platforms}</div>
            </div>
            <div className='flex w-full justify-center gap-16'>
                <Bracket
                    entries={menSquat}
                    lift='squat'
                    title={`Men\'s Squat`}
                />
                <Bracket
                    entries={womenSquat}
                    lift='squat'
                    title={`Women\'s Squat`}
                />
            </div>
            <div className='flex w-full justify-center gap-16'>
                <Bracket
                    entries={menBench}
                    lift='bench'
                    title={`Men\'s Bench`}
                />
                <Bracket
                    entries={womenBench}
                    lift='bench'
                    title={`Women\'s Bench`}
                />
            </div>
            <div className='flex w-full justify-center gap-16'>
                <Bracket
                    entries={menDead}
                    lift='deadlift'
                    title={`Men\'s Deadlift`}
                />
                <Bracket
                    entries={womenDead}
                    lift='deadlift'
                    title={`Women\'s Deadlift`}
                />
            </div>
        </div>
    )
}

export default Competition
