import type { GetCompetitionEntryById, GetLiftById } from './types'

export function sortEntriesFilter(
	entries: GetCompetitionEntryById[],
	lift: string,
	bracket: string,
	round: string,
) {
	return entries
		.filter((entry) => {
			if (lift === 'squat') {
				return entry.squatBracket == Number(bracket)
			}
			if (lift === 'bench') {
				return entry.benchBracket == Number(bracket)
			}
			if (lift === 'deadlift') {
				return entry.deadliftBracket == Number(bracket)
			}
			return false
		})
		.filter((entry) => {
			if (lift === 'squat') {
				const lifts = entry.lift.filter((l) => l.lift === 'squat')
				return lifts.find((l) => l.liftNumber === Number(round))
			}
			if (lift === 'bench') {
				const lifts = entry.lift.filter((l) => l.lift === 'bench')
				return lifts.find((l) => l.liftNumber === Number(round))
			}
			if (lift === 'deadlift') {
				const lifts = entry.lift.filter((l) => l.lift === 'deadlift')
				return lifts.find((l) => l.liftNumber === Number(round))
			}
		})
		.sort((a, b) => {
			const orderA =
				a.lift.find((l) => l.lift == lift && l.liftNumber === Number(round))
					?.weight || null
			const orderB =
				b.lift.find((l) => l.lift == lift && l.liftNumber === Number(round))
					?.weight || null
			if (orderA == null || orderA == undefined) return 1
			if (orderB == null || orderB == undefined) return -1

			return Number(orderA) - Number(orderB)
		})
}

export function liftState(lift: GetLiftById) {
	const isOne = lift?.isGoodOne
	const isTwo = lift?.isGoodTwo
	const isThree = lift?.isGoodThree
	const isJudged = isOne !== null && isTwo !== null && isThree !== null
	const isGood = (isOne && isTwo) || (isTwo && isThree) || (isOne && isThree)

	return {
		isJudged,
		isGood,
	}
}
