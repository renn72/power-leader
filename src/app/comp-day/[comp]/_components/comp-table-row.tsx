'use client'

export const dynamic = 'force-dynamic'

import { cn } from '~/lib/utils'

import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { TableCell as Cell, TableRow } from '~/components/ui/table-scroll'
import { User, UserCheck, X } from 'lucide-react'
import { GetCompetitionEntryById, GetCompetitionByUuid } from '~/lib/types'
import TableCell from './comp-table-cell'
import SquatRackHeight from './_cells/squat-rack-height'
import Lift from './_cells/lift'

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

  const isSquatOne = round === '1' && lift === 'squat'
  const lifterSquatOneId = lifter?.lift?.find(
    (item) => item.lift === 'squat' && item.liftNumber === 1,
  )?.id
  const lifterSquatOne = lifter?.lift?.find(
    (item) => item.lift === 'squat' && item.liftNumber === 1,
  )
    ? lifter.lift.find((item) => item.lift === 'squat' && item.liftNumber === 1)
        ?.weight || ''
    : ''

  const isSquatTwo = round === '2' && lift === 'squat'
  const lifterSquatTwoId = lifter?.lift?.find(
    (item) => item.lift === 'squat' && item.liftNumber === 2,
  )?.id
  const lifterSquatTwo = lifter?.lift?.find(
    (item) => item.lift === 'squat' && item.liftNumber === 2,
  )
    ? lifter.lift.find((item) => item.lift === 'squat' && item.liftNumber === 2)
        ?.weight || ''
    : ''

  const isSquatThree = round === '3' && lift === 'squat'
  const lifterSquatThreeId = lifter?.lift?.find(
    (item) => item.lift === 'squat' && item.liftNumber === 3,
  )?.id
  const lifterSquatThree = lifter?.lift?.find(
    (item) => item.lift === 'squat' && item.liftNumber === 3,
  )
    ? lifter.lift.find((item) => item.lift === 'squat' && item.liftNumber === 3)
        ?.weight || ''
    : ''

  const isSquatFour = round === '4' && lift === 'squat'
  const lifterSquatFourId = lifter?.lift?.find(
    (item) => item.lift === 'squat' && item.liftNumber === 4,
  )?.id
  const lifterSquatFour = lifter?.lift?.find(
    (item) => item.lift === 'squat' && item.liftNumber === 4,
  )
    ? lifter.lift.find((item) => item.lift === 'squat' && item.liftNumber === 4)
        ?.weight || ''
    : ''

  return (
    <TableRow
      key={lifter.id}
      className={cn(isLifter ? 'bg-secondary' : '', 'py-0')}
    >
      <Cell className='py-0'>{lifterId}</Cell>
      <Cell className='py-0'>{lifterName}</Cell>
      <Cell className='py-0'>
        <Badge className='w-14 items-center justify-center'>{lifterWc}</Badge>
      </Cell>
      <SquatRackHeight
        height={lifterSquatRackHeight}
        entryId={lifterId}
      />
      <Lift
        input={lifterSquatOne}
        title='Squat 1'
        liftId={lifterSquatOneId}
        isHighlighted={isSquatOne}
      />
      <Lift
        input={lifterSquatTwo}
        title='Squat 2'
        liftId={lifterSquatTwoId}
        isHighlighted={isSquatTwo}
      />
      <Lift
        input={lifterSquatThree}
        title='Squat 3'
        liftId={lifterSquatThreeId}
        isHighlighted={isSquatThree}
      />
      <Lift
        input={lifterSquatFour}
        title='Squat 4'
        liftId={lifterSquatFourId}
        isHighlighted={isSquatFour}
      />
      <TableCell>{lifter?.benchRackHeight}</TableCell>
      <TableCell>
        {lifter?.lift?.find(
          (item) => item.lift === 'bench' && item.liftNumber === 1,
        ) &&
          `${lifter?.lift?.find((item) => item.lift === 'bench' && item.liftNumber === 1)?.weight}kg`}
      </TableCell>
      <TableCell>
        {lifter?.lift?.find(
          (item) => item.lift === 'bench' && item.liftNumber === 2,
        ) &&
          `${lifter?.lift?.find((item) => item.lift === 'bench' && item.liftNumber === 2)?.weight}kg`}
      </TableCell>
      <TableCell>
        {lifter?.lift?.find(
          (item) => item.lift === 'bench' && item.liftNumber === 3,
        ) &&
          `${lifter?.lift?.find((item) => item.lift === 'bench' && item.liftNumber === 3)?.weight}kg`}
      </TableCell>
      <TableCell></TableCell>
      <TableCell>
        {lifter?.lift?.find(
          (item) => item.lift === 'deadlift' && item.liftNumber === 1,
        ) &&
          `${lifter?.lift?.find((item) => item.lift === 'deadlift' && item.liftNumber === 1)?.weight}kg`}
      </TableCell>
      <TableCell>
        {lifter?.lift?.find(
          (item) => item.lift === 'deadlift' && item.liftNumber === 2,
        ) &&
          `${lifter?.lift?.find((item) => item.lift === 'deadlift' && item.liftNumber === 2)?.weight}kg`}
      </TableCell>
      <TableCell>
        {lifter?.lift?.find(
          (item) => item.lift === 'deadlift' && item.liftNumber === 3,
        ) &&
          `${lifter?.lift?.find((item) => item.lift === 'deadlift' && item.liftNumber === 3)?.weight}kg`}
      </TableCell>
      <TableCell></TableCell>
      <Cell>
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
      </Cell>
    </TableRow>
  )
}

export default CompTableRow
