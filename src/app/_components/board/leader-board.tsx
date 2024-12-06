'use client'

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { GetCompetitionEntryById, GetCompetitionByUuid } from '~/lib/types'
import LeaderBoardRow from './leader-board-row'
import { getTotalDots, getTotalWilks } from '~/lib/utils'
import { cn } from '~/lib/utils'

const LeaderBoard = ({
  competition,
  table,
  gender,
}: {
  competition: GetCompetitionByUuid
  table: string
  gender: string | null
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
    .sort((a, b) => {
      if (getTotalWilks(a) == 0) return 1
      if (isNaN(getTotalWilks(a))) return 1
      if (getTotalWilks(b) == 0) return -1
      return getTotalWilks(b) - getTotalWilks(a)
    })

  const check = entries.map((e) => getTotalWilks(e))


  return (
    <Table className='h-vh'>
      <TableHeader className='sticky top-0 bg-muted z-99'>
        <TableRow className='text-base tracking-tighter'>
          <TableHead className=''>Name</TableHead>
          <TableHead>Squat</TableHead>
          <TableHead>WILKS</TableHead>
          <TableHead>Place</TableHead>
          <TableHead>Bench</TableHead>
          <TableHead>WILKS</TableHead>
          <TableHead>Place</TableHead>
          <TableHead>DL</TableHead>
          <TableHead>WILKS</TableHead>
          <TableHead>Place</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>WILKS</TableHead>
          <TableHead>Rank</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
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
  )
}

export default LeaderBoard
