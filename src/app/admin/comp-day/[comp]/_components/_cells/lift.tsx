'use client'

import { useState } from 'react'
import { TableCell } from '~/components/ui/table-scroll'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { toast } from 'sonner'
import { cn } from '~/lib/utils'
import { Circle } from 'lucide-react'

import { api } from '~/trpc/react'

import { GetLiftById } from '~/lib/types'

const Lift = ({
  input,
  title,
  lift,
  isHighlighted = false,
}: {
  input: string
  title: string
  lift: GetLiftById | undefined
  isHighlighted?: boolean
}) => {
  const [value, setValue] = useState(() => input)
  const [isOpen, setIsOpen] = useState(false)

  const ctx = api.useUtils()
  const { mutate } = api.lift.update.useMutation({
    onSuccess: () => {
      toast('Saved')
      setIsOpen(false)
      void ctx.competition.getCompetitionByUuid.invalidate()
    },
  })

  const isOne = lift?.isGoodOne
  const isTwo = lift?.isGoodTwo
  const isThree = lift?.isGoodThree

  const isJudged = (isOne !== null && isTwo !== null && isThree !== null && lift)
  const isGood = (isOne && isTwo) || (isTwo && isThree) || (isOne && isThree)

  const handleClick = () => {
    console.log({
      id: lift?.id,
      value: value,
    })
    if (!lift?.id) return
    mutate({
      id: lift.id,
      value: value,
    })
  }
  return (
    <TableCell className={cn(isHighlighted && 'bg-accent', 'py-0', 'p-0 lg:p-2 ')}>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open)
        }}
      >
        <DialogTrigger
          className={cn(
            'flex w-full cursor-pointer items-center justify-between gap-2 p-2',
            input === '' ? '' : 'rounded-md border-2 border-input',
            isJudged ? isGood ? 'bg-green-600/20 border-0 font-bold' : 'bg-red-600/20 border-0 font-bold' : '',
          )}
        >
          <div className='mr-1 sm:mr-4'>{input + (input !== '' ? 'kg' : '')}</div>
          <div
            className={cn(
              'flex flex-col gap-1',
              input === '' ? 'hidden' : '',
            )}
          >
            <Circle
              size={6}
              fill={isOne === true ? 'green' : isOne === false ? 'red' : 'gray'}
              className={cn(
                'text-accent',
                isOne === true
                  ? 'text-green-600'
                  : isOne === false
                    ? 'text-red-600'
                    : '',
              )}
            />
            <Circle
              size={6}
              fill={isTwo === true ? 'green' : isTwo === false ? 'red' : 'gray'}
              className={cn(
                'text-accent',
                isTwo === true
                  ? 'text-green-600'
                  : isTwo === false
                    ? 'text-red-600'
                    : '',
              )}
            />
            <Circle
              size={6}
              fill={
                isThree === true ? 'green' : isThree === false ? 'red' : 'gray'
              }
              className={cn(
                'text-accent',
                isThree === true
                  ? 'text-green-600'
                  : isThree === false
                    ? 'text-red-600'
                    : '',
              )}
            />
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <Input
            className='text-lg'
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
            }}
          />
          <Button
            className='mt-2'
            variant='secondary'
            onClick={() => {
              handleClick()
            }}
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>
    </TableCell>
  )
}

export default Lift