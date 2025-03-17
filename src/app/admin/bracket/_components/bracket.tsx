'use client'

import { useEffect, useState } from 'react'

import { animations } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import type { GetCompetitionById, GetCompetitionEntryById } from '~/lib/types'
import { cn } from '~/lib/utils'
import { api } from '~/trpc/react'
import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-react'
import { toast } from 'sonner'

const Bracket = ({
  entries,
  competition,
  lift,
  title,
  bracket,
}: {
  entries: GetCompetitionEntryById[]
  competition: GetCompetitionById
  lift: string
  title: string
  bracket: number
}) => {
  const ctx = api.useUtils()
  const { mutate: updateBracket } = api.compEntry.updateBracket.useMutation({
    onMutate: async (newData) => {
      await ctx.competition.getMyCompetitions.cancel()

      const oldData = ctx.competition.getMyCompetitions.getData()

      if (!oldData) return

      ctx.competition.getMyCompetitions.setData(undefined, [
        ...oldData.map((c) => {
          if (c.id === competition.id) {
            return {
              ...c,
              entries: c.entries.map((e) => {
                if (e.id === newData.id) {
                  return {
                    ...e,
                    squatBracket:
                      newData.bracket.squatBracket || e.squatBracket || 1,
                    benchBracket:
                      newData.bracket.benchBracket || e.benchBracket || 1,
                    deadliftBracket:
                      newData.bracket.deadliftBracket || e.deadliftBracket || 1,
                  }
                }
                return e
              }),
            }
          }
          return c
        }),
      ])
      return { oldData }
    },
    onError: (err, newData, context) => {
      toast.error('Error Updating Order')
      if (!context?.oldData) return
      ctx.competition.getMyCompetitions.setData(undefined, context.oldData)
    },
    onSettled: () => {
      ctx.competition.getMyCompetitions.refetch()
    },
    onSuccess: () => {},
  })
  const { mutate: updateOrder } = api.compEntry.updateOrderBulk.useMutation({
    onSettled: () => {
      ctx.competition.getMyCompetitions.refetch()
    },
    onSuccess: () => {
      toast.success('Order Updated')
    },
    onError: () => {
      toast.error('Error Updating Order')
    },
  })

  const [entryList, setEntryList] = useState<GetCompetitionEntryById[]>(
    () => entries,
  )

  useEffect(() => {
    if (lift === 'squat') {
      setEntryList(
        entries
          .filter((entry) => entry.squatBracket == bracket)
          .sort((a, b) => {
            if (Number(a.squatOpener) === 0 && a.squatOpener !== '0') return 1
            if (Number(b.squatOpener) === 0 && b.squatOpener !== '0') return -1
            return Number(a.squatOpener) - Number(b.squatOpener)
          })
      )
    }
    if (lift === 'bench') {
      setEntryList(
        entries
          .filter((entry) => entry.benchBracket == bracket)
          .sort((a, b) => {
            if (Number(a.benchOpener) === 0 && a.benchOpener !== '0') return 1
            if (Number(b.benchOpener) === 0 && b.benchOpener !== '0') return -1
            return Number(a.benchOpener) - Number(b.benchOpener)
          })
      )
    }
    if (lift === 'deadlift') {
      setEntryList(
        entries
          .filter((entry) => entry.deadliftBracket == bracket)
          .sort((a, b) => {
            if (Number(a.deadliftOpener) === 0 && a.deadliftOpener !== '0') return 1
            if (Number(b.deadliftOpener) === 0 && b.deadliftOpener !== '0') return -1
            return Number(a.deadliftOpener) - Number(b.deadliftOpener)
          })
      )
    }
  }, [entries])

  const handleBracket = (bracket: number, id: number) => {
    if (lift === 'squat') {
      updateBracket({
        id: id,
        bracket: {
          squatBracket: bracket,
          benchBracket: bracket,
          deadliftBracket: bracket,
        },
      })
    } else if (lift === 'bench') {
      updateBracket({
        id: id,
        bracket: {
          benchBracket: bracket,
          deadliftBracket: bracket,
        },
      })
    } else if (lift === 'deadlift') {
      updateBracket({
        id: id,
        bracket: {
          deadliftBracket: bracket,
        },
      })
    }
  }

  const squatBrackets = Number(competition.squatBrackets)
  const benchBrackets = Number(competition.benchPressBrackets)
  const deadliftBrackets = Number(competition.deadliftBrackets)
  const numberOfBrackets =
    lift === 'squat'
      ? squatBrackets
      : lift === 'bench'
        ? benchBrackets
        : deadliftBrackets

  return (
    <Card className='relative min-w-[570px]'>
      <CardHeader className='mb-4'>
        <CardTitle className='flex items-center justify-around text-3xl'>
          <div className=''>{title}</div>
        </CardTitle>
        <CardDescription className=''></CardDescription>
      </CardHeader>
      <CardContent className='mb-12 px-2'>
        <div className='flex flex-col gap-1'>
          {entryList.map((entry, i) => {
            const opener =
              lift === 'squat'
                ? entry.squatOpener
                : lift === 'bench'
                  ? entry.benchOpener
                  : entry.deadliftOpener
            return (
              <div
                key={entry.id}
                data-label={entry.id}
                className={cn('flex items-center gap-1')}
              >
                <ChevronLeftCircle
                  className='cursor-pointer text-muted-foreground/50 hover:scale-110 hover:text-muted-foreground active:scale-90'
                  onClick={() => {
                    if (bracket !== 1) handleBracket(bracket - 1, entry.id)
                  }}
                />

                <div
                  className={cn(
                    'grid grid-cols-10 place-items-center gap-1 border border-input text-base tracking-tight',
                    'rounded-full px-[1px] py-[2px] ',
                    lift === 'squat' &&
                      entry.squatOrderOne !== null &&
                      'border-0 border-complete bg-muted/80',
                    lift === 'bench' &&
                      entry.benchOrderOne !== null &&
                      'border-0 border-complete bg-muted/80',
                    lift === 'deadlift' &&
                      entry.deadliftOrderOne !== null &&
                      'border-0 border-complete bg-muted/80',
                  )}
                >
                  <div className='font-extrabold tracking-wider text-muted-foreground'>
                    {i + 1}
                  </div>
                  <Badge className='flex w-16 items-center justify-center'>
                    {entry.wc?.split('-')[0]}kg
                  </Badge>
                  <div
                    className={cn(
                      'text-sm font-extrabold ',
                      entry.gender?.toLowerCase() === 'female'
                        ? 'text-pink-400'
                        : 'text-teal-400',
                    )}
                  >
                    {entry.gender?.toLowerCase() === 'female' ? 'F' : 'M'}
                  </div>
                  <div
                    className={cn(
                      'text-sm font-extrabold ',
                      entry.compEntryToDivisions?.[0]?.division?.name.toLowerCase() ===
                        'open'
                        ? 'text-slate-400'
                        : entry.compEntryToDivisions?.[0]?.division?.name.toLowerCase() ===
                            'pro'
                          ? 'text-red-500'
                          : 'text-green-600',
                    )}
                  >
                    {entry.compEntryToDivisions?.[0]?.division?.name
                      .slice(0, 4)
                      .toUpperCase() === 'NOVI'
                      ? 'NOVICE'
                      : entry.compEntryToDivisions?.[0]?.division?.name
                          .slice(0, 4)
                          .toUpperCase() === 'FIRS' ? 'FIRST' : entry.compEntryToDivisions?.[0]?.division?.name.slice(0, 4).toUpperCase()
                  }
                  </div>
                  <div
                    className={cn(
                      'text-sm font-extrabold ',
                      entry.equipment?.toLowerCase() === 'classic'
                        ? 'text-orange-400'
                        : entry.equipment?.toLowerCase() === 'raw'
                          ? 'text-indigo-400'
                          : 'text-emerald-500',
                    )}
                  >
                    {entry.equipment?.slice(0, 1).toUpperCase()}
                  </div>
                  <div className='col-span-3 tracking-tighter truncate'>
                    {entry.user?.name}
                  </div>
                  <div className='col-span-2'>
                    {opener === '' || opener === null ? '-' : opener + 'kg'}
                  </div>
                </div>
                <ChevronRightCircle
                  className='cursor-pointer text-muted-foreground/50 hover:scale-110 hover:text-muted-foreground active:scale-90'
                  onClick={() => {
                    if (bracket !== numberOfBrackets)
                      handleBracket(bracket + 1, entry.id)
                  }}
                />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default Bracket
