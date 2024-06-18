'use client'

import { api } from '~/trpc/react'
import { GetCompetitionById } from '~/lib/types'

import { Button } from '~/components/ui/button'

const Competition = ({ competition }: { competition: GetCompetitionById }) => {
    const ctx = api.useUtils()
    const { mutate: startCompetition } =
        api.competition.startCompetition.useMutation({
            onSettled: () => {
                ctx.competition.getMyCompetitions.refetch()
            },
        })

    const { mutate: pauseCompetition } =
        api.competition.pauseCompetition.useMutation({
            onSettled: () => {
                ctx.competition.getMyCompetitions.refetch()
            },
        })
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
                <h2 className='text-lg text-muted-foreground capitalize'>
                    {competition.currentState}
                </h2>
            </div>
        </div>
    )
}

export default Competition
