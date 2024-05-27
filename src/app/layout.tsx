import '~/styles/globals.css'

import { GeistSans } from 'geist/font/sans'

import { TRPCReactProvider } from '~/trpc/react'

import {
  ClerkProvider,
} from '@clerk/nextjs'

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
        className={`${GeistSans.variable} dark min-h-screen`}
      >
        <body>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
