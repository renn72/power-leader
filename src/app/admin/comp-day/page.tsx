'use client'

import { useState, useEffect } from 'react'
import { api } from '~/trpc/react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Button } from '~/components/ui/button'
import Link from 'next/link'

import { useAuth } from '@clerk/nextjs'

const CompDay = () => {
  const [compId, setCompId] = useState('')
  const { isLoaded: isAuthLoaded, userId } = useAuth()

  const { data: competitions, isLoading: competitionsLoading } =
    api.competition.getMyCompetitions.useQuery()

  useEffect(() => {
    setCompId(competitions?.[0]?.uuid?.toString() || '')
  }, [competitions])

  if (!isAuthLoaded) return null

  return (
    <div className='flex flex-col gap-8 p-4'>
      <Select
        onValueChange={setCompId}
        defaultValue={compId}
      >
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder={competitions?.[0]?.name} />
        </SelectTrigger>
        <SelectContent>
          {competitions?.map((competition) => (
            <SelectItem
              key={competition.id}
              value={competition.uuid?.toString() || ''}
            >
              {competition.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {userId === 'user_2gwhZNIkM0KAcvfZmds8HUtsIj8' && (
        <Link href={`comp-day/${compId}`}>
          <Button
            size='lg'
            variant='secondary'
          >
            Admin
          </Button>
        </Link>
      )}

      <Link href={`comp-day/${compId}`}>
        <Button
          size='lg'
          variant='secondary'
        >
          Screen
        </Button>
      </Link>
      <div className='flex gap-8'>
        <Link href={`comp-day/${compId}/judge-1`}>
          <Button
            size='lg'
            variant='secondary'
          >
            Judge 1
          </Button>
        </Link>
        <Link href={`comp-day/${compId}/judge-2`}>
          <Button
            size='lg'
            variant='secondary'
          >
            Judge 2
          </Button>
        </Link>
        <Link href={`comp-day/${compId}/judge-3`}>
          <Button
            size='lg'
            variant='secondary'
          >
            Judge 3
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default CompDay
