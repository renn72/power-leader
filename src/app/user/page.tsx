'use client'
import { useSearchParams, useRouter } from 'next/navigation'

import { api } from '~/trpc/react'

import { GetCompetitionEntryById, GetCompetitionById } from '~/lib/types'

export const dynamic = 'force-dynamic'

const Entry = ({ userId }: { userId: number }) => {
  const { data: compEntries } =
    api.compEntry.getUserCompEntries.useQuery(userId)

  console.log(compEntries)

  return <div>entry</div>
}

const User = ({ userId }: { userId: string }) => {
  const { data: user } = api.user.getUser.useQuery(userId)

  console.log(user)

  return <div>{user?.name}</div>
}

export default function Home() {
  const searchParams = useSearchParams()
  const userId = searchParams.get('user')

  if (!userId) return null
  return (
    <section className='relative flex h-[80vh] w-full flex-col items-center justify-center gap-8 overflow-hidden'>
      <div>
        {`user ${userId}`}
        <User userId={userId} />
      </div>
    </section>
  )
}
