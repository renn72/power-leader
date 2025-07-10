import type { GetCompetitionEntryById, GetLiftById } from '~/lib/types'



export const calculateDOTS = (
  bodyWeight: number,
  weightLifted: number,
  isFemale: boolean,
) => {
  const maleCoeff = [
    -307.75076, 24.0900756, -0.1918759221, 0.0007391293, -0.000001093,
  ]

  const femaleCoeff = [
    -57.96288, 13.6175032, -0.1126655495, 0.0005158568, -0.0000010706,
  ]

  let denominator = isFemale ? femaleCoeff[0] : maleCoeff[0]
  if (!denominator) return '0.00'
  const coeff = isFemale ? femaleCoeff : maleCoeff
  const maxbw = isFemale ? 150 : 210
  const bw = Math.min(Math.max(bodyWeight, 40), maxbw)

  for (let i = 1; i < coeff.length; i++) {
    // @ts-ignore
    denominator += coeff[i] * Math.pow(bw, i)
  }

  const score = (500 / denominator) * weightLifted
  return Number(score.toFixed(2))
}



export const getliftDots = (entry: GetCompetitionEntryById) => {

  const userWeight = Number(entry.weight)
  const userGender = entry.user?.gender?.toLowerCase()

  const squats = entry.lift.filter((l) => l.lift == 'squat').slice(0, 3)

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
    Number(userWeight),
    Number(squat?.weight),
    userGender == 'female',
  )

  const bench = entry.lift
    .filter((l) => l.lift == 'bench').slice(0, 3)
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
    Number(userWeight),
    Number(bench?.weight),
    userGender == 'female',
  )

  const deadlift = entry.lift
    .filter((l) => l.lift == 'deadlift').slice(0, 3)
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
    Number(userWeight),
    Number(deadlift?.weight),
    userGender == 'female',
  )

  return {
    id: entry.id,
    name: entry.user?.name,
    squat: squatDots,
    bench: benchDots,
    deadlift: deadliftDots,
  }
}

export const getTotalDots = (entry: GetCompetitionEntryById) => {

  const userWeight = Number(entry.weight)
  const userGender = entry.user?.gender?.toLowerCase()


  const squats = entry.lift.filter((l) => l.lift == 'squat').slice(0, 3)

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
    userGender == 'female',
  )

  const isBenching = entry.lift.filter((l) => l.lift == 'bench').length > 0
  const hasBench = entry.lift
    .filter((l) => l.lift == 'bench')
    .reduce((a, b) => (b.state == 'judged' ? true : a), false)
  const bench = entry.lift
    .filter((l) => l.lift == 'bench').slice(0, 3)
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
    userGender == 'female',
  )

  const isDeadlifting =
    entry.lift.filter((l) => l.lift == 'deadlift').length > 0
  const hasDeadlift = entry.lift
    .filter((l) => l.lift == 'deadlift')
    .reduce((a, b) => (b.state == 'judged' ? true : a), false)
  const deadlift = entry.lift
    .filter((l) => l.lift == 'deadlift').slice(0, 3)
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
    Number(userWeight),
    Number(deadlift?.weight),
    userGender == 'female',
  )

  const totalDots =
    Number(
      isSquatting
        ? hasSquat
          ? Number(squatDots)
          : 0
        : 0,
    ) +
    Number(
      isBenching
        ? hasBench
          ? Number(benchDots)
          : 0
        : 0,
    ) +
    Number(
      isDeadlifting
        ? hasDeadlift
          ? Number(deadliftDots)
          : 0
        : 0,
    )

  const totalWeight =
    (hasSquat ? Number(squat?.weight) : 0) +
    (hasBench ? Number(bench?.weight) : 0) +
    (hasDeadlift ? Number(deadlift?.weight) : 0)

  return totalDots
}
