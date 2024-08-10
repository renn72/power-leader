'use client'
import { useRouter } from 'next/navigation'
import { ChevronLeftCircleIcon } from 'lucide-react'

import { api } from '~/trpc/react'

export const dynamic = 'force-dynamic'

import { Card, CardContent, CardHeader } from '~/components/ui/card'

import CompInfo from './comp_info'

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
        <div className='flex w-full p-2'>
          <ChevronLeftCircleIcon
            className='h-8 w-8 cursor-pointer'
            onClick={() => router.back()}
          />
        </div>
        <div className='flex w-full'>
          <CompInfo competition={competition} />
          <div className='flex w-full flex-col items-center gap-2 text-lg font-medium'>
            <Card className='w-full max-w-2xl'>
              <CardHeader></CardHeader>
              <CardContent>hi</CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

export default Competition
