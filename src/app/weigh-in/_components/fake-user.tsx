'use client'
import { api } from '~/trpc/react'

import { Button } from '~/components/ui/button'

import type { GetCompetitionById } from '~/lib/types'

const roundPL = (num: number) => {
    return Math.round(num / 2.5) * 2.5
}

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
            const squatOpener = roundPL(50 + Math.floor(Math.random() * 120))
            const benchOpener = roundPL(50 + Math.floor(Math.random() * 120))
            const deadliftOpener = roundPL(50 + Math.floor(Math.random() * 120))
            updateAndLock({
                id: entry.id,
                address: entry?.address || '',
                phone: entry?.phone || '',
                instagram: entry?.instagram || '',
                openlifter: entry?.openlifter || '',
                birthDate: entry?.birthDate || new Date(),
                equipment: entry?.equipment || '',
                gender: entry?.gender || '',
                predictedWeight: entry?.predictedWeight || '',
                weight: (40 + Math.floor(Math.random() * 100)).toString(),
                events: entry?.events || '',
                division:
                    entry?.compEntryToDivisions?.map(
                        (division) => division.division?.id.toString() || '',
                    ) || [],
                squatOpener: squatOpener.toString(),
                squarRackHeight:
                    Math.ceil(Math.random() * 15).toString() +
                    (Math.random() > 0.5 ? 'in' : 'out'),
                benchOpener: benchOpener.toString(),
                benchRackHeight: Math.ceil(Math.random() * 10).toString() + '/' + Math.ceil(Math.random() * 5).toString(),
                deadliftOpener: deadliftOpener.toString(),
                squatPB: (squatOpener + 25).toString(),
                benchPB: (benchOpener + 25).toString(),
                deadliftPB: (deadliftOpener + 25).toString(),
                compId: competition?.id || 0,
                userId: entry.userId || 0,
                notes: entry?.notes || '',
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
