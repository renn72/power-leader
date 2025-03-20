'use client'

import type { GetCompetitionById } from '~/lib/types'

import Bracket from './bracket'

const BenchBracket = ({
  competition,
  isAdmin = true,
}: {
  competition: GetCompetitionById
  isAdmin?: boolean
}) => {

  const squatBrackets = Number(competition.squatBrackets)
  const benchPressBrackets = Number(competition.benchPressBrackets)
  const deadliftBrackets = Number(competition.deadliftBrackets)

  return (
    <div className='flex lg:w-full flex-col lg:items-center gap-8'>
      <div className='flex w-full lg:justify-between gap-4'>
        {Array.from(Array(benchPressBrackets).keys()).map((b) => (
          <Bracket
            entries={competition.entries.filter((e) => {
              const isBench = e.events.reduce((a, c) => {
                if (c.event?.isBench) return true
                return a
              }, false)
              return isBench
            })}
            competition={competition}
            lift='bench'
            title={`Bench`}
            bracket={b + 1}
            key={b}
            isAdmin={isAdmin}
          />
        ))}
      </div>
    </div>
  )
}

export default BenchBracket
