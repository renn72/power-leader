'use client'

import { TableCell, TableRow } from '@/components/ui/table'
import {
  GetCompetitionEntryById,
  GetCompetitionByUuid,
  GetLiftById,
} from '~/lib/types'
import { calculateDOTS } from '~/lib/utils'
const LeaderBoardRow = ({
  entry,
  competition,
  index,
}: {
  entry: GetCompetitionEntryById
  competition: GetCompetitionByUuid
  index: number
}) => {
  const squats = entry.lift.filter((l) => l.lift == 'squat')

  const isSquatting = squats?.length > 0
  const hasSquat = squats?.reduce(
    (a, b) => (b.state == 'judged' ? true : a),
    false,
  )
  const squat = squats?.reduce(
    (a, b) => {
      const isGood =
        (b.isGoodOne && b.isGoodTwo) ||
        (b.isGoodTwo && b.isGoodThree) ||
        (b.isGoodOne && b.isGoodThree)
      if (isGood && Number(b.weight) > Number(a.weight)) return b
      return a
    },
    { weight: '0' } as GetLiftById,
  )
  const squatDots = calculateDOTS(
    Number(squat?.userWeight),
    Number(squat?.weight),
    squat.gender == 'female',
  )

  const projectedSquat = squats?.reduce(
    (a, b) => {
      const isGood = b.liftNumber == 1
      if (isGood && Number(b.weight) > Number(a.weight)) return b
      return a
    },
    { weight: '0' } as GetLiftById,
  )
  const projectedSquatDots = calculateDOTS(
    Number(projectedSquat?.userWeight),
    Number(projectedSquat?.weight),
    projectedSquat.gender == 'female',
  )

  const isBenching = entry.lift.filter((l) => l.lift == 'bench').length > 0
  const hasBench = entry.lift
    .filter((l) => l.lift == 'bench')
    .reduce((a, b) => (b.state == 'judged' ? true : a), false)
  const bench = entry.lift
    .filter((l) => l.lift == 'bench')
    .reduce(
      (a, b) => {
        const isGood =
          (b.isGoodOne && b.isGoodTwo) ||
          (b.isGoodTwo && b.isGoodThree) ||
          (b.isGoodOne && b.isGoodThree)
        if (isGood && Number(b.weight) > Number(a.weight)) return b
        return a
      },
      { weight: '0' } as GetLiftById,
    )
  const benchDots = calculateDOTS(
    Number(bench?.userWeight),
    Number(bench?.weight),
    bench.gender == 'female',
  )

  const projectedBench = entry.lift
    .filter((l) => l.lift == 'bench')
    .reduce(
      (a, b) => {
        const isGood = b.liftNumber == 1
        if (isGood && Number(b.weight) > Number(a.weight)) return b
        return a
      },
      { weight: '0' } as GetLiftById,
    )
  const projectedBenchDots = calculateDOTS(
    Number(projectedBench?.userWeight),
    Number(projectedBench?.weight),
    projectedBench.gender == 'female',
  )

  const isDeadlifting = entry.lift.filter((l) => l.lift == 'deadlift').length > 0
  const hasDeadlift = entry.lift
    .filter((l) => l.lift == 'deadlift')
    .reduce((a, b) => (b.state == 'judged' ? true : a), false)
  const deadlift = entry.lift
    .filter((l) => l.lift == 'deadlift')
    .reduce(
      (a, b) => {
        const isGood =
          (b.isGoodOne && b.isGoodTwo) ||
          (b.isGoodTwo && b.isGoodThree) ||
          (b.isGoodOne && b.isGoodThree)
        if (isGood && Number(b.weight) > Number(a.weight)) return b
        return a
      },
      { weight: '0' } as GetLiftById,
    )
  const deadliftDots = calculateDOTS(
    Number(deadlift?.userWeight),
    Number(deadlift?.weight),
    deadlift.gender == 'female',
  )

  const projectedDeadlift = entry.lift
    .filter((l) => l.lift == 'deadlift')
    .reduce(
      (a, b) => {
        const isGood = b.liftNumber == 1
        if (isGood && Number(b.weight) > Number(a.weight)) return b
        return a
      },
      { weight: '0' } as GetLiftById,
    )
  const projectedDeadliftDots = calculateDOTS(
    Number(projectedDeadlift?.userWeight),
    Number(projectedDeadlift?.weight),
    projectedDeadlift.gender == 'female',
  )

  const totalDots =
    (hasSquat ? Number(squatDots) : Number(projectedSquatDots)) +
    (hasBench ? Number(benchDots) : Number(projectedBenchDots)) +
    (hasDeadlift ? Number(deadliftDots) : Number(projectedDeadliftDots))

  const totalWeight =
    (hasSquat ? Number(squat?.weight) : Number(projectedSquat?.weight)) +
    (hasBench ? Number(bench?.weight) : Number(projectedBench?.weight)) +
    (hasDeadlift ? Number(deadlift?.weight) : Number(projectedDeadlift?.weight))

  return (
    <TableRow
      key={entry.id}
      className='text-lg font-extrabold uppercase tracking-tight'
    >
      <TableCell className=''>{entry.user?.name}</TableCell>
      <TableCell className=''>{isSquatting ? 'Yes' : 'No'}</TableCell>
      <TableCell className=''>{hasSquat ? 'Yes' : 'No'}</TableCell>
      {hasSquat ? (
        <>
          <TableCell className='lowercase text-yellow-500'>
            {squat?.weight == '0' ? '' : squat?.weight + 'kg'}
          </TableCell>
          <TableCell className='lowercase text-yellow-500'>
            {isNaN(+squatDots) ? '' : squatDots}
          </TableCell>
        </>
      ) : (
        <>
          <TableCell className='font-medium lowercase text-foreground/80'>
            {projectedSquat?.weight == '0' ? '' : projectedSquat?.weight + 'kg'}
          </TableCell>
          <TableCell className='font-medium text-foreground/80'>
            {isNaN(+projectedSquatDots) ? '' : projectedSquatDots}
          </TableCell>
        </>
      )}
      {hasBench ? (
        <>
          <TableCell className='lowercase text-yellow-500'>
            {bench?.weight == '0' ? '' : bench?.weight + 'kg'}
          </TableCell>
          <TableCell className='text-yellow-500'>
            {isNaN(+benchDots) ? '' : benchDots}
          </TableCell>
        </>
      ) : (
        <>
          <TableCell className='font-medium lowercase text-foreground/80'>
            {projectedBench?.weight == '0' ? '' : projectedBench?.weight + 'kg'}
          </TableCell>
          <TableCell className='font-medium text-foreground/80'>
            {isNaN(+projectedBenchDots) ? '' : projectedBenchDots}
          </TableCell>
        </>
      )}
      {
        hasDeadlift ? (
          <>
            <TableCell className='lowercase text-yellow-500'>
              {deadlift?.weight == '0' ? '' : deadlift?.weight + 'kg'}
            </TableCell>
            <TableCell className='text-yellow-500'>
              {isNaN(+deadliftDots) ? '' : deadliftDots}
            </TableCell>
          </>
        ) : (
          <>
            <TableCell className='font-medium lowercase text-foreground/80'>
              {projectedDeadlift?.weight == '0' ? '' : projectedDeadlift?.weight +
                'kg'}
            </TableCell>
            <TableCell className='font-medium text-foreground/80'>
              {isNaN(+projectedDeadliftDots) ? '' : projectedDeadliftDots}
            </TableCell>
          </>
        )
      }
      <TableCell className='lowercase text-yellow-500'>
        {totalWeight == 0 ? '' : totalWeight + 'kg'}
      </TableCell>
      <TableCell className='text-yellow-500'>
        {isNaN(+totalDots) ? '' : totalDots.toFixed(2)}
      </TableCell>
    </TableRow>
  )
}

export default LeaderBoardRow
