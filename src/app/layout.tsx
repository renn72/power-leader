import '~/styles/globals.css'

import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { ThemeProvider } from '~/app/_components/theme-provider'
import { Toaster } from '~/components/ui/sonner'
import { TRPCReactProvider } from '~/trpc/react'

export const metadata = {
  title: 'Scoreboard',
  description: 'Scoreboard for a game',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
  appleWebApp: {
    title: 'Scoreboard',
    statusBarStyle: 'black-translucent',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang='en'>
        <body>
          <TRPCReactProvider>
            <ThemeProvider
              attribute='class'
              defaultTheme='dark'
              enableSystem
              disableTransitionOnChange
            >
              <main className={`sm:min-h-screen w-full`}>
                <div className='sm:min-h-[calc(100vh-7.8rem)] w-full'>
                  {children}
                </div>
                <Toaster />
              </main>
            </ThemeProvider>
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
