'use client'

import { TableCell, TableRow } from '@/components/ui/table'
import { GetCompetitionEntryById, GetCompetitionByUuid } from '~/lib/types'
const LeaderBoardRow = ({
  entry,
  competition,
  index,
}: {
  entry: GetCompetitionEntryById
  competition: GetCompetitionByUuid
  index: number
}) => {
  const squats = entry.lift.filter((l) => {
    if (l.lift == 'squat') {

    }
    return false
  })



  return (
    <TableRow
      key={entry.id}
      className='text-lg tracking-tight font-semibold'
    >
      <TableCell className=''>{entry.user?.name}</TableCell>
    </TableRow>
  )
}

export default LeaderBoardRow
