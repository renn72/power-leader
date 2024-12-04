'use client'
import { api } from '~/trpc/react'
import { useEffect } from 'react'

import type { GetCompetitionEntryById, GetCompetitionById } from '~/lib/types'
import { cn } from '~/lib/utils'

import { toast } from 'sonner'
import { animations } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/react'
import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Button } from '~/components/ui/button'

import {
  ChevronLeftCircle,
  GripVertical,
  ChevronRightCircle,
} from 'lucide-react'

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

  const [parent, entryList, setEntryList] = useDragAndDrop<
    HTMLDivElement,
    GetCompetitionEntryById
  >(entries, { plugins: [animations()], dragHandle: '.drag-handle' })

  useEffect(() => {
    if (lift === 'squat') {
      setEntryList(entries.filter((entry) => entry.squatBracket == bracket))
    }
    if (lift === 'bench') {
      setEntryList(entries.filter((entry) => entry.benchBracket == bracket))
    }
    if (lift === 'deadlift') {
      setEntryList(entries.filter((entry) => entry.deadliftBracket == bracket))
    }
  }, [entries])

  const handleBracket = (bracket: number, id: number) => {
    if (lift === 'squat') {
      updateBracket({
        id: id,
        bracket: {
          squatBracket: bracket,
        },
      })
    } else if (lift === 'bench') {
      updateBracket({
        id: id,
        bracket: {
          benchBracket: bracket,
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

  const lock = () => {
    console.log(
      entryList.map((entry, i) => {
        return {
          id: entry.id,
          lift: entry.squatOpener,
          index: i + 1,
          liftId: entry.lift.find(
            (l) => l.lift === 'squat' && l.liftNumber === 1,
          )?.id,
          sRack: entry.squarRackHeight,
          bRack: entry.benchRackHeight,
        }
      }),
    )
    if (lift === 'squat') {
      const ins = entryList.map((entry, i) => ({
        id: entry.id,
        squatOrderOne: i + 1,
        squatBracket: bracket,
        liftId: entry.lift.find((l) => l.lift === 'squat' && l.liftNumber === 1)
          ?.id,
        rack: entry.squarRackHeight,
      }))
      updateOrder(ins)
    } else if (lift === 'bench') {
      const ins = entryList.map((entry, i) => ({
        id: entry.id,
        benchOrderOne: i + 1,
        benchBracket: bracket,
        liftId: entry.lift.find((l) => l.lift === 'bench' && l.liftNumber === 1)
          ?.id,
        rack: entry.benchRackHeight,
      }))
      updateOrder(ins)
    } else if (lift === 'deadlift') {
      const ins = entryList.map((entry, i) => ({
        id: entry.id,
        deadliftOrderOne: i + 1,
        deadliftBracket: bracket,
        liftId: entry.lift.find(
          (l) => l.lift === 'deadlift' && l.liftNumber === 1,
        )?.id,
      }))
      updateOrder(ins)
    }
  }

  const unlock = () => {
    if (lift === 'squat') {
      const ins = entryList.map((entry, _i) => ({
        id: entry.id,
        squatOrderOne: null,
        squatBracket: null,
      }))
      updateOrder(ins)
    } else if (lift === 'bench') {
      const ins = entryList.map((entry, _i) => ({
        id: entry.id,
        benchOrderOne: null,
        benchBracket: null,
      }))
      updateOrder(ins)
    } else if (lift === 'deadlift') {
      const ins = entryList.map((entry, _i) => ({
        id: entry.id,
        deadliftOrderOne: null,
        deadliftBracket: null,
      }))
      updateOrder(ins)
    }
  }

  const isLocked = entries
    .filter((e) => {
      if (lift === 'squat') {
        return e.squatBracket === bracket
      }
      if (lift === 'bench') {
        return e.benchBracket === bracket
      }
      if (lift === 'deadlift') {
        return e.deadliftBracket === bracket
      }
    })
    .reduce((a, c) => {
      if (lift === 'squat' && c.squatOrderOne !== null) {
        return true
      }
      if (lift === 'bench' && c.benchOrderOne !== null) {
        return true
      }
      if (lift === 'deadlift' && c.deadliftOrderOne !== null) {
        return true
      }
      return a
    }, false)

  const sortByWC = () => {
    const sorted = entries
      .map((e) => {
        let value = 0
        if (lift === 'squat') {
          value = Number(e.squatOpener)
        } else if (lift === 'bench') {
          value = Number(e.benchOpener)
        } else if (lift === 'deadlift') {
          value = Number(e.deadliftOpener)
        }
        return {
          ...e,
          liftWeight: value,
          wc: e.wc || '',
        }
      })
      .sort((a, b) => a.liftWeight - b.liftWeight)
      .sort((a, b) => {
        if (a.liftWeight === 0) return 1
        if (b.liftWeight === 0) return -1
        return Number(a.wc.split('-')[0]) - Number(b.wc.split('-')[0])
      })
    console.log(sorted)
    setEntryList(sorted)
  }
  const sortByWeight = () => {
    const sorted = entries
      .map((e) => {
        let value = 0
        if (lift === 'squat') {
          value = Number(e.squatOpener)
        } else if (lift === 'bench') {
          value = Number(e.benchOpener)
        } else if (lift === 'deadlift') {
          value = Number(e.deadliftOpener)
        }
        return {
          ...e,
          liftWeight: value,
          wc: e.wc || '',
        }
      })
      .sort((a, b) => {
        if (a.liftWeight === 0) return 1
        if (b.liftWeight === 0) return -1
        return a.liftWeight - b.liftWeight
      })
    setEntryList(sorted)
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
        <CardDescription className=''>
          {!isLocked && (
            <div className='flex items-center gap-2'>
              <span className='text-base font-bold text-muted-foreground'>
                Sort By
              </span>
              <Button
                variant='link'
                onClick={sortByWC}
              >
                WC
              </Button>
              <Button
                variant='link'
                onClick={sortByWeight}
              >
                Weight
              </Button>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className='mb-12 px-2'>
        <div
          ref={parent}
          className='flex flex-col gap-1'
        >
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
                    if (isLocked) return
                    if (bracket !== 1) handleBracket(bracket - 1, entry.id)
                  }}
                />

                <div
                  className={cn(
                    'grid grid-cols-10 place-items-center gap-1 border border-input text-base tracking-tight',
                    'rounded-full px-[1px] py-[2px] ',
                    isLocked ? '' : 'hover:bg-muted',
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
                  <div className={cn('text-sm font-extrabold ',
                    entry.equipment?.toLowerCase() === 'classic'
                      ? 'text-orange-400'
                      : 'text-indigo-400',
                  )}>
                    {entry.equipment?.toLowerCase() === 'classic' ? 'C' : 'R'}
                  </div>
                  <div className='col-span-3 tracking-tighter'>
                    {entry.user?.name}
                  </div>
                  <div className='col-span-2'>
                    {opener === '' ? '-' : opener + 'kg'}
                  </div>
                  <div className='drag-handle col-span-1 cursor-move'>
                    {!isLocked && (
                      <GripVertical
                        size={20}
                        className='text-muted-foreground/50'
                      />
                    )}
                  </div>
                </div>
                <ChevronRightCircle
                  className='cursor-pointer text-muted-foreground/50 hover:scale-110 hover:text-muted-foreground active:scale-90'
                  onClick={() => {
                    if (isLocked) return
                    if (bracket !== numberOfBrackets)
                      handleBracket(bracket + 1, entry.id)
                  }}
                />
              </div>
            )
          })}
        </div>
        <div className='absolute bottom-2 left-0 flex w-full justify-center gap-2'>
          {isLocked ? (
            <Button
              onClick={unlock}
              size='lg'
              variant='secondary'
            >
              Unlock
            </Button>
          ) : (
            <Button
              onClick={lock}
              size='lg'
              variant='secondary'
            >
              Lock
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default Bracket
