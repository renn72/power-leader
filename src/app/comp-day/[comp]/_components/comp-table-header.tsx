'use client'
import { toast } from 'sonner'
import { TableHead, TableHeader, TableRow } from '~/components/ui/table-scroll'
import { GetCompetitionEntryById } from '~/lib/types'
import { api } from '~/trpc/react'

const CompTableHeader = ({
  lifters,
}: {
  lifters: GetCompetitionEntryById[]
}) => {
  const debug = true
  const { mutate } = api.lift.update.useMutation({
    onSuccess: () => {
      toast('updated')
    },
    onError: () => {
      toast('Error Updating Lift')
    },
  })

  const liftersFilter = lifters.map((lifter) => {
    return {
      user: lifter.userId,
      lift: [...lifter.lift],
    }
  })

  const handleClick = (liftName: string, num: number) => {
    for (const l of liftersFilter) {
      const lift = l.lift.find(
        (item) => item.lift === liftName && item.liftNumber === num,
      )
      const prevWeight =l.lift.find(
        (item) => item.lift === liftName && item.liftNumber === num - 1,
      )?.weight

      if (lift && debug && prevWeight) {
        const newWeight = (Math.random() > 0.5 ? 5 : 2.5) + Number(prevWeight)
        mutate({
          id: lift.id,
          value: newWeight.toString(),
          })
      }
    }
  }

  console.log(liftersFilter)
  return (
    <TableHeader>
      <TableRow>
        <TableHead>#</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>WC</TableHead>
        <TableHead>Squat Rack</TableHead>
        <TableHead>Squat 1</TableHead>
        <TableHead className='cursor-pointer hover:text-primary' onClick={() => handleClick('squat', 2)}>Squat 2</TableHead>
        <TableHead>Squat 3</TableHead>
        <TableHead>Squat 4</TableHead>
        <TableHead>Bench Rack</TableHead>
        <TableHead>Bench 1</TableHead>
        <TableHead>Bench 2</TableHead>
        <TableHead>Bench 3</TableHead>
        <TableHead>Bench 4</TableHead>
        <TableHead>Deadlift 1</TableHead>
        <TableHead>Deadlift 2</TableHead>
        <TableHead>Deadlift 3</TableHead>
        <TableHead>Deadlift 4</TableHead>
        <TableHead>Lifting</TableHead>
      </TableRow>
    </TableHeader>
  )
}

export default CompTableHeader
