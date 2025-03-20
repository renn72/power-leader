'use client'

import type { GetCompetitionById } from '~/lib/types'

import Bracket from './bracket'

const DeadBracket = ({
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
       {Array.from(Array(deadliftBrackets).keys()).map((b) => (
          <Bracket
            entries={competition.entries.filter((e) => {
              const isDeadlift = e.events.reduce((a, c) => {
                if (c.event?.isDeadlift) return true
                return a
              }, false)
              return isDeadlift
            })}
            competition={competition}
            lift='deadlift'
            title={`Deadlift`}
            bracket={b + 1}
            key={b}
            isAdmin={isAdmin}
          />
        ))}
      </div>
    </div>
  )
}

export default DeadBracket
