import { auth } from '@clerk/nextjs/server'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  auth().protect()

  return <>{children}</>
}
