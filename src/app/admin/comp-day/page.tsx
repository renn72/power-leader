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

const CompDay = () => {
  const [compId, setCompId] = useState('')

  const { data: competitions, isLoading: competitionsLoading } =
    api.competition.getMyCompetitions.useQuery()

  useEffect(() => {
    setCompId(competitions?.[0]?.uuid?.toString() || '')
  }, [competitions])

  return (
    <div className='flex flex-col gap-4 p-4'>
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
      <Link href={`/comp-day/${compId}`}>
        <Button
          size='lg'
          variant='secondary'
        >Go</Button>
      </Link>
    </div>
  )
}

export default CompDay
