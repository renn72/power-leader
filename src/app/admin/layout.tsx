import '~/styles/globals.css'

import Navbar from '~/app/_components/navbar'
import Footer from '~/app/_components/footer'

import { SignInButton, SignIn, SignedOut, UserButton } from '@clerk/nextjs'
import { auth, currentUser } from '@clerk/nextjs/server'
import { LogIn } from 'lucide-react'

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
          <div className='flex items-center gap-2 cursor-pointer hover:underline text-xl text-primary/60 hover:text-primary font-bold'>
            <LogIn
              size={36}
              strokeWidth={2}
            />
            Sign In
          </div>
        </SignInButton>
      </div>
    )
  }

  const _user = await currentUser()

  return (
    <div className={`flex h-dvh flex-col `}>
      <Navbar />
      <div className='xl:min-h-[calc(100vh-7.8rem)]'>{children}</div>
      <Footer />
    </div>
  )
}
