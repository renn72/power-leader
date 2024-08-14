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

import Competition from './_components/competition'

const Bracket = () => {
  const [compId, setCompId] = useState('')
  const [entryId, setEntryId] = useState<number | null>(null)

  const { data: competitions, isLoading: competitionsLoading } =
    api.competition.getMyCompetitions.useQuery()

  const competition = competitions?.find(
    (competition) => competition.id === +compId,
  )

  useEffect(() => {
    setCompId(competitions?.[0]?.id.toString() || '')
  }, [competitions])

  if (competitionsLoading) {
    return (
      <div className='flex flex-col items-center justify-center gap-2'>
        <div className='font-bold text-destructive'>Loading...</div>
      </div>
    )
  }

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
              value={competition.id.toString()}
            >
              {competition.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {competition && <Competition competition={competition} />}
    </div>
  )
}

export default Bracket
