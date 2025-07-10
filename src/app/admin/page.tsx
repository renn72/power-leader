'use client'

import { useRouter } from 'next/navigation'

import { api } from '~/trpc/react'

export const dynamic = 'force-dynamic'

export default function Admin() {
  const { data: user, isLoading } = api.user.getCurrentUser.useQuery()

  const router = useRouter()

  if (isLoading) return null

  console.log(user)

  if (user?.id === 230) router.push('/admin/weigh-in')
  if (user?.id === 231) router.push('/admin/comp-day/judge')

  return <section className='mt-8 flex h-full grow flex-col gap-8'/>
}
