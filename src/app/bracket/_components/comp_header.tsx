'use client'

import { api } from '~/trpc/react'
import type { GetCompetitionById } from '~/lib/types'

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { toast } from 'sonner'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const UpdateComp = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => {
  return (
    <Card className='flex flex-col items-center gap-2'>
      <CardHeader>
        <CardTitle className='text-xl'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex items-center gap-2 text-xl font-bold'>
          {children}
        </div>
      </CardContent>
    </Card>
  )
}

const CompHeader = ({ competition }: { competition: GetCompetitionById }) => {
  const ctx = api.useUtils()
  const { mutate: updateDaysOfCompetition } =
    api.competition.updateDaysOfCompetition.useMutation({
      onSettled: () => {
        ctx.competition.getMyCompetitions.refetch()
        toast('Updated')
      },
    })

  const { mutate: updatePlatforms } =
    api.competition.updatePlatforms.useMutation({
      onSettled: () => {
        ctx.competition.getMyCompetitions.refetch()
        toast('Updated')
      },
    })
  return (
    <div className='flex hidden w-full max-w-sm items-center justify-between'>
      <UpdateComp title='Days'>
        <ChevronLeft
          size={32}
          strokeWidth={3}
          className='cursor-pointer hover:scale-110 hover:text-muted-foreground'
          onClick={() => {
            if (competition?.daysOfCompetition == 1) {
              toast('You can not delete the first day')
              return
            }
            updateDaysOfCompetition({
              id: competition.id,
              daysOfCompetition: Number(competition?.daysOfCompetition) - 1,
            })
          }}
        />
        <div>{competition.daysOfCompetition}</div>
        <ChevronRight
          size={32}
          strokeWidth={3}
          className='cursor-pointer hover:scale-110 hover:text-muted-foreground'
          onClick={() => {
            updateDaysOfCompetition({
              id: competition.id,
              daysOfCompetition: Number(competition?.daysOfCompetition) + 1,
            })
          }}
        />
      </UpdateComp>
      <UpdateComp title='Platforms'>
        <ChevronLeft
          size={32}
          strokeWidth={3}
          className='cursor-pointer hover:scale-110 hover:text-muted-foreground'
          onClick={() => {
            if (competition?.platforms == 1) {
              toast('You need to have at least one platform')
              return
            }
            updatePlatforms({
              id: competition.id,
              platforms: Number(competition?.platforms) - 1,
            })
          }}
        />
        <div>{competition.platforms}</div>
        <ChevronRight
          size={32}
          strokeWidth={3}
          className='cursor-pointer hover:scale-110 hover:text-muted-foreground '
          onClick={() => {
            updatePlatforms({
              id: competition.id,
              platforms: Number(competition?.platforms) + 1,
            })
          }}
        />
      </UpdateComp>
    </div>
  )
}

export default CompHeader
