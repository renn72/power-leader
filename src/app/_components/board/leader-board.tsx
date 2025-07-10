'use client'

import { getTotalDots } from '~/lib/dots'
import type { GetCompetitionByUuid, GetCompetitionEntryById } from '~/lib/types'
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

const ages =  [
  {
    name : 'teen',
    min : 14,
    max : 16,
  },
  {
    name : 'sub-junior',
    min: 17,
    max: 19,

  },
  {
    name : 'junior',
    min: 20,
    max: 23,
  },
  {
    name : 'open',
    min: 24,
    max: 39,
  },
  {
    name : 'm1',
    min: 40,
    max: 49,
  },
  {
    name : 'm2',
    min: 50,
    max: 59,
  },
  {
    name : 'm3',
    min: 60,
    max: 69,
  },
  {
    name : 'm4',
    min: 70,
    max: 79,
  },
  {
    name : 'm5',
    min: 80,
    max: 999,
  },
]

const HeadWrapper = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <TableHead className='lg:h-8 font-semibold  text-black'>
      {children}
    </TableHead>
  )
}

const LeaderBoard = ({
  competition,
  table,
  gender,
  wc,
  age = '',
  isHeader = false,
}: {
  competition: GetCompetitionByUuid
  table: string
  gender: string | null
  wc: string
  age?: string
  isHeader?: boolean
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
      return (ages.find((a) => a.name === age)?.min ?? 999) <= userAge && userAge <= (ages.find((a) => a.name === age)?.max ?? 0)
    })
    .sort((a, b) => {
      if (getTotalDots(a) == 0) return 1
      if (isNaN(getTotalDots(a))) return 1
      if (getTotalDots(b) == 0) return -1
      if (isNaN(getTotalDots(b))) return -1
      return getTotalDots(b) - getTotalDots(a)
    })

  const check = entries.map((e) => getTotalDots(e))

  console.log('entries', isHeader)
  return (
    <>
      <div className='w-full overflow-auto'>
        <div className='h-[calc(100vh-10px)] overflow-auto'>
          {
            isHeader ? (
              <div
              className='w-full bg-yellow-500 text-xl font-extrabold text-black capitalize text-center'>{table}</div>
            ) : null
          }
          <Table>
            <TableHeader className='bg-muted'>
              <TableRow className='text-base tracking-tighter bg-yellow-500 text-black font-bold hover:bg-yellow-500'>
                <HeadWrapper>Name</HeadWrapper>
                <HeadWrapper>Squat</HeadWrapper>
                <HeadWrapper>DOTS</HeadWrapper>
                <HeadWrapper>Place</HeadWrapper>
                <HeadWrapper>Bench</HeadWrapper>
                <HeadWrapper>DOTS</HeadWrapper>
                <HeadWrapper>Place</HeadWrapper>
                <HeadWrapper>DL</HeadWrapper>
                <HeadWrapper>DOTS</HeadWrapper>
                <HeadWrapper>Place</HeadWrapper>
                <HeadWrapper>Total</HeadWrapper>
                <HeadWrapper>DOTS</HeadWrapper>
                <HeadWrapper>Rank</HeadWrapper>
              </TableRow>
            </TableHeader>
            <TableBody className=''>
              {entries.map((entry, index) => (
                <LeaderBoardRow
                  entry={entry}
                  entries={entries}
                  index={index}
                  key={entry.id}
                  isShrink={table === 'novice' || table === 'first-timers'}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}

export default LeaderBoard
