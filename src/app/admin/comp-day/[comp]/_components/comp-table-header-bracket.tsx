'use client'
import { GetCompetitionEntryById, } from '~/lib/types'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import Bracket from './bracket'

const CompTableHeaderBracket = ({
  lifters,
  round,
  lift,
  bracket
}: {
  lifters: GetCompetitionEntryById[]
  round: number
  lift: string
    bracket: number
}) => {
  return (
    <Dialog>
      <DialogTrigger>Order Bracket</DialogTrigger>
      <DialogContent
        forceMount
        className='w-full max-w-4xl'
      >
        <Card className='relative'>
          <CardHeader className='mb-4'>
            <CardTitle className='flex items-center justify-around text-3xl'>
              <div className='capitalize'>{lift}</div>
            </CardTitle>
            <CardDescription className=''></CardDescription>
          </CardHeader>
          <Bracket lifters={lifters} round={round} lift={lift} bracket={bracket} />
        </Card>
      </DialogContent>
    </Dialog>
  )
}

export default CompTableHeaderBracket
