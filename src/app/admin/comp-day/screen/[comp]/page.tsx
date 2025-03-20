'use client'

import { api } from '~/trpc/react'
import { CompDayScreen } from './comp-day-screen'

const Page = ({ params }: { params: { comp: string } }) => {
  const { comp } = params
  const { data: competition } = api.competition.getCompetitionByUuid.useQuery(
    comp,
    {
      refetchInterval: 1000 * 60 * 1,
    },
  )
  if (!competition) return null

  return (
    <CompDayScreen
      competition={competition}
      comp={comp}
    />
  )
}


export default Page
