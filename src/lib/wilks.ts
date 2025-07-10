import type { GetCompetitionEntryById, GetLiftById } from '~/lib/types'

export const calculateNewWilks = (
	bodyWeight: number,
	weightLifted: number,
	isFemale: boolean,
) => {
	const maleCoeff = [
		47.4617885411949, 8.47206137941125, 0.073694103462609, -1.39583381094385e-3,
		7.07665973070743e-6, -1.20804336482315e-8,
	]
	const femaleCoeff = [
		-125.425539779509, 13.7121941940668, -0.0330725063103405,
		-1.0504000506583e-3, 9.38773881462799e-6, -2.3334613884954e-8,
	]
	let denominator = isFemale ? femaleCoeff[0] : maleCoeff[0]
	let coeff = isFemale ? femaleCoeff : maleCoeff
	let minbw = 40
	let maxbw = isFemale ? 150.95 : 200.95
	let bw = Math.min(Math.max(bodyWeight, minbw), maxbw)

	for (let i = 1; i < coeff.length; i++) {
		// @ts-ignore
		denominator += coeff[i] * Math.pow(bw, i)
	}

	// @ts-ignore
	let score = (600 / denominator) * weightLifted
	return Number(score.toFixed(2))
}

export const getliftWilks = (entry: GetCompetitionEntryById) => {

  const userWeight = Number(entry.weight)
  const userGender = entry.user?.gender?.toLowerCase()

	const squats = entry.lift.filter((l) => l.lift == 'squat')

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
	const squatDots = calculateNewWilks(
    userWeight,
		Number(squat?.weight),
    userGender == 'female',
	)

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
	const benchDots = calculateNewWilks(
    userWeight,
		Number(bench?.weight),
    userGender == 'female',
	)

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
	const deadliftDots = calculateNewWilks(
    userWeight,
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

export const getTotalWilks = (entry: GetCompetitionEntryById) => {
  const userWeight = Number(entry.weight)
  const userGender = entry.user?.gender?.toLowerCase()

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
	const squatDots = calculateNewWilks(
    userWeight,
		Number(squat?.weight),
    userGender == 'female',
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
	const benchDots = calculateNewWilks(
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
	const deadliftDots = calculateNewWilks(
    userWeight,
		Number(deadlift?.weight),
    userGender == 'female',
	)

	const totalDots =
		Number(isSquatting ? (hasSquat ? Number(squatDots) : 0) : 0) +
		Number(isBenching ? (hasBench ? Number(benchDots) : 0) : 0) +
		Number(isDeadlifting ? (hasDeadlift ? Number(deadliftDots) : 0) : 0)

	const totalWeight =
		(hasSquat ? Number(squat?.weight) : 0) +
		(hasBench ? Number(bench?.weight) : 0) +
		(hasDeadlift ? Number(deadlift?.weight) : 0)

	return totalDots
}
