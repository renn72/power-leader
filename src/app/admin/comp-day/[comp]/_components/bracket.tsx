'use client'
import { GetCompetitionEntryById, GetLiftById } from '~/lib/types'
import { toast } from 'sonner'
import { cn } from '~/lib/utils'
import { animations } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/react'
import { Badge } from '~/components/ui/badge'
import { CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { api } from '~/trpc/react'

import { GripVertical } from 'lucide-react'

const Bracket = ({
  lifters,
  round,
  lift,
  bracket,
}: {
  lifters: GetCompetitionEntryById[]
  round: number
  lift: string
  bracket: number
}) => {
  const ctx = api.useUtils()
  const { mutate: updateOrder } = api.lift.updateOrderMany.useMutation({
    onSettled: () => {
      ctx.competition.getCompetitionByUuid.refetch()
    },
    onSuccess: () => {
      toast('updated')
    },
    onError: () => {
      toast('Error Updating Order')
    },
  })

  const sortedList = lifters
    .map((lifter) => {
      return [
        ...lifter.lift.map((l) => {
          return { ...l, wc: lifter.wc, name: lifter.user?.name }
        }),
      ]
    })
    .flat()
    .filter((item) => item.lift === lift && item.liftNumber === round)
    .sort((a, b) => {
      if (a.order && b.order) {
        return Number(a.order) - Number(b.order)
      }
      return Number(a.weight) - Number(b.weight)
    })

  const isLocked = sortedList.reduce((a, c) => {
    if (c.order !== null) {
      return true
    }
    return a
  }, false)

  const [parent, entryList, setEntryList] = useDragAndDrop<
    HTMLDivElement,
    GetLiftById
  // @ts-ignore
  >(sortedList, { plugins: [animations()], dragHandle: '.drag-handle' })

  const sortByWC = () => {}
  const sortByWeight = () => {}
  const unlock = () => {
    const ins = entryList.map((entry, i) => ({
      id: entry.id,
      order: null,
      bracket: bracket,
      state: 'unlocked',
    }))
    updateOrder(ins)
  }
  const lock = () => {
    const ins = entryList.map((entry, i) => ({
      id: entry.id,
      order: i + 1,
      bracket: bracket,
      state: 'ordered',
    }))
    updateOrder(ins)
  }
  return (
    <CardContent className={cn('m-1 mb-16 p-4 ',
      isLocked ? 'border-amber-900/40 border-2 rounded-lg' : ''
    )}>
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
      <div
        ref={parent}
        className='flex flex-col gap-1'
      >
        {entryList.map((entry, i) => {
          return (
            <div
              key={entry.id}
              data-label={entry.id}
              className={cn(
                'grid grid-cols-7 place-items-center gap-2 border border-input text-base tracking-wide',
                'rounded-full p-[2px] ',
                isLocked ? '' : 'hover:bg-muted',
                entry.order !== null && 'border-0 border-complete bg-muted/80',
              )}
            >
              <div className='font-extrabold tracking-wider text-muted-foreground'>
                {i + 1}
              </div>
              <Badge className='flex w-16 items-center justify-center'>
                {
                  // @ts-ignore
                  entry?.wc?.split('-')[0]
                }
                kg
              </Badge>
              <div className='col-span-2'>
                {
                  // @ts-ignore
                  entry?.name
                }
              </div>
              <div className='col-span-2'>
                {entry.weight === '' ? '-' : entry.weight + 'kg'}
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
  )
}

export default Bracket
