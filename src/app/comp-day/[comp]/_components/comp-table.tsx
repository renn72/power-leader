'use client'

export const dynamic = 'force-dynamic'

import { api } from '~/trpc/react'

import { pusherClient } from '~/lib/pusher'
import Pusher from 'pusher-js'

import { toast } from 'sonner'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Table, TableBody } from '~/components/ui/table-scroll'
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

  // useEffect(() => {
  //   Pusher.logToConsole = true
  //   const channel = pusherClient.subscribe('competition-' + competitonUuid)
  //
  //   channel.bind(
  //     'judge',
  //     (data: {
  //       id: number
  //       entryId: number
  //       judge: number
  //       isGood: boolean
  //     }) => {
  //       if (!competition) {
  //         return
  //       }
  //       console.log('data', data)
  //       ctx.competition.get.setData(competition.id, {
  //         ...competition,
  //         entries: competition.entries.map((entry) => {
  //           return {
  //             ...entry,
  //             lift: entry.lift.map((i) => {
  //               return {
  //                 ...i,
  //                 isGoodOne:
  //                   i.id === data.id && data.judge === 1
  //                     ? data.isGood
  //                     : i.isGoodOne,
  //                 isGoodTwo:
  //                   i.id === data.id && data.judge === 2
  //                     ? data.isGood
  //                     : i.isGoodTwo,
  //                 isGoodThree:
  //                   i.id === data.id && data.judge === 3
  //                     ? data.isGood
  //                     : i.isGoodThree,
  //               }
  //             }),
  //           }
  //         }),
  //       })
  //     },
  //   )
  //   return () => {
  //     pusherClient.unsubscribe('competition-' + competitonUuid)
  //   }
  // }, [competition])

  return (
    <div className='rounded-md border border-input p-2'>
      <ScrollArea className='h-[63vh]'>
        <Table className='text-lg tracking-tighter'>
          <CompTableHeader
            lifters={lifters}
            bracket={Number(bracket)}
          />
          <TableBody className='overflow-y-auto'>
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
