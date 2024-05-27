import '~/styles/globals.css'

import { GeistSans } from 'geist/font/sans'

import { TRPCReactProvider } from '~/trpc/react'

import { ClerkProvider } from '@clerk/nextjs'

import { ThemeProvider } from '~/app/_components/theme-provider'
import Navbar from './_components/navbar'

export const metadata = {
  title: 'Scoreboard',
  description: 'Scoreboard for a game',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html
        lang='en'
        className={``}
      >
        <body>
          <TRPCReactProvider>
            <ThemeProvider
              attribute='class'
              defaultTheme='system'
              enableSystem
              disableTransitionOnChange
            >
              <main
                className={`flex flex-col min-h-screen dark ${GeistSans.variable}`}
              >
                <Navbar />
                {children}
                <footer
                  className='h-16'>
                  footer
                </footer>
              </main>
            </ThemeProvider>
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
