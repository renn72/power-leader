'use client'

import type { GetCompetitionById, } from '~/lib/types'

import Bracket from './bracket'

const Competition = ({ competition }: { competition: GetCompetitionById }) => {

  //squat
  const menSquat = competition.entries
    .filter((entry) => entry.gender?.toLowerCase() == 'male')
    .map((e) => {
      return {
        ...e,
        wc: e.wc || '',
      }
    })
    .sort((a, b) => Number(a.squatOpener) - Number(b.squatOpener))
    .sort((a, b) => Number(a.wc.split('-')[0]) - Number(b.wc.split('-')[0]))

  const womenSquat = competition.entries
    .filter((entry) => entry.gender?.toLowerCase() == 'female')
    .map((e) => {
      return {
        ...e,
        wc: e.wc || '',
      }
    })
    .sort((a, b) => Number(a.squatOpener) - Number(b.squatOpener))
    .sort((a, b) => Number(a.wc.split('-')[0]) - Number(b.wc.split('-')[0]))

  //bench
  const menBench = competition.entries
    .filter((entry) => entry.gender?.toLowerCase() == 'male')
    .map((e) => {
      return {
        ...e,
        wc: e.wc || '',
      }
    })
    .sort((a, b) => Number(a.benchOpener) - Number(b.benchOpener))
    .sort((a, b) => Number(a.wc.split('-')[0]) - Number(b.wc.split('-')[0]))

  const womenBench = competition.entries
    .filter((entry) => entry.gender?.toLowerCase() == 'female')
    .map((e) => {
      return {
        ...e,
        wc: e.wc || '',
      }
    })
    .sort((a, b) => Number(a.benchOpener) - Number(b.benchOpener))
    .sort((a, b) => Number(a.wc.split('-')[0]) - Number(b.wc.split('-')[0]))

  //Dead
  const menDead = competition.entries
    .filter((entry) => entry.gender?.toLowerCase() == 'male')
    .map((e) => {
      return {
        ...e,
        wc: e.wc || '',
      }
    })
    .sort((a, b) => Number(a.deadliftOpener) - Number(b.deadliftOpener))
    .sort((a, b) => Number(a.wc.split('-')[0]) - Number(b.wc.split('-')[0]))
  const womenDead = competition.entries
    .filter((entry) => entry.gender?.toLowerCase() == 'female')
    .map((e) => {
      return {
        ...e,
        wc: e.wc || '',
      }
    })
    .sort((a, b) => Number(a.deadliftOpener) - Number(b.deadliftOpener))
    .sort((a, b) => Number(a.wc.split('-')[0]) - Number(b.wc.split('-')[0]))

  console.log(competition)

  return (
    <div className=' flex w-full flex-col  items-center gap-8'>
      <div className='flex w-full justify-center gap-16'>
        <Bracket
          entries={menSquat}
          lift='squat'
          title={`Men\'s Squat`}
          bracket={1}
        />
        <Bracket
          entries={womenSquat}
          lift='squat'
          title={`Women\'s Squat`}
          bracket={2}
        />
      </div>
      <div className='flex w-full justify-center gap-16'>
        <Bracket
          entries={menBench}
          lift='bench'
          title={`Men\'s Bench`}
          bracket={1}
        />
        <Bracket
          entries={womenBench}
          lift='bench'
          title={`Women\'s Bench`}
          bracket={2}
        />
      </div>
      <div className='flex w-full justify-center gap-16'>
        <Bracket
          entries={menDead}
          lift='deadlift'
          title={`Men\'s Deadlift`}
          bracket={1}
        />
        <Bracket
          entries={womenDead}
          lift='deadlift'
          title={`Women\'s Deadlift`}
          bracket={2}
        />
      </div>
    </div>
  )
}

export default Competition
