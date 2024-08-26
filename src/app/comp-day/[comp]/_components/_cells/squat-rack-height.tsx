import { useState } from 'react'
import TableCell from '../comp-table-cell'
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

import { api } from '~/trpc/react'

const SquatRackHeight = ({ height, entryId }: { height: string, entryId: number }) => {
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
      field: 'squarRackHeight',
      value: value,
    })
  }
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
      }}
    >
      <DialogTrigger>
        <TableCell>{height}</TableCell>
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
  )
}

export default SquatRackHeight
