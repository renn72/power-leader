'use client'

import { SignUpButton, SignInButton, SignIn } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs'
import { Button } from '~/components/ui/button'

export const dynamic = 'force-dynamic'

const JoinCompPage = ({ params }: { params: { comp: string } }) => {
    const { comp } = params

    const { isSignedIn } = useUser()

    if (!isSignedIn) {
        return (
            <div className='flex w-full flex-col items-center justify-center gap-2'>
                <SignInButton
                    mode='modal'
                    fallbackRedirectUrl='/dashboard'
                    forceRedirectUrl={`/join/${comp}`}
                    signUpFallbackRedirectUrl='/dashboard'
                >
                    <Button size='lg'>Sign in</Button>
                </SignInButton>

                <SignUpButton
                    mode='modal'
                    signInFallbackRedirectUrl='/dashboard'
                    fallbackRedirectUrl='/dashboard'
                >
                    <Button size='lg'>Sign up</Button>
                </SignUpButton>
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
