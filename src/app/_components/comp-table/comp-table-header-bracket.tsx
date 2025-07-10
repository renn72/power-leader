'use client'
import { GetCompetitionEntryById } from '~/lib/types'

import { api } from '~/trpc/react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import Bracket from './bracket'
import { Button } from '~/components/ui/button'

const CompTableHeaderBracket = ({
  lifters,
  round,
  lift,
  bracket,
  isButton = false,
}: {
  lifters: GetCompetitionEntryById[]
  round: number
  lift: string
  bracket: number
  isButton?: boolean
}) => {
  const ctx = api.useUtils()
  return (
    <Dialog>
      <DialogTrigger asChild>
        {isButton ? (
          <div className='flex items-center justify-center px-2 pb-1'>
            <Button
              size='sm'
              variant='secondary'
              className='h-6 w-full'
            >
              Bracket
            </Button>
          </div>
        ) : (
          <div>Order Bracket</div>
        )}
      </DialogTrigger>
      <DialogContent
        forceMount
        className='w-full max-w-4xl'
      >
        <Card className='relative'>
          <CardHeader className='mb-4'>
            <CardTitle className='flex items-center justify-around gap-8 text-3xl'>
              <div className='capitalize'>{lift}</div>
              <Button
                onClick={() => {
                  ctx.competition.getCompetitionByUuid.refetch()
                }}
                variant='ghost'>refresh</Button>
            </CardTitle>
            <CardDescription className=''></CardDescription>
          </CardHeader>
          <Bracket
            lifters={lifters}
            round={round}
            lift={lift}
            bracket={bracket}
          />
        </Card>
      </DialogContent>
    </Dialog>
  )
}

export default CompTableHeaderBracket
