'use client'
import { GetCompetitionByUuid } from '~/lib/types'
import { Button } from '~/components/ui/button'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'
import { RefreshCw } from 'lucide-react'

import { api } from '~/trpc/react'

const Header = ({ competition }: { competition: GetCompetitionByUuid }) => {
  const ctx = api.useUtils()
  const { mutate: startCompetition } =
    api.competition.startCompetition.useMutation({
      onSettled: () => {
        ctx.competition.getCompetitionByUuid.refetch()
      },
    })
  const { mutate: pauseCompetition } =
    api.competition.pauseCompetition.useMutation({
      onSettled: () => {
        ctx.competition.getCompetitionByUuid.refetch()
      },
    })
  return (
    <div className='relative flex w-full flex-col items-center justify-center'>
      <RefreshCw
        size={20}
        className='absolute left-1 top-1 cursor-pointer text-muted-foreground hover:text-primary'
        onClick={() => {
          toast('Refreshing')
          ctx.competition.getCompetitionByUuid.refetch()
        }}
      />
      <div className='absolute bottom-0 right-0 flex hidden items-center gap-2 lg:flex'>
        {competition.currentState === 'closed' ||
        competition.currentState === 'paused' ? (
          <Button
            className='hidden'
            size='sm'
            onClick={() => {
              startCompetition(competition.id)
            }}
          >
            Start
          </Button>
        ) : (
          <Button
            size='sm'
            onClick={() => {
              pauseCompetition(competition.id)
            }}
          >
            Pause
          </Button>
        )}
      </div>
    </div>
  )
}

export default Header
