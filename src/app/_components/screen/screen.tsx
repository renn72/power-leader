'use client'

import BenchBracket from '@/app/flights2/_components/bench-bracket'
import CompBracket from '@/app/flights2/_components/comp-bracket'
import DeadBracket from '@/app/flights2/_components/dead-bracket'
import SquatBracket from '@/app/flights2/_components/squat-bracket'
import LeaderBoard from '~/app/_components/board/leader-board'
import LeaderBoardResults from '~/app/_components/board-results/leader-board-results'

import { CompDayScreen as Loading } from '@/app/admin/comp-day/loading/[comp]/comp-day-screen'
import { CompDayScreen as MainScreen } from '@/app/admin/comp-day/screen/[comp]/comp-day-screen'
import { GetCompetitionByUuid } from '~/lib/types'

export const dynamic = 'force-dynamic'

const Screen = ({ screen, screenSize, competition } : { screen: string | null, screenSize: string | null, competition: GetCompetitionByUuid }) => {
  const comp = 'Show-Down-22-3-2025'

  const resultsAge = competition.compDayInfo.resultAge
  const resultsGender = competition.compDayInfo.resultGender
  const resultsWC = competition.compDayInfo.resultWC
  const resultsDiv = competition.compDayInfo.resultDiv

  return (
    <div className='w-full h-screen overflow-hidden'>
      <div className={`scale-${screenSize}`}>
        {screen === 'nil' ? null : null}
        {screen === 'screen' ? (
          <MainScreen
            competition={competition}
            comp={comp}
          />
        ) : null}
        {screen === 'loading' ? (
          <Loading
            competition={competition}
            comp={comp}
          />
        ) : null}
        {screen === 'comp-bracket' ? (
          <CompBracket competition={competition} />
        ) : null}
        {screen === 'squat-bracket' ? (
          <SquatBracket competition={competition} />
        ) : null}
        {screen === 'bench-bracket' ? (
          <BenchBracket competition={competition} />
        ) : null}

        {screen === 'dead-bracket' ? (
          <DeadBracket competition={competition} />
        ) : null}
        {screen === 'board-pro' ? (
          <LeaderBoard
            competition={competition}
            table={'pro'}
            gender={''}
            wc={''}
            isHeader={true}
          />
        ) : null}
        {screen === 'board-novice' ? (
          <LeaderBoard
            competition={competition}
            table={'novice'}
            gender={''}
            wc={''}
            isHeader={true}
          />
        ) : null}
        {screen === 'board-first-timers' ? (
          <LeaderBoard
            competition={competition}
            table={'first-timers'}
            gender={''}
            wc={''}
            isHeader={true}
          />
        ) : null}
        {screen === 'board-open' ? (
          <LeaderBoard
            competition={competition}
            table={'open'}
            gender={''}
            wc={''}
            isHeader={true}
          />
        ) : null}
        {screen === 'board-results' ? (
          <LeaderBoardResults
            competition={competition}
            table={resultsDiv || 'all'}
            gender={resultsGender || ''}
            wc={resultsWC || ''}
            age={resultsAge || ''}
          />
        ) : null}
      </div>
    </div>
  )
}

export { Screen }
