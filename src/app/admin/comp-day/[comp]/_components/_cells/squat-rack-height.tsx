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

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { api } from '~/trpc/react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const SquatRackHeight = ({
  height,
  entryId,
  isHighlighted = false,
}: {
  height: string
  entryId: number
  isHighlighted?: boolean
}) => {
  const [value, setValue] = useState(() => {
    if (height.includes('in')) return Number(height.replace('in', ''))
    return Number(height.replace('out', ''))
  })
  const [inOrOut, setInOrOut] = useState(() => {
    if (height.includes('in')) return 'in'
    return 'out'
  })
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
      field: 'squarRackHeight',
      value: value.toString() + inOrOut,
    })
  }
  return (
    <TableCell className={cn(isHighlighted && 'bg-accent', 'p-0 py-0 sm:p-2')}>
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
            <DialogTitle>Squat Rack Height</DialogTitle>
          </DialogHeader>
          <div className='flex items-center justify-around gap-2'>
            <div className='flex flex-col items-center gap-2'>
              <ChevronUp
                size={24}
                className='cursor-pointer'
                onClick={() => {
                  setValue(value + 1)
                }}
              />
              <Input
                className='w-36 text-center text-2xl'
                value={value}
                type='number'
                onChange={(e) => {
                  setValue(Number(e.target.value))
                }}
              />
              <ChevronDown
                size={24}
                className='cursor-pointer'
                onClick={() => {
                  setValue(value - 1)
                }}
              />
            </div>

            <ToggleGroup
              className='w-36 text-2xl'
              value={inOrOut}
              onValueChange={(value) => {
                setInOrOut(value)
              }}
              type='single'
            >
              <ToggleGroupItem
                className='text-2xl'
                value='in'
              >
                In
              </ToggleGroupItem>
              <ToggleGroupItem
                className='text-2xl'
                value='out'
              >
                Out
              </ToggleGroupItem>
            </ToggleGroup>
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

export default SquatRackHeight
