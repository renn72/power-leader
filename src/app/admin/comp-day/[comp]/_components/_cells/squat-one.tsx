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

const SquatOne = ({
  input,
  entryId,
  isHighlighted = false,
}: {
  input: string
  entryId: number
  isHighlighted?: boolean
}) => {
  const [value, setValue] = useState(() => input)
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
      field: 'squatOpener',
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
        modal={false}
      >
        <DialogTrigger
          className={cn('flex w-full cursor-pointer justify-center border-2 border-input rounded-md p-2')}
        >
          {input + (input !== '' ? 'kg' : '')}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Squat Rack Height</DialogTitle>
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

export default SquatOne
