'use client'
import { api } from '~/trpc/react'

import { Button } from '~/components/ui/button'

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
    const { mutate: deleteFakeUsers } = api.user.deleteFakeUsers.useMutation({
        onSettled: () => {
            ctx.user.getFakeUsers.refetch()
        },
    })

    return (
        <section className='mt-8 flex h-full grow flex-col gap-8'>
            <div>
                {fakeUsers?.map((user) => (
                    <div key={user.id}>
                        {user.name}
                    </div>
                ))}
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
        </section>
    )
}
