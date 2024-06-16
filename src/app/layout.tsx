import '~/styles/globals.css'

import { TRPCReactProvider } from '~/trpc/react'

import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

import { ThemeProvider } from '~/app/_components/theme-provider'
import Navbar from './_components/navbar'
import { Toaster } from '~/components/ui/sonner'

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
                            defaultTheme='system'
                            enableSystem
                            disableTransitionOnChange
                        >
                            <main className={`flex min-h-screen flex-col `}>
                                <Navbar />
                                {children}
                                <footer className='h-16'>footer</footer>
                                <Toaster />
                            </main>
                        </ThemeProvider>
                    </TRPCReactProvider>
                </body>
            </html>
        </ClerkProvider>
    )
}
