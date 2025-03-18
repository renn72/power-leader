import { GetCompetitionEntryById } from './types'

export function sortEntriesFilter(
  entries: GetCompetitionEntryById[] | undefined,
  lift: string,
  bracket: string,
  round: string,
) {
  return entries
    .filter((entry) => {
      if (lift === 'squat') {
        return entry.squatBracket == Number(bracket)
      } else if (lift === 'bench') {
        return entry.benchBracket == Number(bracket)
      } else if (lift === 'deadlift') {
        return entry.deadliftBracket == Number(bracket)
      }
      return false
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
