'use client'

import {
  GetCompetitionByUuid,
  GetCompetitionEntryById,
  GetLiftById,
} from '~/lib/types'
import {
  calculateNewWilks,
  cn,
  getliftWilks,
} from '~/lib/utils'

import {
  calculateDOTS,
  getliftDots,
} from '~/lib/dots'

import { TableCell, TableRow } from '@/components/ui/table'

const LeaderBoardRow = ({
  entry,
  entries,
  index,
}: {
  entry: GetCompetitionEntryById
  entries: GetCompetitionEntryById[]
  index: number
}) => {
  const userWeight = Number(entry.weight)
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
    userWeight,
    Number(squat?.weight),
    squat.gender?.toLowerCase() == 'female',
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
    userWeight,
    Number(bench?.weight),
    bench.gender?.toLowerCase() == 'female',
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
    userWeight,
    Number(deadlift?.weight),
    deadlift.gender?.toLowerCase() == 'female',
  )


  const liftsDots = entries?.map((e) => getliftDots(e))
  const check = liftsDots?.filter((l) => l.squat !== 0 && !isNaN(Number(l.squat)))
  .sort((a, b) => Number(b.squat) - Number(a.squat))
  .map((l, i) => ({ id: l.id, place: i + 1 }))
  const squatPlaceDots = liftsDots
    ?.filter((l) => l.squat !== 0 && !isNaN(Number(l.squat)))
    .sort((a, b) => Number(b.squat) - Number(a.squat))
    .map((l, i) => ({ id: l.id, place: i + 1 }))
    .find((l) => l.id == entry.id)
  const benchPlaceDots = liftsDots
    ?.filter((l) => l.bench !== 0 && !isNaN(Number(l.bench)))
    .sort((a, b) => Number(b.bench) - Number(a.bench))
    .map((l, i) => ({ id: l.id, place: i + 1 }))
    .find((l) => l.id == entry.id)
  const deadliftPlaceDots = liftsDots
    ?.filter((l) => l.deadlift !== 0 && !isNaN(Number(l.deadlift)))
    .sort((a, b) => Number(b.deadlift) - Number(a.deadlift))
    .map((l, i) => ({ id: l.id, place: i + 1 }))
    .find((l) => l.id == entry.id)

  const squatTotalDots = isSquatting ? (hasSquat ? Number(squatDots) : 0) : 0
  const benchTotalDots = isBenching ? (hasBench ? Number(benchDots) : 0) : 0
  const deadliftTotalDots = isDeadlifting
    ? hasDeadlift
      ? Number(deadliftDots)
      : 0
    : 0

  const totalDots =
    (isNaN(squatTotalDots) ? 0 : squatTotalDots) +
    (isNaN(benchTotalDots) ? 0 : benchTotalDots) +
    (isNaN(deadliftTotalDots) ? 0 : deadliftTotalDots)

  const totalWeight =
    (hasSquat ? Number(squat?.weight) : 0) +
    (hasBench ? Number(bench?.weight) : 0) +
    (hasDeadlift ? Number(deadlift?.weight) : 0)

  return (
    <TableRow
      key={entry.id}
      className={cn(
        'text-sm md:text-lg font-extrabold uppercase leading-4 tracking-tightest',
      )}
    >
      <TableCell className='py-0 truncate sticky left-0 z-20 bg-background'>
        {entry.user?.name?.split(' ')[0]?.slice(0, 1)}{' '}
        {entry.user?.name?.split(' ')[1] &&
        (entry.user.name.split(' ')[1]?.length ?? 0) > 8
          ? entry.user?.name?.split(' ')[1]?.slice(0, 8) +'..'
          : entry.user?.name?.split(' ')[1]}
      </TableCell>
      {hasSquat ? (
        <>
          <TableCell className='lowercase text-yellow-500'>
            {squat?.weight == '0' ? '' : squat?.weight + 'kg'}
          </TableCell>
          <TableCell className='lowercase text-yellow-500'>
            {isNaN(+squatDots) ? '' : squatDots}
          </TableCell>
          <TableCell className='font-semibold text-center'>
            {squatPlaceDots?.place}
          </TableCell>
        </>
      ) : (
        <>
          <TableCell className='font-medium lowercase text-foreground/80'></TableCell>
          <TableCell className='font-medium text-foreground/80'></TableCell>
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
          <TableCell className='font-semibold text-center'>
            {benchPlaceDots?.place}
          </TableCell>
        </>
      ) : (
        <>
          <TableCell className='font-medium lowercase text-foreground/80'></TableCell>
          <TableCell className='font-medium text-foreground/80'></TableCell>
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
          <TableCell className='font-semibold text-center'>
            {deadliftPlaceDots?.place}
          </TableCell>
        </>
      ) : (
        <>
          <TableCell className='font-medium lowercase text-foreground/80'></TableCell>
          <TableCell className='font-medium text-foreground/80'></TableCell>
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
