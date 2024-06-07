'use client'

import { SignUpButton, SignInButton, SignIn } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs'

import Link from 'next/link'

import { Button } from '~/components/ui/button'

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
        <section className='mt-8 flex h-full grow flex-col'>
            {}
            <div>
                <h1>Join Competition</h1>
                <h2>{comp}</h2>
            </div>
        </section>
    )
}

export default JoinCompPage
