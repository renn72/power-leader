'use client'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { TableCell as Cell, TableRow } from '~/components/ui/table-scroll'
import { GetCompetitionByUuid, GetCompetitionEntryById } from '~/lib/types'
import { cn } from '~/lib/utils'
import { User, UserCheck, X } from 'lucide-react'

import BenchRackHeight from './_cells/bench-rack-height'
import Lift from './_cells/lift'
import SquatRackHeight from './_cells/squat-rack-height'

export const dynamic = 'force-dynamic'

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
  const isLifter = +index === i
  const lifterId = lifter.id
  const lifterName = lifter?.user?.name
  const lifterWc = lifter?.wc?.split('-')[0] + 'kg'
  const lifterEquip = lifter?.equipment?.slice(0, 1)
  const gender = lifter?.user?.gender?.slice(0, 1)
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
      className={cn(
        isLifter
          ? 'bg-secondary/30  border-2 border-blue-400/50'
          : '',
        'py-0',
      )}
    >
      <Cell className='p-0 tracking-tightest xl:tracking-tight  py-0 xl:p-2 truncate max-w-[80px] xl:max-w-[155px] capitalize'>
        {lifterName}
      </Cell>
      <Cell className='p-0  py-0 capitalize xl:p-2 text-center'>{gender}</Cell>
      <Cell className='p-0  py-0 xl:p-2'>
        <Badge className='w-12 items-center justify-center'>{lifterWc}</Badge>
      </Cell>
      <SquatRackHeight
        height={lifterSquatRackHeight}
        entryId={lifterId}
      />
      <Lift
        bracket={bracket}
        lifter={lifter}
        input={lifterSquatOne}
        title='Squat 1'
        lift={lifterSquatOneLift}
        isHighlighted={isSquatOne}
        liftName='squat'
        liftNumber={1}
      />
      <Lift
        bracket={bracket}
        lifter={lifter}
        input={lifterSquatTwo}
        title='Squat 2'
        previousLift={lifterSquatOneLift}
        lift={lifterSquatTwoLift}
        isHighlighted={isSquatTwo}
        liftName='squat'
        liftNumber={2}
      />
      <Lift
        bracket={bracket}
        lifter={lifter}
        input={lifterSquatThree}
        title='Squat 3'
        previousLift={lifterSquatTwoLift}
        lift={lifterSquatThreeLift}
        isHighlighted={isSquatThree}
        liftName='squat'
        liftNumber={3}
      />
      <Lift
        bracket={bracket}
        lifter={lifter}
        input={lifterSquatFour}
        title='Squat 4'
        previousLift={lifterSquatThreeLift}
        lift={lifterSquatFourLift}
        isHighlighted={isSquatFour}
        liftName='squat'
        liftNumber={4}
      />
      <BenchRackHeight
        height={lifterBenchRackHeight}
        entryId={lifterId}
      />
      <Lift
        bracket={bracket}
        lifter={lifter}
        input={lifterBenchOne}
        title='Bench 1'
        lift={lifterBenchOneLift}
        isHighlighted={isBenchOne}
        liftName='bench'
        liftNumber={1}
      />
      <Lift
        bracket={bracket}
        lifter={lifter}
        input={lifterBenchTwo}
        title='Bench 2'
        previousLift={lifterBenchOneLift}
        lift={lifterBenchTwoLift}
        isHighlighted={isBenchTwo}
        liftName='bench'
        liftNumber={2}
      />
      <Lift
        bracket={bracket}
        lifter={lifter}
        input={lifterBenchThree}
        title='Bench 3'
        previousLift={lifterBenchTwoLift}
        lift={lifterBenchThreeLift}
        isHighlighted={isBenchThree}
        liftName='bench'
        liftNumber={3}
      />
      <Lift
        bracket={bracket}
        lifter={lifter}
        input={lifterBenchFour}
        title='Bench 4'
        previousLift={lifterBenchThreeLift}
        lift={lifterBenchFourLift}
        isHighlighted={isBenchFour}
        liftName='bench'
        liftNumber={4}
      />
      <Lift
        bracket={bracket}
        lifter={lifter}
        input={lifterDeadliftOne}
        title='Deadlift 1'
        lift={lifterDeadliftOneLift}
        isHighlighted={isDeadliftOne}
        liftName='deadlift'
        liftNumber={1}
      />
      <Lift
        bracket={bracket}
        lifter={lifter}
        input={lifterDeadliftTwo}
        title='Deadlift 2'
        previousLift={lifterDeadliftOneLift}
        lift={lifterDeadliftTwoLift}
        isHighlighted={isDeadliftTwo}
        liftName='deadlift'
        liftNumber={2}
      />
      <Lift
        bracket={bracket}
        lifter={lifter}
        input={lifterDeadliftThree}
        title='Deadlift 3'
        previousLift={lifterDeadliftTwoLift}
        lift={lifterDeadliftThreeLift}
        isHighlighted={isDeadliftThree}
        liftName='deadlift'
        liftNumber={3}
      />
      <Lift
        bracket={bracket}
        lifter={lifter}
        input={lifterDeadliftFour}
        title='Deadlift 4'
        previousLift={lifterDeadliftThreeLift}
        lift={lifterDeadliftFourLift}
        isHighlighted={isDeadliftFour}
        liftName='deadlift'
        liftNumber={4}
      />
      <Cell className='p-0 lg:p-2'>
        {+index === i ? (
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
              setIndex(i.toString())
              updateLift({
                id: competition.id,
                uuid: competition.uuid || '',
                round: +round,
                lift: lift,
                bracket: +bracket,
                index: i,
                nextIndex: i + 1 || null,
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
