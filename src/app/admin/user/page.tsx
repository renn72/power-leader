'use client'

import { useState } from 'react'

import { ModeToggle } from '~/app/_components/mode-toggle'
import { GetCompetitionById, GetCompetitionEntryById } from '~/lib/types'
import { api } from '~/trpc/react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  const { data: competition } = api.competition.get.useQuery(1)
  const [userId, setUserId] = useState('')


  return (
    <section className='relative flex w-full flex-col items-center justify-center gap-8'>
      <Select
        onValueChange={setUserId}
        defaultValue={userId}
      >
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder={userId} />
        </SelectTrigger>
        <SelectContent className='max-h-[900px]'>
          {competition?.entries
            .map((entry) => (
            <SelectItem
              key={entry.user?.id}
              value={entry.user?.clerkId || ''}
            >
              {entry.user?.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div>
        {userId === null || userId === '' ? null : <User userId={userId} />}
      </div>
    </section>
  )
}
