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
}: {
  competition: GetCompetitionByUuid
  table: string
}) => {

  const entries = competition.entries
    .filter((entry) => {
      const res = entry.compEntryToDivisions.find(
        (d) =>
          d.division?.name.replace(' ', '-').toLowerCase() ==
          table.toLowerCase(),
      )
      if (!res) return false
      return true
    })
    .sort((a, b) => {
      return getTotalWilks(b) - getTotalWilks(a)
    })

  return (
    <div className='w-full text-xl'>
      <Table className='h-lvh'>
        <TableHeader>
          <TableRow className='text-lg uppercase tracking-tighter'>
            <TableHead>Name</TableHead>
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
    </div>
  )
}

export default LeaderBoard
