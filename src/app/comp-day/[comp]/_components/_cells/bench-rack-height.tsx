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

const BenchRackHeight = ({
  height,
  entryId,
  isHighlighted = false,
}: {
  height: string
  entryId: number
  isHighlighted?: boolean
}) => {
  const [value, setValue] = useState(() => height)
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
      value: value,
    })
  }
  return (
    <TableCell
      className={cn(isHighlighted && 'bg-accent', 'py-0')}
    >
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open)
        }}
        modal={false}
      >
        <DialogTrigger className={cn('flex justify-center w-full',isHighlighted && 'bg-accent')}>
          <div className={cn('cursor-pointer rounded-md text-center')}>
            {height}
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bench Rack Height</DialogTitle>
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

export default BenchRackHeight
