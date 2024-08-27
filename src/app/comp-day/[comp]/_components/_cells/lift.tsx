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
  lift:  GetLiftById | undefined
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
    <TableCell className={cn(isHighlighted && 'bg-accent', 'py-0')}>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open)
        }}
      >
        <DialogTrigger
          className={cn(
            'flex w-full cursor-pointer justify-center p-2',
            input === '' ? '' : 'rounded-md border-2 border-input',
          )}
        >
          {input + (input !== '' ? 'kg' : '')}
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
