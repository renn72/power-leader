'use client'

export const dynamic = 'force-dynamic'

import { cn } from '~/lib/utils'

import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { TableCell as Cell, TableRow } from '~/components/ui/table-scroll'
import { User, UserCheck, X } from 'lucide-react'
import { GetCompetitionEntryById, GetCompetitionByUuid } from '~/lib/types'
import SquatRackHeight from './_cells/squat-rack-height'
import Lift from './_cells/lift'
import BenchRackHeight from './_cells/bench-rack-height'

const CompTableRow = ({
  lifter,
  index,
  round,
  bracket,
  setIndex,
  updateLift,
  competition,
  i,
  lift,
  arr,
}: {
  lifter: GetCompetitionEntryById
  index: string
  round: string
  bracket: string
  setIndex: (index: string) => void
  updateLift: (data: any) => void
  competition: GetCompetitionByUuid
  arr: GetCompetitionEntryById[]
  i: number
  lift: string
}) => {
  const isLifter = +index === lifter.id
  const lifterId = lifter.id
  const lifterName = lifter?.user?.name
  const lifterWc = lifter?.wc?.split('-')[0] + 'kg'
  const lifterSquatRackHeight = lifter?.squarRackHeight || ''
  const lifterBenchRackHeight = lifter?.benchRackHeight || ''

  const lifterOrder =
    lifter?.lift?.find(
      (item) => item.lift === lift && item.liftNumber === Number(round),
    )?.order || null

  const isSquatOne = round === '1' && lift === 'squat'
  const lifterSquatOneLift = lifter?.lift?.find(
    (item) => item.lift === 'squat' && item.liftNumber === 1,
  )
  const lifterSquatOne = lifter?.lift?.find(
    (item) => item.lift === 'squat' && item.liftNumber === 1,
  )
    ? lifter.lift.find((item) => item.lift === 'squat' && item.liftNumber === 1)
        ?.weight || ''
    : ''

  const isSquatTwo = round === '2' && lift === 'squat'
  const lifterSquatTwoLift = lifter?.lift?.find(
    (item) => item.lift === 'squat' && item.liftNumber === 2,
  )
  const lifterSquatTwo = lifter?.lift?.find(
    (item) => item.lift === 'squat' && item.liftNumber === 2,
  )
    ? lifter.lift.find((item) => item.lift === 'squat' && item.liftNumber === 2)
        ?.weight || ''
    : ''

  const isSquatThree = round === '3' && lift === 'squat'
  const lifterSquatThreeLift = lifter?.lift?.find(
    (item) => item.lift === 'squat' && item.liftNumber === 3,
  )
  const lifterSquatThree = lifter?.lift?.find(
    (item) => item.lift === 'squat' && item.liftNumber === 3,
  )
    ? lifter.lift.find((item) => item.lift === 'squat' && item.liftNumber === 3)
        ?.weight || ''
    : ''

  const isSquatFour = round === '4' && lift === 'squat'
  const lifterSquatFourLift = lifter?.lift?.find(
    (item) => item.lift === 'squat' && item.liftNumber === 4,
  )
  const lifterSquatFour = lifter?.lift?.find(
    (item) => item.lift === 'squat' && item.liftNumber === 4,
  )
    ? lifter.lift.find((item) => item.lift === 'squat' && item.liftNumber === 4)
        ?.weight || ''
    : ''

  const isBenchOne = round === '1' && lift === 'bench'
  const lifterBenchOneLift = lifter?.lift?.find(
    (item) => item.lift === 'bench' && item.liftNumber === 1,
  )
  const lifterBenchOne = lifter?.lift?.find(
    (item) => item.lift === 'bench' && item.liftNumber === 1,
  )
    ? lifter.lift.find((item) => item.lift === 'bench' && item.liftNumber === 1)
        ?.weight || ''
    : ''

  const isBenchTwo = round === '2' && lift === 'bench'
  const lifterBenchTwoLift = lifter?.lift?.find(
    (item) => item.lift === 'bench' && item.liftNumber === 2,
  )
  const lifterBenchTwo = lifter?.lift?.find(
    (item) => item.lift === 'bench' && item.liftNumber === 2,
  )
    ? lifter.lift.find((item) => item.lift === 'bench' && item.liftNumber === 2)
        ?.weight || ''
    : ''

  const isBenchThree = round === '3' && lift === 'bench'
  const lifterBenchThreeLift = lifter?.lift?.find(
    (item) => item.lift === 'bench' && item.liftNumber === 3,
  )
  const lifterBenchThree = lifter?.lift?.find(
    (item) => item.lift === 'bench' && item.liftNumber === 3,
  )
    ? lifter.lift.find((item) => item.lift === 'bench' && item.liftNumber === 3)
        ?.weight || ''
    : ''

  const isBenchFour = round === '4' && lift === 'bench'
  const lifterBenchFourLift = lifter?.lift?.find(
    (item) => item.lift === 'bench' && item.liftNumber === 4,
  )
  const lifterBenchFour = lifter?.lift?.find(
    (item) => item.lift === 'bench' && item.liftNumber === 4,
  )
    ? lifter.lift.find((item) => item.lift === 'bench' && item.liftNumber === 4)
        ?.weight || ''
    : ''

  const isDeadliftOne = round === '1' && lift === 'deadlift'
  const lifterDeadliftOneLift = lifter?.lift?.find(
    (item) => item.lift === 'deadlift' && item.liftNumber === 1,
  )
  const lifterDeadliftOne = lifter?.lift?.find(
    (item) => item.lift === 'deadlift' && item.liftNumber === 1,
  )
    ? lifter.lift.find(
        (item) => item.lift === 'deadlift' && item.liftNumber === 1,
      )?.weight || ''
    : ''

  const isDeadliftTwo = round === '2' && lift === 'deadlift'
  const lifterDeadliftTwoLift = lifter?.lift?.find(
    (item) => item.lift === 'deadlift' && item.liftNumber === 2,
  )
  const lifterDeadliftTwo = lifter?.lift?.find(
    (item) => item.lift === 'deadlift' && item.liftNumber === 2,
  )
    ? lifter.lift.find(
        (item) => item.lift === 'deadlift' && item.liftNumber === 2,
      )?.weight || ''
    : ''

  const isDeadliftThree = round === '3' && lift === 'deadlift'
  const lifterDeadliftThreeLift = lifter?.lift?.find(
    (item) => item.lift === 'deadlift' && item.liftNumber === 3,
  )
  const lifterDeadliftThree = lifter?.lift?.find(
    (item) => item.lift === 'deadlift' && item.liftNumber === 3,
  )
    ? lifter.lift.find(
        (item) => item.lift === 'deadlift' && item.liftNumber === 3,
      )?.weight || ''
    : ''

  const isDeadliftFour = round === '4' && lift === 'deadlift'
  const lifterDeadliftFourLift = lifter?.lift?.find(
    (item) => item.lift === 'deadlift' && item.liftNumber === 4,
  )
  const lifterDeadliftFour = lifter?.lift?.find(
    (item) => item.lift === 'deadlift' && item.liftNumber === 4,
  )
    ? lifter.lift.find(
        (item) => item.lift === 'deadlift' && item.liftNumber === 4,
      )?.weight || ''
    : ''

  return (
    <TableRow
      key={lifter.id}
      className={cn(isLifter ? 'bg-secondary' : '', 'py-0')}
    >
      <Cell className='py-0 p-0 lg:p-2'>{lifterOrder}</Cell>
      <Cell className='py-0  p-0 lg:p-2'>{lifterName}</Cell>
      <Cell className='py-0  p-0 lg:p-2'>
        <Badge className='w-14 items-center justify-center'>wc</Badge>
      </Cell>
      <SquatRackHeight
        height={lifterSquatRackHeight}
        entryId={lifterId}
      />
      <Lift
        input={lifterSquatOne}
        title='Squat 1'
        lift={lifterSquatOneLift}
        isHighlighted={isSquatOne}
      />
      <Lift
        input={lifterSquatTwo}
        title='Squat 2'
        previousLift={lifterSquatOneLift}
        lift={lifterSquatTwoLift}
        isHighlighted={isSquatTwo}
      />
      <Lift
        input={lifterSquatThree}
        title='Squat 3'
        previousLift={lifterSquatTwoLift}
        lift={lifterSquatThreeLift}
        isHighlighted={isSquatThree}
      />
      <Lift
        input={lifterSquatFour}
        title='Squat 4'
        previousLift={lifterSquatThreeLift}
        lift={lifterSquatFourLift}
        isHighlighted={isSquatFour}
      />
      <BenchRackHeight
        height={lifterBenchRackHeight}
        entryId={lifterId}
      />
      <Lift
        input={lifterBenchOne}
        title='Bench 1'
        lift={lifterBenchOneLift}
        isHighlighted={isBenchOne}
      />
      <Lift
        input={lifterBenchTwo}
        title='Bench 2'
        previousLift={lifterBenchOneLift}
        lift={lifterBenchTwoLift}
        isHighlighted={isBenchTwo}
      />
      <Lift
        input={lifterBenchThree}
        title='Bench 3'
        previousLift={lifterBenchTwoLift}
        lift={lifterBenchThreeLift}
        isHighlighted={isBenchThree}
      />
      <Lift
        input={lifterBenchFour}
        title='Bench 4'
        previousLift={lifterBenchThreeLift}
        lift={lifterBenchFourLift}
        isHighlighted={isBenchFour}
      />
      <Lift
        input={lifterDeadliftOne}
        title='Deadlift 1'
        lift={lifterDeadliftOneLift}
        isHighlighted={isDeadliftOne}
      />
      <Lift
        input={lifterDeadliftTwo}
        title='Deadlift 2'
        previousLift={lifterDeadliftOneLift}
        lift={lifterDeadliftTwoLift}
        isHighlighted={isDeadliftTwo}
      />
      <Lift
        input={lifterDeadliftThree}
        title='Deadlift 3'
        previousLift={lifterDeadliftTwoLift}
        lift={lifterDeadliftThreeLift}
        isHighlighted={isDeadliftThree}
      />
      <Lift
        input={lifterDeadliftFour}
        title='Deadlift 4'
        previousLift={lifterDeadliftThreeLift}
        lift={lifterDeadliftFourLift}
        isHighlighted={isDeadliftFour}
      />
      <Cell
        className='p-0 lg:p-2'
      >
        {+index === lifter.id ? (
          <Button
            variant='ghost'
            className='cursor-auto text-complete hover:bg-muted/10 hover:text-complete'
          >
            <UserCheck
              size={32}
              strokeWidth={3}
              className={cn('cursor-pointer')}
              onClick={() => {
                setIndex('')
                updateLift({
                  id: competition.id,
                  uuid: competition.uuid || '',
                  round: +round,
                  lift: lift,
                  bracket: +bracket,
                  index: -1,
                  nextIndex: null,
                })
              }}
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
      </Cell>
    </TableRow>
  )
}

export default CompTableRow
