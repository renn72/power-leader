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
import CompTableHeaderBracket from './comp-table-header-bracket'

const TH = ({
  lifters,
  lift,
  round,
  bracket,
  handleWieght,
  handleJudge,
  handleDeleteWeight,
  handleDeleteJudge,
}: {
  lifters: GetCompetitionEntryById[]
  lift: string
  round: number
    bracket: number
  handleWieght: (liftName: string, num: number) => void
  handleJudge: (liftName: string, num: number) => void
  handleDeleteWeight: (liftName: string, num: number) => void
  handleDeleteJudge: (liftName: string, num: number) => void
}) => {
  return (
    <TableHead>
      <DropdownMenu>
        <DropdownMenuTrigger className='z-999 cursor-pointer capitalize hover:text-primary'>{`${lift} ${round}`}</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className='cursor-pointer hover:bg-muted hover:text-primary'>
            <CompTableHeaderBracket
              lifters={lifters}
              round={round}
              lift={lift}
              bracket={bracket}
            />
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel
            className='cursor-pointer hover:bg-muted hover:text-primary'
            onClick={() => handleWieght(lift, round)}
          >
            Add Weight
          </DropdownMenuLabel>
          <DropdownMenuLabel
            className='cursor-pointer hover:bg-muted hover:text-primary'
            onClick={() => handleDeleteWeight(lift, round)}
          >
            Delete Weight
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className='cursor-pointer hover:bg-muted hover:text-primary'
            onClick={() => handleJudge(lift, round)}
          >
            Judge Lift
          </DropdownMenuItem>
          <DropdownMenuItem
            className='cursor-pointer hover:bg-muted hover:text-primary'
            onClick={() => handleDeleteJudge(lift, round)}
          >
            Delete Judge Lift
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableHead>
  )
}

const CompTableHeader = ({
  lifters,
  bracket
}: {
  lifters: GetCompetitionEntryById[]
    bracket: number
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
          one: Math.random() < 0.7,
          two: Math.random() < 0.8,
          three: Math.random() < 0.7,
        })
      }
    }
  }

  const handleDeleteJudge = (liftName: string, num: number) => {
    for (const l of liftersFilter) {
      const lift = l.lift.find(
        (item) => item.lift === liftName && item.liftNumber === num,
      )
      if (lift && debug) {
        judge({
          id: lift.id,
          one: null,
          two: null,
          three: null,
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

  return (
    <TableHeader className='z-99 bg-secondary'>
      <TableRow>
        <TableHead>#</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>WC</TableHead>
        <TableHead>Squat Rack</TableHead>
        <TH
          bracket={bracket}
          lifters={lifters}
          lift='squat'
          round={1}
          handleWieght={handleWieght}
          handleJudge={handleJudge}
          handleDeleteWeight={handleDeleteWeight}
          handleDeleteJudge={handleDeleteJudge}
        />
        <TH
          bracket={bracket}
          lifters={lifters}
          lift='squat'
          round={2}
          handleWieght={handleWieght}
          handleJudge={handleJudge}
          handleDeleteWeight={handleDeleteWeight}
          handleDeleteJudge={handleDeleteJudge}
        />
        <TH
          bracket={bracket}
          lifters={lifters}
          lift='squat'
          round={3}
          handleWieght={handleWieght}
          handleJudge={handleJudge}
          handleDeleteWeight={handleDeleteWeight}
          handleDeleteJudge={handleDeleteJudge}
        />
        <TH
          bracket={bracket}
          lifters={lifters}
          lift='squat'
          round={4}
          handleWieght={handleWieght}
          handleJudge={handleJudge}
          handleDeleteWeight={handleDeleteWeight}
          handleDeleteJudge={handleDeleteJudge}
        />
        <TableHead>Bench Rack</TableHead>
        <TH
          bracket={bracket}
          lifters={lifters}
          lift='bench'
          round={1}
          handleWieght={handleWieght}
          handleJudge={handleJudge}
          handleDeleteWeight={handleDeleteWeight}
          handleDeleteJudge={handleDeleteJudge}
        />
        <TH
          bracket={bracket}
          lifters={lifters}
          lift='bench'
          round={2}
          handleWieght={handleWieght}
          handleJudge={handleJudge}
          handleDeleteWeight={handleDeleteWeight}
          handleDeleteJudge={handleDeleteJudge}
        />
        <TH
          bracket={bracket}
          lifters={lifters}
          lift='bench'
          round={3}
          handleWieght={handleWieght}
          handleJudge={handleJudge}
          handleDeleteWeight={handleDeleteWeight}
          handleDeleteJudge={handleDeleteJudge}
        />
        <TH
          bracket={bracket}
          lifters={lifters}
          lift='bench'
          round={4}
          handleWieght={handleWieght}
          handleJudge={handleJudge}
          handleDeleteWeight={handleDeleteWeight}
          handleDeleteJudge={handleDeleteJudge}
        />
        <TH
          bracket={bracket}
          lifters={lifters}
          lift='deadlift'
          round={1}
          handleWieght={handleWieght}
          handleJudge={handleJudge}
          handleDeleteWeight={handleDeleteWeight}
          handleDeleteJudge={handleDeleteJudge}
        />
        <TH
          bracket={bracket}
          lifters={lifters}
          lift='deadlift'
          round={2}
          handleWieght={handleWieght}
          handleJudge={handleJudge}
          handleDeleteWeight={handleDeleteWeight}
          handleDeleteJudge={handleDeleteJudge}
        />
        <TH
          bracket={bracket}
          lifters={lifters}
          lift='deadlift'
          round={3}
          handleWieght={handleWieght}
          handleJudge={handleJudge}
          handleDeleteWeight={handleDeleteWeight}
          handleDeleteJudge={handleDeleteJudge}
        />
        <TH
          bracket={bracket}
          lifters={lifters}
          lift='deadlift'
          round={4}
          handleWieght={handleWieght}
          handleJudge={handleJudge}
          handleDeleteWeight={handleDeleteWeight}
          handleDeleteJudge={handleDeleteJudge}
        />
        <TableHead>Lifting</TableHead>
      </TableRow>
    </TableHeader>
  )
}

export default CompTableHeader
