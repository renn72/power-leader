'use client'

import Image from 'next/image'

import { getTotalDots } from '~/lib/dots'
import { GetCompetitionByUuid, GetCompetitionEntryById } from '~/lib/types'
import { cn, getAge, getTotalWilks } from '~/lib/utils'

import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import LeaderBoardRow from './leader-board-row'

const ages = [
  {
    name: 'teen',
    min: 14,
    max: 16,
  },
  {
    name: 'sub-junior',
    min: 17,
    max: 19,
  },
  {
    name: 'junior',
    min: 20,
    max: 23,
  },
  {
    name: 'open',
    min: 24,
    max: 39,
  },
  {
    name: 'm1',
    min: 40,
    max: 49,
  },
  {
    name: 'm2',
    min: 50,
    max: 59,
  },
  {
    name: 'm3',
    min: 60,
    max: 69,
  },
  {
    name: 'm4',
    min: 70,
    max: 79,
  },
  {
    name: 'm5',
    min: 80,
    max: 999,
  },
]

const LeaderBoardResults = ({
  competition,
  table,
  gender,
  wc,
  age = '',
}: {
  competition: GetCompetitionByUuid
  table: string
  gender: string | null
  wc: string
  age?: string
}) => {
  if (table === '') return null

  const entries = competition.entries
    .filter((entry) => {
      const res = entry.compEntryToDivisions.find((d) => {
        if (table === 'all') return true
        return (
          d.division?.name.replace(' ', '-').toLowerCase() ==
          table.toLowerCase()
        )
      })
      if (!res) return false
      return true
    })
    .filter((entry) => {
      if (!gender) return true
      if (gender === 'all') return true
      return entry.gender?.toLowerCase() === gender.toLowerCase()
    })
    .filter((entry) => {
      if (wc === '') return true
      if (wc === 'all') return true
      return entry.wc?.split('-')[0]?.toLowerCase() === wc.toLowerCase()
    })
    .filter((entry) => {
      if (age === '') return true
      if (age === 'all') return true
      const userAge = getAge(entry.birthDate)
      return (
        (ages.find((a) => a.name === age)?.min ?? 999) <= userAge &&
        userAge <= (ages.find((a) => a.name === age)?.max ?? 0)
      )
    })
    .sort((a, b) => {
      if (getTotalDots(a) == 0) return 1
      if (isNaN(getTotalDots(a))) return 1
      if (getTotalDots(b) == 0) return -1
      if (isNaN(getTotalDots(b))) return -1
      return getTotalDots(a) - getTotalDots(b)
    }).slice(0, 3)

  const check = entries.map((e) => getTotalDots(e))
  console.log('e', check)

  return (
    <>
      <div className='h-[calc(100vh-40px)] relative w-full'>
        <div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 -z-10'>
          <Image
            src='/showdown.jpeg'
            alt='board'
            width={1440}
            height={1440}
            style={{
              width: '100vh',
              objectFit: 'cover',
            }}
            className='opacity-30'
          />
        </div>
        <div className='flex flex-col gap-6 items-center justify-center h-[calc(100vh-40px)] relative px-4 lg:px-0 w-full'>
          <div className='flex gap-4 text-5xl font-bold capitalize mb-24 rounded-full py-4 px-16 bg-yellow-500 text-black'>
            {table === 'pro' ? (
              'Pro'
            ) : (
              <>
                <div>{gender}</div>
                <div>{wc && wc !== '' ? `${wc}kg` : ''}</div>
                <div>{age}</div>
              </>
            )}
          </div>
          {entries.map((entry, index) => (
            <LeaderBoardRow
              entry={entry}
              entries={entries}
              index={index}
              key={entry.id}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default LeaderBoardResults
