'use client'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { GetCompetitionEntryById, GetCompetitionByUuid } from '~/lib/types'
import LeaderBoardRow from './leader-board-row'
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
  })
  console.log({ competition, table, entries })
  return (
    <div className='w-fill h-screen text-xl'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Is Squat</TableHead>
            <TableHead>Has Squat</TableHead>
            <TableHead>Squat</TableHead>
            <TableHead>DOTS</TableHead>
            <TableHead>Bench</TableHead>
            <TableHead>DOTS</TableHead>
            <TableHead>Deadlift</TableHead>
            <TableHead>DOTS</TableHead>
            <TableHead>Total Weight</TableHead>
            <TableHead>Total DOTS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, index) => (
            <LeaderBoardRow
              entry={entry}
              competition={competition}
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
