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
import { cn } from '~/lib/utils'

const teamNames = [
  'MGMs',
  'YEAH THE GIRLS',
  'Definitely 6 Foot',
  'Iron Titans',
  'Next Gen',
  'CE Heavy Hitters',
  'Whiskey Pigness',
]

const LeaderBoard = ({
  competition,
  table,
}: {
  competition: GetCompetitionByUuid
  table: string
}) => {
  const teamEntries = teamNames
    .map((teamName) => {
      const lifts = competition.entries
        .map((entry) => entry?.lift)
        .flat()
        .filter((lift) => lift.team?.toLowerCase() === teamName.toLowerCase())
        .filter((lift) => lift.teamLift == lift.lift)
      return {
        id: teamName,
        name: teamName,
        user: { name: teamName },
        lift: lifts,
      }
    })
    .sort((a, b) => {
      // @ts-ignore
      return getTotalDots(b) - getTotalDots(a)
    })

  const isTeam = table == 'teambattle'
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
      return getTotalDots(b) - getTotalDots(a)
    })

  return (
    <div className='w-screen h-screen text-xl'>
      <Table className='h-dvh'>
        <TableHeader>
          <TableRow className='text-lg uppercase tracking-tighter'>
            <TableHead>Name</TableHead>
            <TableHead>Squat</TableHead>
            <TableHead>DOTS</TableHead>
            <TableHead>Place</TableHead>
            <TableHead>Bench</TableHead>
            <TableHead>DOTS</TableHead>
            <TableHead>Place</TableHead>
            <TableHead>DL</TableHead>
            <TableHead>DOTS</TableHead>
            <TableHead>Place</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>DOTS</TableHead>
            <TableHead>Rank</TableHead>
          </TableRow>
        </TableHeader>
        {isTeam ? (
          <TableBody>
            {teamEntries.map((entry, index) => (
              <LeaderBoardRow
                // @ts-ignore
                entry={entry}
                // @ts-ignore
                entries={teamEntries}
                index={index}
                key={entry.name}
                isTeam={true}
              />
            ))}
          </TableBody>
        ) : (
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
        )}
      </Table>
    </div>
  )
}

export default LeaderBoard
