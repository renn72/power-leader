'use client'
import { api } from '~/trpc/react'

import { Button } from '~/components/ui/button'

import type { GetCompetitionById } from '~/lib/types'

const FakeUser = ({ competition }: { competition: GetCompetitionById }) => {
    const { data: isAdmin } = api.user.isAdmin.useQuery()

    return (
        <>
            {isAdmin && (
                <div className='flex flex-col gap-4'>
                    <Button
                        className='w-min'
                        variant='secondary'
                        onClick={(e) => {
                            e.preventDefault()
                        }}
                    >
                        Weigh In Fake Users
                    </Button>
                </div>
            )}
        </>
    )
}

export default FakeUser
