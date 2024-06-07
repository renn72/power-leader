'use client'

import { useUser } from '@clerk/nextjs'

import { api } from '~/trpc/react'

import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'

export const dynamic = 'force-dynamic'

const JoinCompPage = ({ params }: { params: { comp: string } }) => {
    const { comp } = params
    const hostName = window.location.origin
    const { isSignedIn, isLoaded } = useUser()

    const { data: competition, isLoading: competitionLoading } =
        api.competition.getCompetitionByUuid.useQuery(comp)

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

    if (competitionLoading) {
        return <Skeleton className='h-[200px] w-[600px]' />
    }

    if (!competition) {
        return <div>Competition not found</div>
    }

    return (
        <>
            <div className='grow'>
                <h1>Join Competition</h1>
                <h2>{comp}</h2>
            </div>
        </>
    )
}

export default JoinCompPage
