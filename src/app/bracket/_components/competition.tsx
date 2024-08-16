'use client'
import { useState } from 'react'

import type { GetCompetitionById, GetCompetitionEntryById } from '~/lib/types'

import Bracket from './bracket'

const Competition = ({ competition }: { competition: GetCompetitionById }) => {
  const [menSquat, setMenSquat] = useState<GetCompetitionEntryById[]>(() =>
    competition.entries
      .filter((entry) => entry.gender?.toLowerCase() == 'male')
      .filter((entry) => entry.squatOpener !== '')
      .map((e) => {
        return {
          ...e,
          wc: e.wc || '',
        }
      })
      .sort((a, b) => Number(a.squatOpener) - Number(b.squatOpener))
  )
  const [womenSquat, setWomenSquat] = useState<GetCompetitionEntryById[]>(() =>
    competition.entries
      .filter((entry) => entry.gender?.toLowerCase() == 'female')
      .filter((entry) => entry.squatOpener !== '')
      .map((e) => {
        return {
          ...e,
          wc: e.wc || '',
        }
      })
      .sort((a, b) => Number(a.squatOpener) - Number(b.squatOpener))
  )

  const [menBench, setMenBench] = useState<GetCompetitionEntryById[]>(() =>
    competition.entries
      .filter((entry) => entry.gender?.toLowerCase() == 'male')
      .filter((entry) => entry.benchOpener !== '')
      .map((e) => {
        return {
          ...e,
          wc: e.wc || '',
        }
      })
      .sort((a, b) => Number(a.benchOpener) - Number(b.benchOpener))
  )
  const [womenBench, setWomenBench] = useState<GetCompetitionEntryById[]>(() =>
    competition.entries
      .filter((entry) => entry.gender?.toLowerCase() == 'female')
      .filter((entry) => entry.benchOpener !== '')
      .map((e) => {
        return {
          ...e,
          wc: e.wc || '',
        }
      })
      .sort((a, b) => Number(a.benchOpener) - Number(b.benchOpener))
  )
  const [menDead, setMenDead] = useState<GetCompetitionEntryById[]>(() =>
    competition.entries
      .filter((entry) => entry.gender?.toLowerCase() == 'male')
      .filter((entry) => entry.deadliftOpener !== '')
      .map((e) => {
        return {
          ...e,
          wc: e.wc || '',
        }
      })
      .sort((a, b) => Number(a.deadliftOpener) - Number(b.deadliftOpener))
  )
  const [womenDead, setWomenDead] = useState<GetCompetitionEntryById[]>(() =>
    competition.entries
      .filter((entry) => entry.gender?.toLowerCase() == 'female')
      .filter((entry) => entry.deadliftOpener !== '')
      .map((e) => {
        return {
          ...e,
          wc: e.wc || '',
        }
      })
      .sort((a, b) => Number(a.deadliftOpener) - Number(b.deadliftOpener))
  )

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
