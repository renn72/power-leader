import { Button } from '~/components/ui/button'
import { api } from '~/trpc/react'

const DeleteAllEntries = ({ compId }: { compId: number }) => {
  const ctx = api.useUtils()

  const { mutate } = api.compEntry.deleteAllEntries.useMutation({
    onError: (err) => {
      console.log(err)
    },
    onSuccess: () => {
      console.log('deleted')
      void ctx.competition.getCompetitionByUuid.invalidate()
    },
  })
  return (
    <div className='flex w-full justify-end'>
      <Button
        variant='secondary'
        onClick={() => mutate(compId)}
      >
        Delete All
      </Button>
    </div>
  )
}

export default DeleteAllEntries
