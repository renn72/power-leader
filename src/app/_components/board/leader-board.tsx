'use client'

import { getTotalDots } from '~/lib/dots'
import { GetCompetitionByUuid, GetCompetitionEntryById } from '~/lib/types'
import { cn, getTotalWilks } from '~/lib/utils'

import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import LeaderBoardRow from './leader-board-row'

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
    .sort((a, b) => {
      if (getTotalDots(a) == 0) return 1
      if (isNaN(getTotalDots(a))) return 1
      if (getTotalDots(b) == 0) return -1
      if (isNaN(getTotalDots(b))) return -1
      return getTotalDots(a) - getTotalDots(b)
    })

  const check = entries.map((e) => getTotalDots(e))
  console.log('e', check)

  return (
    <>
      <div className='w-full overflow-auto'>
        <div className='h-[calc(100vh-40px)] overflow-auto'>
          <Table>
            <TableHeader className='bg-muted'>
              <TableRow className='text-base tracking-tighter bg-yellow-500 text-black font-bold'>
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
