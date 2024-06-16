'use client'
import { api } from '~/trpc/react'

import { Button } from '~/components/ui/button'

import type { GetCompetitionById } from '~/lib/types'

const FakeUser = ({ competition }: { competition: GetCompetitionById }) => {
    const ctx = api.useUtils()
    const { data: isAdmin } = api.user.isAdmin.useQuery()
    const { mutate: updateAndLock } = api.compEntry.updateAndLock.useMutation({
        onSettled: () => {
            ctx.competition.getMyCompetitions.refetch()
        },
    })

    console.log(competition)

    const update = () => {
        for (const entry of competition.entries) {
            updateAndLock({
                id: entry.id,
                address: entry.address,
                phone: entry.user.phone,
                instagram: entry.user.instagram,
                openlifter: entry.user.openlifter,
                birthDate: entry.birthDate,
                equipment: entry.equipment,
                gender: entry.gender,
                predictedWeight: entry.predictedWeight,
                weight: entry.weight,
                events: entry.events,
                division: entry.division,
                squatOpener: entry.squatOpener,
                squarRackHeight: entry.squarRackHeight,
                benchOpener: entry.benchOpener,
                benchRackHeight: entry.benchRackHeight,
                deadliftOpener: entry.deadliftOpener,
                squatPB: entry.squatPB,
                benchPB: entry.benchPB,
                deadliftPB: entry.deadliftPB,
                notes: entry.notes,
                compId: competition.id,
                userId: entry.user.id,
            })
        }
    }

    return (
        <>
            {isAdmin && (
                <div className='flex flex-col gap-4'>
                    <Button
                        className='w-min'
                        variant='secondary'
                        onClick={update}
                    >
                        Weigh In Fake Users
                    </Button>
                </div>
            )}
        </>
    )
}

export default FakeUser
