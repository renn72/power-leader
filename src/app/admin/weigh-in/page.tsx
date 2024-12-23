'use client'
import { useState, useEffect } from 'react'
import { api } from '~/trpc/react'

import WeighInForm from './_components/form'
import Entry from './_components/entry'
import FakeUser from './_components/fake-user'
import WeightClasses from './_components/weight-classes'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet'
import RandomWeighIn from './_components/random-weigh-in'

const WeighIn = () => {
  const [compId, setCompId] = useState('')
  const [entryId, setEntryId] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const { data: competitions, isLoading: competitionsLoading } =
    api.competition.getMyCompetitions.useQuery()

  const competition = competitions?.find(
    (competition) => competition.id === +compId,
  )

  const entry = competition?.entries?.find(
    (entry) => entry.id === Number(entryId),
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

  if (!competition) return <div>Competition not found</div>

  return (
    <div className='flex flex-col gap-4'>
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
      <Sheet
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <div className='flex items-center gap-4'>
          <h2 className='text-lg font-bold'>Weigh In</h2>
          <div className=''>
            {competition && <RandomWeighIn competition={competition} />}
          </div>
        </div>
        {competition && (
          <div className='mx-4 flex flex-col gap-2'>
            {competition.entries?.map((entry) => (
              <Entry
                entry={entry}
                key={entry.id}
                setEntryId={setEntryId}
              />
            ))}
          </div>
        )}
        <SheetContent className='w-[400px] overflow-y-auto sm:w-[940px] sm:max-w-3xl'>
          <SheetHeader>
            <SheetTitle>Weigh In</SheetTitle>
          </SheetHeader>
          <WeighInForm
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            entry={entry || null}
            competition={competition}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default WeighIn
