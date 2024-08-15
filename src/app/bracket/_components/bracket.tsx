'use client'

import { api } from '~/trpc/react'

import type { GetCompetitionEntryById } from '~/lib/types'
import { cn } from '~/lib/utils'

import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Button } from '~/components/ui/button'

import { Menu } from 'lucide-react'

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

  const lock = () => {
    if (lift === 'squat') {
      const ins = entries.map((entry, i) => ({
        id: entry.id,
        squatOrderOne: i,
        squatBracket: bracket,
      }))
      updateOrder(ins)
    } else if (lift === 'bench') {
      const ins = entries.map((entry, i) => ({
        id: entry.id,
        benchOrderOne: i,
        benchBracket: bracket,
      }))
      updateOrder(ins)
    } else if (lift === 'deadlift') {
      const ins = entries.map((entry, i) => ({
        id: entry.id,
        deadliftOrderOne: i,
        deadliftBracket: bracket,
      }))
      updateOrder(ins)
    }
  }
  const unlock = () => {
    if (lift === 'squat') {
      const ins = entries.map((entry, i) => ({
        id: entry.id,
        squatOrderOne: null,
        squatBracket: null,
      }))
      updateOrder(ins)
    } else if (lift === 'bench') {
      const ins = entries.map((entry, i) => ({
        id: entry.id,
        benchOrderOne: null,
        benchBracket: null,
      }))
      updateOrder(ins)
    } else if (lift === 'deadlift') {
      const ins = entries.map((entry, i) => ({
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

  const validEntries = entries.filter((entry) => {
    if (lift === 'squat') {
      return entry.squatOpener !== ''
    }
    if (lift === 'bench') {
      return entry.benchOpener !== ''
    }
    if (lift === 'deadlift') {
      return entry.deadliftOpener !== ''
    }
  })

  return (
    <Card className='relative'>
      <CardHeader className='mb-4'>
        <CardTitle className='flex items-center justify-around text-3xl'>
          <div className=''>{title}</div>
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className='mb-4'>
        <div className='flex flex-col gap-2'>
          {validEntries.map((entry, i, arr) => {
            const opener =
              lift === 'squat'
                ? entry.squatOpener
                : lift === 'bench'
                  ? entry.benchOpener
                  : entry.deadliftOpener
            return (
              <div
                key={entry.id}
                className={cn(
                  'grid grid-cols-7 place-items-center gap-2 border border-input',
                  'rounded-full p-1 hover:bg-muted',
                  entry.wc !== arr[i + 1]?.wc ? 'mb-4' : '',
                  lift === 'squat' &&
                    entry.squatOrderOne !== null &&
                    'border-2 border-complete bg-muted/80',
                  lift === 'bench' &&
                    entry.benchOrderOne !== null &&
                    'border-2 border-complete bg-muted/80',
                  lift === 'deadlift' &&
                    entry.deadliftOrderOne !== null &&
                    'border-2 border-complete bg-muted/80',
                )}
              >
                <div className='text-lg font-extrabold text-muted-foreground'>
                  {i + 1}
                </div>
                <Badge className='flex w-16 items-center justify-center'>
                  {entry.wc?.split('-')[0]}kg
                </Badge>
                <div className='col-span-2'>{entry.user?.name}</div>
                <div className='col-span-2'>{opener}kg</div>
                <div className='col-span-1 cursor-pointer'>
                  {!isLocked && (
                    <Menu
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
              size='sm'
              variant='secondary'
            >
              Unlock
            </Button>
          ) : (
            <Button
              onClick={lock}
              size='sm'
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
