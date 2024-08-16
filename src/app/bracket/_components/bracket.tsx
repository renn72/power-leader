'use client'
import { api } from '~/trpc/react'
import { useEffect } from 'react'

import type { GetCompetitionEntryById } from '~/lib/types'
import { cn } from '~/lib/utils'

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

import { GripVertical, } from 'lucide-react'

const Bracket = ({
  entries,
  lift,
  title,
  bracket,
}: {
  entries: GetCompetitionEntryById[]
  lift: string
  title: string
  bracket: number
}) => {
  const ctx = api.useUtils()
  const { mutate: updateOrder } = api.compEntry.updateOrderBulk.useMutation({
    onSettled: () => {
      ctx.competition.getMyCompetitions.refetch()
    },
  })

  const [parent, entryList, setEntryList] = useDragAndDrop<
    HTMLDivElement,
    GetCompetitionEntryById
  >(entries, { plugins: [animations()], dragHandle: '.drag-handle' })

  useEffect(() => {
    setEntryList(entries)
  }, [entries])

  const lock = () => {
    console.log(entryList.map((entry, i) => {return {lift: entry.squatOpener, index: i}}))
    // return
    if (lift === 'squat') {
      const ins = entryList.map((entry, i) => ({
        id: entry.id,
        squatOrderOne: i,
        squatBracket: bracket,
      }))
      updateOrder(ins)
    } else if (lift === 'bench') {
      const ins = entryList.map((entry, i) => ({
        id: entry.id,
        benchOrderOne: i,
        benchBracket: bracket,
      }))
      updateOrder(ins)
    } else if (lift === 'deadlift') {
      const ins = entryList.map((entry, i) => ({
        id: entry.id,
        deadliftOrderOne: i,
        deadliftBracket: bracket,
      }))
      updateOrder(ins)
    }
  }
  const unlock = () => {
    if (lift === 'squat') {
      const ins = entryList.map((entry, i) => ({
        id: entry.id,
        squatOrderOne: null,
        squatBracket: null,
      }))
      updateOrder(ins)
    } else if (lift === 'bench') {
      const ins = entryList.map((entry, i) => ({
        id: entry.id,
        benchOrderOne: null,
        benchBracket: null,
      }))
      updateOrder(ins)
    } else if (lift === 'deadlift') {
      const ins = entryList.map((entry, i) => ({
        id: entry.id,
        deadliftOrderOne: null,
        deadliftBracket: null,
      }))
      updateOrder(ins)
    }
  }

  const isLocked = entries.reduce((a, c) => {
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
          lift: value,
          wc: e.wc || '',
        }
      })
      .sort((a, b) => a.lift - b.lift)
      .sort((a, b) => Number(a.wc.split('-')[0]) - Number(b.wc.split('-')[0]))
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
          lift: value,
          wc: e.wc || '',
        }
      })
      .sort((a, b) => a.lift - b.lift)
    setEntryList(sorted)
  }

  return (
    <Card className='relative'>
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
      <CardContent className='mb-12'>
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
                className={cn(
                  'grid grid-cols-7 place-items-center gap-2 border border-input text-base tracking-wide',
                  'rounded-full p-[2px] ',
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
                <div className='col-span-2'>{entry.user?.name}</div>
                <div className='col-span-2'>{opener}kg</div>
                <div className='drag-handle col-span-1 cursor-move'>
                  {!isLocked && (
                    <GripVertical
                      size={20}
                      className='text-muted-foreground/50'
                    />
                  )}
                </div>
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
