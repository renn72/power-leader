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
import { getTotalDots } from '~/lib/utils'

const LeaderBoard = ({
  competition,
  table,
}: {
  competition: GetCompetitionByUuid
  table: string
}) => {
  const entries = competition.entries.filter((entry) => {
    const res = entry.compEntryToDivisions.find(
      (d) =>
        d.division?.name.replace(' ', '-').toLowerCase() == table.toLowerCase(),
    )
    if (!res) return false
    return true
  }).sort((a,b) => {

    return getTotalDots(b) - getTotalDots(a)
  })

  console.log(entries)
  return (
    <div className='w-fill h-screen text-3xl p-4'>
      <Table>
        <TableHeader>
          <TableRow className='text-2xl uppercase tracking-tight'>
            <TableHead>Name</TableHead>
            <TableHead>Squat</TableHead>
            <TableHead>DOTS</TableHead>
            <TableHead>Place</TableHead>
            <TableHead>Bench</TableHead>
            <TableHead>DOTS</TableHead>
            <TableHead>Place</TableHead>
            <TableHead>Deadlift</TableHead>
            <TableHead>DOTS</TableHead>
            <TableHead>Place</TableHead>
            <TableHead>Total Weight</TableHead>
            <TableHead>Total DOTS</TableHead>
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
