import { currentUser } from '@clerk/nextjs/server'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = currentUser()
  if (!user) return null
  return (
    <>
      {children}
    </>
  )
}
