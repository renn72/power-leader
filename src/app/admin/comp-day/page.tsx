'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { useAuth } from '@clerk/nextjs'
import { Button } from '~/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { api } from '~/trpc/react'

const CompDay = () => {
  const [compId, setCompId] = useState('Show-Down-22-3-2025')
  const { isLoaded: isAuthLoaded, userId } = useAuth()

  const { data: competitions, isLoading: competitionsLoading } =
    api.competition.getAll.useQuery()

  // useEffect(() => {
  //   setCompId(competitions?.[0]?.uuid?.toString() || '')
  // }, [competitions])

  if (!isAuthLoaded) return null
  if (competitionsLoading) return null

  return (
    <div className='flex flex-col gap-8 p-4 w-content'>
      <div className='hidden'>
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
      </div>
      {userId === 'user_2gwhZNIkM0KAcvfZmds8HUtsIj8' && (
        <div>
          <Link href={`comp-day/${compId}`}>
            <Button
              size='lg'
              variant='secondary'
            >
              Admin
            </Button>
          </Link>
        </div>
      )}

      <div>
        <Link href={`comp-day/screen/${compId}`}>
          <Button
            size='lg'
            variant='secondary'
          >
            Screen
          </Button>
        </Link>
      </div>
      <div>
        <Link href={`comp-day/loading/${compId}`}>
          <Button
            size='lg'
            variant='secondary'
          >
            Loading
          </Button>
        </Link>
      </div>
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

      <div className='flex gap-8 hidden'>
        <Link href={`comp-day/${compId}/board?table=open`}>
          <Button
            size='lg'
            variant='secondary'
          >
            Open
          </Button>
        </Link>
        <Link href={`comp-day/${compId}/board?table=first-timers`}>
          <Button
            size='lg'
            variant='secondary'
          >
            First Timers
          </Button>
        </Link>
        <Link href={`comp-day/${compId}/board?table=teen`}>
          <Button
            size='lg'
            variant='secondary'
          >
            Teen
          </Button>
        </Link>
        <Link href={`comp-day/${compId}/board?table=master`}>
          <Button
            size='lg'
            variant='secondary'
          >
            Master
          </Button>
        </Link>
        <Link href={`comp-day/${compId}/board?table=teambattle`}>
          <Button
            size='lg'
            variant='secondary'
          >
            Team Battle
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default CompDay
