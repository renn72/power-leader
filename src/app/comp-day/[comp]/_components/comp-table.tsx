'use client'

export const dynamic = 'force-dynamic'

import { api } from '~/trpc/react'

import { cn } from '~/lib/utils'

import { Button } from '~/components/ui/button'
import { toast } from 'sonner'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Badge } from '~/components/ui/badge'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table-scroll'
import { User, UserCheck, X } from 'lucide-react'
import { GetCompetitionEntryById, GetCompetitionByUuid } from '~/lib/types'

const CompTable = ({
  lifters,
  competition,
  lift,
  bracket,
  round,
  index,
  setIndex,
}: {
  lifters: GetCompetitionEntryById[]
  competition: GetCompetitionByUuid
  lift: string
  bracket: string
  round: string
  index: string
  setIndex: (index: string) => void
}) => {
  const ctx = api.useUtils()
  const { mutate: updateLift } = api.competitionDay.updateLift.useMutation({
    onSettled: () => {
      ctx.competition.getCompetitionByUuid.refetch()
    },
    onSuccess: (e) => {
      toast(JSON.stringify(e))
    },
  })

  return (
    <div className='rounded-md border border-input p-2'>
      <ScrollArea className='h-[700px]'>
        <Table className='text-lg'>
          <TableCaption></TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>WC</TableHead>
              <TableHead>Squat Rack</TableHead>
              <TableHead>Squat 1</TableHead>
              <TableHead></TableHead>
              <TableHead>Squat 2</TableHead>
              <TableHead></TableHead>
              <TableHead>Squat 3</TableHead>
              <TableHead></TableHead>
              <TableHead>Bench Rack</TableHead>
              <TableHead>Bench 1</TableHead>
              <TableHead></TableHead>
              <TableHead>Bench 2</TableHead>
              <TableHead></TableHead>
              <TableHead>Bench 3</TableHead>
              <TableHead></TableHead>
              <TableHead>Deadlift 1</TableHead>
              <TableHead></TableHead>
              <TableHead>Deadlift 2</TableHead>
              <TableHead></TableHead>
              <TableHead>Deadlift 3</TableHead>
              <TableHead></TableHead>
              <TableHead>Lifting</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='h-40 overflow-y-auto'>
            {lifters.map((lifter, i, arr) => (
              <TableRow
                key={lifter.id}
                className={cn(+index === lifter.id ? 'bg-secondary' : '')}
              >
                <TableCell>{lifter.id}</TableCell>
                <TableCell>{lifter?.user?.name}</TableCell>
                <TableCell className=''>
                  <Badge className='w-14 items-center justify-center'>
                    {lifter?.wc?.split('-')[0]}
                    kg
                  </Badge>
                </TableCell>
                <TableCell className='text-center '>
                  {lifter?.squarRackHeight}
                </TableCell>
                <TableCell className='p-2'>
                  <div
                    className={cn(
                      'cursor-pointer rounded-md border border-input p-2',
                    )}
                  >
                    {lifter?.lift?.find(
                      (item) => item.lift === 'squat' && item.liftNumber === 1,
                    ) &&
                      `${lifter?.lift?.find((item) => item.lift === 'squat' && item.liftNumber === 1)?.weight}kg`}
                  </div>
                </TableCell>
                <TableCell className=''></TableCell>
                <TableCell>
                  {lifter?.lift?.find(
                    (item) => item.lift === 'squat' && item.liftNumber === 2,
                  ) &&
                    `${lifter?.lift?.find((item) => item.lift === 'squat' && item.liftNumber === 2)?.weight}kg`}
                </TableCell>
                <TableCell className=''></TableCell>
                <TableCell>
                  {lifter?.lift?.find(
                    (item) => item.lift === 'squat' && item.liftNumber === 3,
                  ) &&
                    `${lifter?.lift?.find((item) => item.lift === 'squat' && item.liftNumber === 3)?.weight}kg`}
                </TableCell>
                <TableCell className=''></TableCell>
                <TableCell>{lifter?.benchRackHeight}</TableCell>
                <TableCell>
                  {lifter?.lift?.find(
                    (item) => item.lift === 'bench' && item.liftNumber === 1,
                  ) &&
                    `${lifter?.lift?.find((item) => item.lift === 'bench' && item.liftNumber === 1)?.weight}kg`}
                </TableCell>
                <TableCell className=''></TableCell>
                <TableCell>
                  {lifter?.lift?.find(
                    (item) => item.lift === 'bench' && item.liftNumber === 2,
                  ) &&
                    `${lifter?.lift?.find((item) => item.lift === 'bench' && item.liftNumber === 2)?.weight}kg`}
                </TableCell>
                <TableCell className=''></TableCell>
                <TableCell>
                  {lifter?.lift?.find(
                    (item) => item.lift === 'bench' && item.liftNumber === 3,
                  ) &&
                    `${lifter?.lift?.find((item) => item.lift === 'bench' && item.liftNumber === 3)?.weight}kg`}
                </TableCell>
                <TableCell className=''></TableCell>
                <TableCell>
                  {lifter?.lift?.find(
                    (item) => item.lift === 'deadlift' && item.liftNumber === 1,
                  ) &&
                    `${lifter?.lift?.find((item) => item.lift === 'deadlift' && item.liftNumber === 1)?.weight}kg`}
                </TableCell>
                <TableCell className=''></TableCell>
                <TableCell>
                  {lifter?.lift?.find(
                    (item) => item.lift === 'deadlift' && item.liftNumber === 2,
                  ) &&
                    `${lifter?.lift?.find((item) => item.lift === 'deadlift' && item.liftNumber === 2)?.weight}kg`}
                </TableCell>
                <TableCell className=''></TableCell>
                <TableCell>
                  {lifter?.lift?.find(
                    (item) => item.lift === 'deadlift' && item.liftNumber === 3,
                  ) &&
                    `${lifter?.lift?.find((item) => item.lift === 'deadlift' && item.liftNumber === 3)?.weight}kg`}
                </TableCell>
                <TableCell className=''></TableCell>
                <TableCell>
                  {+index === lifter.id ? (
                    <Button
                      variant='ghost'
                      className='cursor-auto text-complete hover:bg-muted/10 hover:text-complete'
                    >
                      <UserCheck
                        size={32}
                        strokeWidth={3}
                        className={cn('')}
                      />
                    </Button>
                  ) : (
                    <Button
                      variant='ghost'
                      className='hover:text-muted-foreground'
                      onClick={() => {
                        setIndex(lifter.id.toString())
                        updateLift({
                          id: competition.id,
                          uuid: competition.uuid || '',
                          round: +round,
                          lift: lift,
                          bracket: +bracket,
                          index: lifter.id,
                          nextIndex: arr[i + 1]?.id || null,
                        })
                      }}
                    >
                      <User
                        size={24}
                        className={cn('')}
                      />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
}

export default CompTable
