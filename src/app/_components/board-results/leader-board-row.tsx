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
import { Card, CardContent } from '@/components/ui/card'
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

  const userName = entry.user?.name

  return (
    <Card
      key={entry.id}
      className={cn('w-full max-w-[800px] text-4xl font-bold')}
    >
      <CardContent className='flex gap-6 pt-6 justify-center'>
      <div>{index + 1}</div>
      <div className='capitalize'>
        {userName}
      </div>
      <div className=''>
        {totalWeight == 0 ? '0' : totalWeight + 'kg'}
      </div>
      <div className=''>
        {isNaN(+totalDots) ? '' : totalDots.toFixed(2)}
      </div>
      </CardContent>
    </Card>
  )
}

export default LeaderBoardRow
