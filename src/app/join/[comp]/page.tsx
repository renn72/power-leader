'use client'

import { useUser } from '@clerk/nextjs'

import { Button } from '~/components/ui/button'
import JoinCompForm from '~/app/_components/join/join'

export const dynamic = 'force-dynamic'

const JoinCompPage = ({ params }: { params: { comp: string } }) => {
    const { comp } = params
    const hostName = window.location.origin
    const { isSignedIn, isLoaded } = useUser()

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
            </div>
        </>
    )
}

export default JoinCompPage
