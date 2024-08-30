'use client'

export const dynamic = 'force-dynamic'

import { useEffect } from 'react'
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
  competitonUuid,
}: {
  lifters: GetCompetitionEntryById[]
  competition: GetCompetitionByUuid
  lift: string
  bracket: string
  round: string
  index: string
  setIndex: (index: string) => void
  competitonUuid: string
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

  useEffect(() => {
    Pusher.logToConsole = true
    const channel = pusherClient.subscribe('competition-' + competitonUuid)

    channel.bind(
      'judge',
      (data: {
        id: number
        entryId: number
        judge: number
        isGood: boolean
      }) => {
        if (!competition) {
          return
        }
        console.log('data', data)
        ctx.competition.getCompetitionByUuid.setData(competitonUuid, (comp) => {
          if (!comp) return
          return {
            ...comp,
            entries: comp.entries.map((entry) => {
              return {
                ...entry,
                lift: entry.lift.map((i) => {
                  if (i.id === data.id && data.judge === 1) {
                    return {
                      ...i,
                      isGoodOne: data.isGood,
                    }
                  }
                  if (i.id === data.id && data.judge === 2) {
                    return {
                      ...i,
                      isGoodTwo: data.isGood,
                    }
                  }
                  if (i.id === data.id && data.judge === 3) {
                    return {
                      ...i,
                      isGoodThree: data.isGood,
                    }
                  }
                  return i
                }),
              }
            }),
          }
        })
      },
    )
    return () => {
      pusherClient.unsubscribe('competition-' + competitonUuid)
    }
  }, [])

  return (
    <div className='rounded-md border border-input p-2'>
      <ScrollArea className='h-[65vh]'>
        <Table className='text-sm lg:text-lg tracking-tighter'>
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
