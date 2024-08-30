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
    return l.lift == 'squat'
  })



  return (
    <TableRow
      key={entry.id}
      className=''
    >
      <TableCell className=''>{entry.user?.name}</TableCell>
    </TableRow>
  )
}

export default LeaderBoardRow
