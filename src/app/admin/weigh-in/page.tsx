'use client'
import { useState, useEffect } from 'react'
import { api } from '~/trpc/react'

import WeighInForm from './_components/form'
import Entry from './_components/entry'

import {
  ToggleGroup,
  ToggleGroupItem,
} from '~/components/ui/toggle-group'

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

const WeighIn = () => {
  const [compId, setCompId] = useState('1')
  const [entryId, setEntryId] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const [selection, setSelection] = useState<string>('all')

  const { data: competitions, isLoading: competitionsLoading } =
    api.competition.getAll.useQuery()

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
                value={competition.id.toString()}
              >
                {competition.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Sheet
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <div className='mt-3 flex flex-col lg:flex-row items-center justify-center lg:gap-4 '>
          <h2 className='text-2xl font-extrabold'>Weigh In</h2>
          <ToggleGroup
            type='single'
            value={selection}
            onValueChange={setSelection}
          >
            <ToggleGroupItem value='all'>All</ToggleGroupItem>
            <ToggleGroupItem value='notWeight'>Not Weighed In</ToggleGroupItem>
            <ToggleGroupItem value='weight'>Weighed In</ToggleGroupItem>
          </ToggleGroup>

        </div>
        {competition && (
          <div className='mx-4 flex flex-col gap-[6px] max-w-[1400px] w-full mx-auto'>
            {competition.entries
              ?.filter((entry) => {
                if (selection === 'all') return true
                if (selection === 'notWeight') {
                  return !entry.weight
                }
                if (selection === 'weight') {
                  return entry.weight
                }
              })
              ?.sort((a, b) =>
                (a.user?.name ?? '') > (b.user?.name ?? '') ? 1 : -1,
              )
              ?.map((entry) => (
                <Entry
                  entry={entry}
                  key={entry.id}
                  setEntryId={setEntryId}
                />
              ))}
          </div>
        )}
        <SheetContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className='w-full overflow-y-auto lg:w-[940px] lg:max-w-3xl px-2 py-4 lg:p-6'
        >
          <SheetHeader>
            <SheetTitle className='capitalize mb-1'>{entry?.user?.name}</SheetTitle>
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
