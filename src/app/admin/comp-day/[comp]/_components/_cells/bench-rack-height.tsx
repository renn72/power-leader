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

import { ChevronDown, ChevronUp } from 'lucide-react'
import { api } from '~/trpc/react'

const BenchRackHeight = ({
  height,
  entryId,
  isHighlighted = false,
}: {
  height: string
  entryId: number
  isHighlighted?: boolean
}) => {
  const [valueOne, setValueOne] = useState(() => Number(height.split('/')[0]))
  const [valueTwo, setValueTwo] = useState(() => Number(height.split('/')[1]))
  const [isOpen, setIsOpen] = useState(false)

  const ctx = api.useUtils()

  const { mutate: updateField } = api.compEntry.updateField.useMutation({
    onSuccess: () => {
      toast('Saved')
      setIsOpen(false)
      void ctx.competition.getCompetitionByUuid.invalidate()
    },
  })

  const handleClick = () => {
    updateField({
      id: entryId,
      field: 'benchRackHeight',
      value: valueOne + '/' + valueTwo,
    })
  }
  return (
    <TableCell
      className={cn(isHighlighted && 'bg-accent', 'py-0', 'p-0 sm:p-2')}
    >
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open)
        }}
        modal={false}
      >
        <DialogTrigger
          className={cn(
            'flex w-full justify-center',
            isHighlighted && 'bg-accent',
          )}
        >
          <div className={cn('cursor-pointer rounded-md text-center')}>
            {height}
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bench Rack Height</DialogTitle>
          </DialogHeader>
          <div className='flex items-center justify-around gap-2'>
            <div className='flex flex-col items-center gap-2'>
              <ChevronUp
                size={24}
                className='cursor-pointer'
                onClick={() => {
                  setValueOne(valueOne + 1)
                }}
              />
              <Input
                className='w-36 text-center text-4xl font-bold'
                value={valueOne}
                type='number'
                onChange={(e) => {
                  setValueOne(Number(e.target.value))
                }}
              />
              <ChevronDown
                size={24}
                className='cursor-pointer'
                onClick={() => {
                  setValueOne(valueOne - 1)
                }}
              />
            </div>
            <div className='flex flex-col items-center gap-2'>
              <ChevronUp
                size={24}
                className='cursor-pointer'
                onClick={() => {
                  setValueTwo(valueTwo + 1)
                }}
              />
              <Input
                className='w-36 text-center text-4xl font-bold'
                value={valueTwo}
                type='number'
                onChange={(e) => {
                  setValueTwo(Number(e.target.value))
                }}
              />
              <ChevronDown
                size={24}
                className='cursor-pointer'
                onClick={() => {
                  setValueTwo(valueTwo - 1)
                }}
              />
            </div>
          </div>
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

export default BenchRackHeight
