'use client'

import { TableCell, TableRow } from '@/components/ui/table'
import {
  GetCompetitionEntryById,
  GetCompetitionByUuid,
  GetLiftById,
} from '~/lib/types'
import { calculateDOTS, getliftDots } from '~/lib/utils'
import { cn } from '~/lib/utils'

const LeaderBoardRow = ({
  entry,
  entries,
  index,
  isTeam = false,
}: {
  entry: GetCompetitionEntryById
  entries: GetCompetitionEntryById[]
  index: number
  isTeam?: boolean
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
    squat.gender?.toLowerCase() == 'female',
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
    projectedSquat.gender?.toLowerCase() == 'female',
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
    bench.gender?.toLowerCase() == 'female',
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
    projectedBench.gender?.toLowerCase() == 'female',
  )

  const isDeadlifting =
    entry.lift.filter((l) => l.lift == 'deadlift').length > 0
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
    deadlift.gender?.toLowerCase() == 'female',
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

  const liftsDots = entries?.map((e) => getliftDots(e))
  const check = liftsDots
    ?.filter((l) => l.squat !== 0)
    .sort((a, b) => b.squat - a.squat)
    .map((l, i) => ({ id: l.id, place: i + 1 }))
  const squatPlaceDots = liftsDots
    ?.filter((l) => l.squat !== 0)
    .sort((a, b) => b.squat - a.squat)
    .map((l, i) => ({ id: l.id, place: i + 1 }))
    .find((l) => l.id == entry.id)
  const benchPlaceDots = liftsDots
    ?.filter((l) => l.bench !== 0)
    .sort((a, b) => b.bench - a.bench)
    .map((l, i) => ({ id: l.id, place: i + 1 }))
    .find((l) => l.id == entry.id)
  const deadliftPlaceDots = liftsDots
    ?.filter((l) => l.deadlift !== 0)
    .sort((a, b) => b.deadlift - a.deadlift)
    .map((l, i) => ({ id: l.id, place: i + 1 }))
    .find((l) => l.id == entry.id)

  const projectedDeadliftDots = calculateDOTS(
    Number(projectedDeadlift?.userWeight),
    Number(projectedDeadlift?.weight),
    projectedDeadlift.gender?.toLowerCase() == 'female',
  )

  const squatTotalDots = isSquatting
    ? hasSquat
      ? Number(squatDots)
      : Number(projectedSquatDots)
    : 0
  const benchTotalDots = isBenching
    ? hasBench
      ? Number(benchDots)
      : Number(projectedBenchDots)
    : 0
  const deadliftTotalDots = isDeadlifting
    ? hasDeadlift
      ? Number(deadliftDots)
      : Number(projectedDeadliftDots)
    : 0

  const totalDots =
    (isNaN(squatTotalDots) ? 0 : squatTotalDots) +
    (isNaN(benchTotalDots) ? 0 : benchTotalDots) +
    (isNaN(deadliftTotalDots) ? 0 : deadliftTotalDots)

  const totalWeight =
    (hasSquat ? Number(squat?.weight) : Number(projectedSquat?.weight)) +
    (hasBench ? Number(bench?.weight) : Number(projectedBench?.weight)) +
    (hasDeadlift ? Number(deadlift?.weight) : Number(projectedDeadlift?.weight))

  let names = ''
  if (isTeam) {
    names = entry.lift
      .map((l) => l.name)
      .filter(
        (element, index) =>
          entry.lift.map((l) => l.name).indexOf(element) === index,
      )
      .join(', ')
  }

  return (
    <TableRow
      key={entry.id}
      className={cn(
        'text-xl font-extrabold uppercase leading-5 tracking-tighter',
        isTeam ? 'text-2xl leading-5' : 'h-6',
      )}
    >
      {isTeam ? (
        <TableCell className='uppercase text-3xl leading-8 py-0'>
          <div>{entry.user?.name}</div>
          <div className='text-sm text-foreground/80 capitalize '>{names}</div>
        </TableCell>
      ) : (
        <TableCell className='text-lg py-0'>{entry.user?.name?.split(' ')[0]} {entry.user?.name?.split(' ')[1]?.slice(0, 1)}</TableCell>
      )}
      {hasSquat ? (
        <>
          <TableCell className='lowercase text-yellow-500'>
            {squat?.weight == '0' ? '' : squat?.weight + 'kg'}
          </TableCell>
          <TableCell className='lowercase text-yellow-500'>
            {isNaN(+squatDots) ? '' : squatDots}
          </TableCell>
          <TableCell className='font-semibold'>
            {squatPlaceDots?.place}
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
          <TableCell></TableCell>
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
          <TableCell className='font-semibold'>
            {benchPlaceDots?.place}
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
          <TableCell></TableCell>
        </>
      )}
      {hasDeadlift ? (
        <>
          <TableCell className='lowercase text-yellow-500'>
            {deadlift?.weight == '0' ? '' : deadlift?.weight + 'kg'}
          </TableCell>
          <TableCell className='text-yellow-500'>
            {isNaN(+deadliftDots) ? '' : deadliftDots}
          </TableCell>
          <TableCell className='font-semibold'>
            {deadliftPlaceDots?.place}
          </TableCell>
        </>
      ) : (
        <>
          <TableCell className='font-medium lowercase text-foreground/80'>
            {projectedDeadlift?.weight == '0'
              ? ''
              : projectedDeadlift?.weight + 'kg'}
          </TableCell>
          <TableCell className='font-medium text-foreground/80'>
            {isNaN(+projectedDeadliftDots) ? '' : projectedDeadliftDots}
          </TableCell>
          <TableCell></TableCell>
        </>
      )}
      <TableCell className='lowercase text-white'>
        {totalWeight == 0 ? '' : totalWeight + 'kg'}
      </TableCell>
      <TableCell className='text-white'>
        {isNaN(+totalDots) ? '' : totalDots.toFixed(2)}
      </TableCell>
      <TableCell>{index + 1}</TableCell>
    </TableRow>
  )
}

export default LeaderBoardRow
