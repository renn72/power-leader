'use client'
import { api } from '~/trpc/react'

import { Button } from '~/components/ui/button'
import { toast } from 'sonner'

import {
    generateFullName,
    generateName,
    generateInitals,
    isTuple,
} from '~/lib/utils'
import {
    ageDivisionsData,
    eventsData,
    wcFData,
    wcMData,
    equipmentData,
    winnerFormular,
} from '~/lib/store'

export const dynamic = 'force-dynamic'

export default function Admin() {
    const ctx = api.useUtils()
    const { mutate: generateFakeUsers } =
        api.user.generateFakeUsers.useMutation({
            onSettled: () => {
                ctx.user.getFakeUsers.refetch()
            },
        })
    const { data: fakeUsers } = api.user.getFakeUsers.useQuery()
    const { data: user } = api.user.getCurrentUser.useQuery()
    const { mutate: deleteFakeUsers } = api.user.deleteFakeUsers.useMutation({
        onSettled: () => {
            ctx.user.getFakeUsers.refetch()
        },
    })

    const { mutate: createCompetition } = api.competition.create.useMutation({
        onSettled: () => {
            ctx.competition.getMyCompetitions.refetch()
        },
        onError: (err) => {
            console.log(err)
            toast('Error')
        },
        onSuccess: () => {
            toast('Created')
        },
    })

    if (!user) {
        return <div>No Auth</div>
    }

    return (
        <section className='mt-8 flex h-full grow flex-col gap-8'>
            <div>
                {fakeUsers?.map((user) => <div key={user.id}>{user.name}</div>)}
            </div>

            <div className='flex gap-4'>
                <Button
                    onClick={() => {
                        generateFakeUsers()
                    }}
                >
                    Generate Fake Users
                </Button>
                <Button
                    onClick={() => {
                        deleteFakeUsers()
                    }}
                >
                    Delete Fake Users
                </Button>
            </div>

            <div className='flex gap-4'>
                <Button
                    onClick={() => {
                        createCompetition({
                            name: generateFullName(),
                            creatorId: user?.id || 0,
                            // create a radom date in the future
                            date: new Date(
                                Date.now() +
                                    6000 * 60 * 60 * 24 * 30 * Math.random(),
                            ),
                            daysOfCompetition: 1,
                            platforms: 1,
                            federation: generateInitals(),
                            country: generateName(),
                            state: generateName(),
                            city: generateName(),
                            divisions: [
                                {
                                    name: 'Open',
                                    minAge: '',
                                    maxAge: '',
                                    info: 'Open',
                                },
                                {
                                    name: 'Teen',
                                    minAge: 13,
                                    maxAge: 19,
                                    info: 'Teen',
                                },
                                {
                                    name: 'Master',
                                    minAge: 50,
                                    maxAge: '',
                                    info: 'Masters',
                                },
                                {
                                    name: 'First Timers',
                                    minAge: '',
                                    maxAge: '',
                                    info: 'First powerlifting event',
                                },
                                {
                                    name: 'Novice',
                                    minAge: '',
                                    maxAge: '',
                                    info: 'Second powerlifting event',
                                },
                            ],
                            rules: '',
                            events: '',
                            wc_male: wcMData.join('/'),
                            wc_female: wcFData.join('/'),
                            wc_mix: '',
                            equipment: 'Bare/Sleeeves/Multi Ply',
                            formular: Math.random() > 0.5 ? 'Total' : 'DOTS',
                            currentState: 'created',
                            competitorLimit: 100,
                            venue: generateName(),
                            notes: '',
                        })
                    }}
                >
                    Create Competition
                </Button>
            </div>
        </section>
    )
}
