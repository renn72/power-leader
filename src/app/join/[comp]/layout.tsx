
import { auth } from '@clerk/nextjs/server'

export default function JoinCompLayout({
  children,
}: {
  children: React.ReactNode
}) {
  auth().protect()

  return <>{children}</>
}
