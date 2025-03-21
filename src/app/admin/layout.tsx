import '~/styles/globals.css'

import Navbar from '~/app/_components/navbar'

import { Button } from '~/components/ui/button'
import { SignInButton,  } from '@clerk/nextjs'
import { auth, } from '@clerk/nextjs/server'

export const metadata = {
  title: 'Scoreboard',
  description: 'Scoreboard for a game',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = auth()

  if (!userId) {
    return (
      <div
        className={`flex min-h-screen flex-col items-center justify-center `}
      >
        <SignInButton
          fallbackRedirectUrl={`/admin`}
          signUpForceRedirectUrl={`/admin`}
          mode='modal'
        >
          <Button
            variant='outline'
            >
            Sign In
            </Button>
        </SignInButton>
      </div>
    )
  }

  return (
    <div className={`sm:flex h-dvh sm:flex-col `}>
      <Navbar />
      <div className='xl:min-h-[calc(100vh-7.8rem)]'>{children}</div>
    </div>
  )
}
