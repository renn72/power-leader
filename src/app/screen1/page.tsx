'use client'

import { api } from '~/trpc/react'
import { CompDayScreen } from '../admin/comp-day/screen/[comp]/comp-day-screen'

export default function Home() {
  const { data: competition } = api.competition.get.useQuery(1, {
    refetchInterval: 1000 * 160 * 1,
  })
  const comp = 'Show-Down-22-3-2025'
  if (!competition) return null
  return (
    <CompDayScreen
      competition={competition}
      comp={comp}
    />
  )
}
