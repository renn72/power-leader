'use client'

import { api } from '~/trpc/react'
import { GetCompetitionById } from '~/lib/types'

import { Button } from '~/components/ui/button'
import { Icons } from '~/components/ui/icons'
import { Skeleton } from '~/components/ui/skeleton'
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group'
import { toast } from 'sonner'

const Competition = ({ competitionId }: { competitionId: number }) => {
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
            ctx.competition.getMyCompetitions.refetch()
        },
        onSuccess: (e) => {
            toast(`${e?.[0]?.lift} set`)
        },
    })

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
    return (
        <div className='flex flex-col items-center justify-center gap-2'>
            <div className='w-full'>
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

            <div className='w-full'>
                <h2>Current Info</h2>
                <div>
                    <div>Day</div>
                    <div>{competition.compDayInfo.day + 1}</div>
                </div>
                <div>
                    <div>Lift</div>
                    <ToggleGroup
                        type='single'
                        variant='outline'
                        defaultValue={competition.compDayInfo.lift}
                        onValueChange={(value) => {
                            updateLift({
                                id: competition.id,
                                lift: value,
                            })
                        }}
                    >
                        <ToggleGroupItem value='Squat'>Squat</ToggleGroupItem>
                        <ToggleGroupItem value='Bench'>Bench</ToggleGroupItem>
                        <ToggleGroupItem value='Deadlift'>
                            Deadlift
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>
                <div>
                    <div>Bracket</div>
                    <div>{competition.compDayInfo.bracket + 1}</div>
                </div>
                <div>
                    <div>Index</div>
                    <div>{competition.compDayInfo.index}</div>
                </div>
            </div>
        </div>
    )
}

export default Competition
