'use client'
import { useRouter } from 'next/navigation'
import { ChevronLeftCircleIcon } from 'lucide-react'

import { api } from '~/trpc/react'

export const dynamic = 'force-dynamic'

import CompInfo from './comp_info'
import Entries from './entries'

const Competition = ({ params }: { params: { comp: string } }) => {
  const { comp } = params
  const router = useRouter()

  const { data: competition, isLoading: competitionLoading } =
    api.competition.getCompetitionByUuid.useQuery(comp)

  if (competitionLoading) {
    return null
  }

  if (!competition) {
    return <div>Competition not found</div>
  }

  console.log('competition', competition)

  return (
    <>
      <div className='flex h-full min-h-[100vh] w-full flex-col'>
        <div className='w-full grid grid-cols-3 gap-4 mt-8'>
          <CompInfo
            className='col-span-1'
          competition={competition} />
          <Entries
            className='col-span-2'
          competition={competition} />
        </div>
      </div>
    </>
  )
}

export default Competition
