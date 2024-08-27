'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { TableHead, TableHeader, TableRow } from '~/components/ui/table-scroll'
import { GetCompetitionEntryById } from '~/lib/types'
import { api } from '~/trpc/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

const TH = ({
  lift,
  round,
  handleWieght,
  handleJudge,
  handleDeleteWeight,
}: {
  lift: string
  round: number
  handleWieght: (liftName: string, num: number) => void
  handleJudge: (liftName: string, num: number) => void
  handleDeleteWeight: (liftName: string, num: number) => void
}) => {
  return (
    <TableHead>
      <DropdownMenu>
        <DropdownMenuTrigger className='cursor-pointer capitalize hover:text-primary'>{`${lift} ${round}`}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel
            className='hover:bg-muted hover:text-primary cursor-pointer'
            onClick={() => handleWieght(lift, round)}
          >
            Add Weight
          </DropdownMenuLabel>
          <DropdownMenuLabel
            className='hover:bg-muted hover:text-primary cursor-pointer'
            onClick={() => handleDeleteWeight(lift, round)}
          >
            Delete Weight
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className='hover:bg-muted hover:text-primary cursor-pointer'
            onClick={() => handleJudge(lift, round)}
          >
            Judge Lift
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableHead>
  )
}

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
  const { mutate: judge } = api.lift.judge.useMutation({
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

  const handleWieght = (liftName: string, num: number) => {
    for (const l of liftersFilter) {
      const lift = l.lift.find(
        (item) => item.lift === liftName && item.liftNumber === num,
      )
      const prevWeight = l.lift.find(
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

  const handleJudge = (liftName: string, num: number) => {
    for (const l of liftersFilter) {
      const lift = l.lift.find(
        (item) => item.lift === liftName && item.liftNumber === num,
      )

      if (lift && debug) {
        judge({
          id: lift.id,
          one: Math.random() > 0.7,
          two: Math.random() > 0.8,
          three: Math.random() > 0.7,
        })
      }
    }
  }

  const handleDeleteWeight = (liftName: string, num: number) => {
    for (const l of liftersFilter) {
      const lift = l.lift.find(
        (item) => item.lift === liftName && item.liftNumber === num,
      )
      if (lift && debug) {
        mutate({
          id: lift.id,
          value: null,
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
        <TH
          lift='squat'
          round={1}
          handleWieght={handleWieght}
          handleJudge={handleJudge}
          handleDeleteWeight={handleDeleteWeight}
        />
        <TH
          lift='squat'
          round={2}
          handleWieght={handleWieght}
          handleJudge={handleJudge}
          handleDeleteWeight={handleDeleteWeight}
        />
        <TH
          lift='squat'
          round={3}
          handleWieght={handleWieght}
          handleJudge={handleJudge}
          handleDeleteWeight={handleDeleteWeight}
        />
        <TH
          lift='squat'
          round={4}
          handleWieght={handleWieght}
          handleJudge={handleJudge}
          handleDeleteWeight={handleDeleteWeight}
        />
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
