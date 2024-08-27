import { auth, } from '@clerk/nextjs/server'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = auth()
  if (!userId) return null
  return (
    <>
      {children}
    </>
  )
}
