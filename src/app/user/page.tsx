'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { GetCompetitionById, GetCompetitionEntryById } from '~/lib/types'
import { api } from '~/trpc/react'

import { ModeToggle } from '~/app/_components/mode-toggle'

import { EntryForm } from './form'

export const dynamic = 'force-dynamic'

const Entry = ({ userId }: { userId: number }) => {
  const { data: compEntries } =
    api.compEntry.getUserCompEntries.useQuery(userId)

  if (!compEntries) return null

  const entry = compEntries[0]

  if (!entry) return null

  return <EntryForm entry={entry} />
}

const User = ({ userId }: { userId: string }) => {
  const { data: user } = api.user.getUser.useQuery(userId)

  if (!user) return null

  return <Entry userId={user.id} />
}

export default function Home() {
  const searchParams = useSearchParams()
  const userId = searchParams.get('user')

  if (!userId) return null
  return (
    <section className='relative flex h-[100svh] w-full flex-col items-center justify-center'>
      <div
        className='absolute top-1 right-1'
      ><ModeToggle /></div>

      <div>
        <User userId={userId} />
      </div>
    </section>
  )
}
