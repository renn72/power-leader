'use client'
import type { GetCompetitionById, } from '~/lib/types'

import Bracket from './bracket'

const Competition = ({ competition }: { competition: GetCompetitionById }) => {
  const menSquat = competition.entries
    .filter((entry) => entry.gender?.toLowerCase() == 'male')
    .map((e) => {
      return {
        ...e,
        wc: e.wc || '',
      }
    })
    .sort((a, b) => {
      if (a.squatOrderOne !== null && b.squatOrderOne !== null) {
        return Number(a.squatOrderOne) - Number(b.squatOrderOne)
      }
      if (a.squatOpener === '') return 1
      if (b.squatOpener === '') return -1
      return Number(a.squatOpener) - Number(b.squatOpener)
    })

  console.log('menSquat', menSquat)

  const womenSquat = competition.entries
    .filter((entry) => entry.gender?.toLowerCase() == 'female')
    .filter((entry) => entry.squatOpener !== '')
    .map((e) => {
      return {
        ...e,
        wc: e.wc || '',
      }
    })
    .sort((a, b) => {
      if (a.squatOrderOne !== null && b.squatOrderOne !== null) {
        return Number(a.squatOrderOne) - Number(b.squatOrderOne)
      }
      return Number(a.squatOpener) - Number(b.squatOpener)
    })

  const menBench = competition.entries
    .filter((entry) => entry.gender?.toLowerCase() == 'male')
    .filter((entry) => entry.benchOpener !== '')
    .map((e) => {
      return {
        ...e,
        wc: e.wc || '',
      }
    })
    .sort((a, b) => {
      if (a.benchOrderOne !== null && b.benchOrderOne !== null) {
        return Number(a.benchOrderOne) - Number(b.benchOrderOne)
      }
      return Number(a.benchOpener) - Number(b.benchOpener)
    })

  const womenBench = competition.entries
    .filter((entry) => entry.gender?.toLowerCase() == 'female')
    .filter((entry) => entry.benchOpener !== '')
    .map((e) => {
      return {
        ...e,
        wc: e.wc || '',
      }
    })
    .sort((a, b) => {
      if (a.benchOrderOne !== null && b.benchOrderOne !== null) {
        return Number(a.benchOrderOne) - Number(b.benchOrderOne)
      }
      return Number(a.benchOpener) - Number(b.benchOpener)
    })

  const menDead = competition.entries
    .filter((entry) => entry.gender?.toLowerCase() == 'male')
    .filter((entry) => entry.deadliftOpener !== '')
    .map((e) => {
      return {
        ...e,
        wc: e.wc || '',
      }
    })
    .sort((a, b) => {
      if (a.deadliftOrderOne !== null && b.deadliftOrderOne !== null) {
        return Number(a.deadliftOrderOne) - Number(b.deadliftOrderOne)
      }
      return Number(a.deadliftOpener) - Number(b.deadliftOpener)
    })

  const womenDead = competition.entries
    .filter((entry) => entry.gender?.toLowerCase() == 'female')
    .filter((entry) => entry.deadliftOpener !== '')
    .map((e) => {
      return {
        ...e,
        wc: e.wc || '',
      }
    })
    .sort((a, b) => {
      if (a.deadliftOrderOne !== null && b.deadliftOrderOne !== null) {
        return Number(a.deadliftOrderOne) - Number(b.deadliftOrderOne)
      }
      return Number(a.deadliftOpener) - Number(b.deadliftOpener)
    })

  console.log(menSquat)

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
