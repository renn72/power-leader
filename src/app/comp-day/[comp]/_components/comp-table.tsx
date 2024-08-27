'use client'

export const dynamic = 'force-dynamic'

import { api } from '~/trpc/react'

import { toast } from 'sonner'
import { ScrollArea } from '~/components/ui/scroll-area'
import {
  Table,
  TableBody,
} from '~/components/ui/table-scroll'
import { GetCompetitionEntryById, GetCompetitionByUuid } from '~/lib/types'
import CompTableHeader from './comp-table-header'
import CompTableRow from './comp-table-row'

const CompTable = ({
  lifters,
  competition,
  lift,
  bracket,
  round,
  index,
  setIndex,
}: {
  lifters: GetCompetitionEntryById[]
  competition: GetCompetitionByUuid
  lift: string
  bracket: string
  round: string
  index: string
  setIndex: (index: string) => void
}) => {
  const ctx = api.useUtils()
  const { mutate: updateLift } = api.competitionDay.updateLift.useMutation({
    onSettled: () => {
      ctx.competition.getCompetitionByUuid.refetch()
    },
    onSuccess: (e) => {
      toast(JSON.stringify(e))
    },
  })

  return (
    <div className='rounded-md border border-input p-2'>
      <ScrollArea className='h-[63vh]'>
        <Table className='text-lg'>
          <CompTableHeader lifters={lifters} />
          <TableBody className='h-40 overflow-y-auto'>
            {lifters.map((lifter, i, arr) => (
              <CompTableRow
                key={lifter.id}
                lifter={lifter}
                index={index}
                round={round}
                bracket={bracket}
                setIndex={setIndex}
                updateLift={updateLift}
                competition={competition}
                arr={arr}
                i={i}
                lift={lift}
              />
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
}

export default CompTable
