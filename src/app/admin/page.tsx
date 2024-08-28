'use client'
import { api } from '~/trpc/react'

import { Button } from '~/components/ui/button'
import { toast } from 'sonner'

import { generateFullName, generateName, generateInitals } from '~/lib/utils'
import { wcFData, wcMData } from '~/lib/store'

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
    const { data: user, isLoading } = api.user.getCurrentUser.useQuery()
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

    if (isLoading) return null

    return (
        <section className='mt-8 flex h-full grow flex-col gap-8'>
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
            </div>
            <div>
                {fakeUsers?.map((user) => <div key={user.id}>{user.name}</div>)}
            </div>
        </section>
    )
}
