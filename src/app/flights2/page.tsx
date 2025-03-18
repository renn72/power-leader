'use client'

import { api } from '~/trpc/react'

import CompBracket from '@/app/admin/bracket/_components/comp-bracket'
import { ModeToggle } from '@/app/_components/mode-toggle'

const Page = () => {
  const { data: competition, isLoading: competitionsLoading } =
    api.competition.get.useQuery(1)

  if (competitionsLoading) return null
  if (!competition) return null

  return (
    <div className='p-2 relative'>
      <div className='absolute top-3 left-3 z-[100]'>
        <ModeToggle />
      </div>
      <CompBracket
        competition={competition}
        isAdmin={false}
      />
    </div>
  )
}

export default Page
