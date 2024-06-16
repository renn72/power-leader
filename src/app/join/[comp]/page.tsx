'use client'
import { api } from '~/trpc/react'
import { useUser } from '@clerk/nextjs'

import { Button } from '~/components/ui/button'
import { toast } from 'sonner'

import JoinCompForm from '~/app/_components/join/join'

import { generateName } from '~/lib/utils'

export const dynamic = 'force-dynamic'

const JoinCompPage = ({ params }: { params: { comp: string } }) => {
    const { comp } = params
    const hostName = window.location.origin
    const { isSignedIn, isLoaded } = useUser()

    const { data: isAdmin } = api.user.isAdmin.useQuery()
    const { data: competition, isLoading: competitionLoading } =
        api.competition.getCompetitionByUuid.useQuery(comp)

    const { mutate: createFakeUsers } = api.compEntry.createFake.useMutation({
        onSettled: () => {
            toast('Created')
        },
        onError: (err) => {
            console.log(err)
            toast('Error')
        },
        onSuccess: () => {
            toast('Created')
        },
    })

    const { data: fakeUsers } = api.user.getFakeUsers.useQuery()

    const createFake = () => {
        if (!isAdmin) {
            return
        }
        if (!fakeUsers) {
            return
        }
        const events = competition?.events?.split('/') || []
        const divisions = competition?.divisions?.map((division) => division.id) || []
        const equipment = competition?.equipment?.split('/') || []

        for (const user of fakeUsers) {
            const pickedEvents = events.filter((event) => Math.random() > 0.5).join('/')
            const pickedDivisions = divisions.filter((division) => Math.random() > 0.5).map((division) => division.toString())
            console.log(pickedEvents, pickedDivisions)
            createFakeUsers({
                birthDate: user.birthDate ? user.birthDate : new Date(),
                address: user.address || '',
                phone: user.phone || '',
                instagram: user.instagram || '',
                openlifter: user.openlifter || '',
                equipment: equipment[Math.floor(Math.random() * equipment.length)] || '',
                gender: Math.random() > 0.5 ? 'Male' : 'Female',
                predictedWeight: (60 + Math.floor(Math.random() * 100)).toString(),
                events: pickedEvents,
                division: pickedDivisions,
                squatOpener: '',
                squarRackHeight: '',
                benchOpener: '',
                benchRackHeight: '',
                deadliftOpener: '',
                squatPB: '',
                benchPB: '',
                deadliftPB: '',
                compId: competition?.id || 0,
                notes: '',
                userId: user.id,
            })
        }

    }


    if (!isLoaded) {
        return null
    }

    if (!isSignedIn) {
        return (
            <div className='flex w-full flex-col items-center justify-center gap-2'>
                <a
                    href={`https://welcomed-hound-18.accounts.dev/sign-up?redirect_url=${hostName}/join/${comp}`}
                >
                    <Button size='lg'>Sign up</Button>
                </a>
                <a
                    href={`https://welcomed-hound-18.accounts.dev/sign-in?redirect_url=${hostName}/join/${comp}`}
                >
                    <Button size='lg'>Sign in</Button>
                </a>
            </div>
        )
    }

    return (
        <>
            <div className='flex w-full grow flex-col items-center gap-4'>
                <JoinCompForm comp={comp} />
                {isAdmin && (
                    <Button
                        className='mt-4 w-min'
                        onClick={createFake}
                    >
                        Add Fake Users
                    </Button>
                )}
            </div>
        </>
    )
}

export default JoinCompPage
