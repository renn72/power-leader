'use client'

import type { GetCompetitionById } from '~/lib/types'

import Bracket from './bracket'

const CompBracket = ({
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
      <div className='text-center text-4xl'>Blackout.wsys.au</div>
      <div className='flex w-full lg:justify-between gap-4'>
        {Array.from(Array(squatBrackets).keys()).map((b) => (
          <Bracket
            entries={competition.entries.filter((e) => {
              const isSquat = e.events.reduce((a, c) => {
                if (c.event?.isSquat) return true
                return a
              }, false)
              return isSquat
            })}
            competition={competition}
            lift='squat'
            title={`Squat`}
            bracket={b + 1}
            key={b}
            isAdmin={isAdmin}
          />
        ))}
      </div>
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

export default CompBracket
