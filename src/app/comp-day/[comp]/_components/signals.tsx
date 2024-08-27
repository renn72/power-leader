import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardDescription,
} from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Check, User, UserCheck, X } from 'lucide-react'

import { api } from '~/trpc/react'

const Signals = ({currentLift, lifter, uuid} : {currentLift: any, lifter: any, uuid: string}) => {
  const ctx = api.useUtils()
  const { mutate: updateIsLiftGood } =
    api.competitionDay.updateIsLiftGood.useMutation({
      onSettled: () => {
        ctx.competition.get.refetch()
      },
    })
  return (
    <Card>
      <CardHeader></CardHeader>
      <CardContent className='flex w-full justify-around'>
        <div className='flex flex-col items-center gap-1'>
          <Check
            className='cursor-pointer'
            onClick={() => {
              updateIsLiftGood({
                id: currentLift?.id || -1,
                entryId: lifter?.id || -1,
                uuid: uuid,
                isGoodOne: true,
              })
            }}
          />
          <div>
            {currentLift?.isGoodOne === null ? (
              <div className=' h-16 w-16 rounded-full border border-4 border-white/60 '></div>
            ) : currentLift?.isGoodOne ? (
              <div className='good-lift h-16 w-16 rounded-full '></div>
            ) : (
              <div className='bad-lift h-16 w-16 rounded-full '></div>
            )}
          </div>
          <X
            className='cursor-pointer'
            onClick={() => {
              updateIsLiftGood({
                id: currentLift?.id || -1,
                entryId: lifter?.id || -1,
                uuid: uuid,
                isGoodOne: false,
              })
            }}
          />
          <Button
            variant='outline'
            className='opacity-50'
            size='sm'
            onClick={() => {
              updateIsLiftGood({
                id: currentLift?.id || -1,
                entryId: lifter?.id || -1,
                uuid: uuid,
                isGoodOne: null,
              })
            }}
          >
            Clear
          </Button>
        </div>
        <div className='flex flex-col items-center gap-1'>
          <Check
            className='cursor-pointer'
            onClick={() => {
              updateIsLiftGood({
                id: currentLift?.id || -1,
                entryId: lifter?.id || -1,
                uuid: uuid,
                isGoodTwo: true,
              })
            }}
          />
          <div>
            {currentLift?.isGoodTwo === null ? (
              <div className=' h-16 w-16 rounded-full border border-4 border-white/60 '></div>
            ) : currentLift?.isGoodTwo ? (
              <div className='good-lift h-16 w-16 rounded-full '></div>
            ) : (
              <div className='bad-lift h-16 w-16 rounded-full '></div>
            )}
          </div>
          <X
            className='cursor-pointer'
            onClick={() => {
              updateIsLiftGood({
                id: currentLift?.id || -1,
                entryId: lifter?.id || -1,
                uuid: uuid,
                isGoodTwo: false,
              })
            }}
          />
          <Button
            variant='outline'
            className='opacity-50'
            size='sm'
            onClick={() => {
              updateIsLiftGood({
                id: currentLift?.id || -1,
                entryId: lifter?.id || -1,
                uuid: uuid,
                isGoodTwo: null,
              })
            }}
          >
            Clear
          </Button>
        </div>
        <div className='flex flex-col items-center gap-1'>
          <Check
            className='cursor-pointer'
            onClick={() => {
              updateIsLiftGood({
                id: currentLift?.id || -1,
                entryId: lifter?.id || -1,
                uuid: uuid,
                isGoodThree: true,
              })
            }}
          />
          <div>
            {currentLift?.isGoodThree === null ? (
              <div className=' h-16 w-16 rounded-full border border-4 border-white/60 '></div>
            ) : currentLift?.isGoodThree ? (
              <div className='good-lift h-16 w-16 rounded-full '></div>
            ) : (
              <div className='bad-lift h-16 w-16 rounded-full '></div>
            )}
          </div>
          <X
            className='cursor-pointer'
            onClick={() => {
              updateIsLiftGood({
                id: currentLift?.id || -1,
                entryId: lifter?.id || -1,
                uuid: uuid,
                isGoodThree: false,
              })
            }}
          />
          <Button
            variant='outline'
            className='opacity-50'
            size='sm'
            onClick={() => {
              updateIsLiftGood({
                id: currentLift?.id || -1,
                entryId: lifter?.id || -1,
                uuid: uuid,
                isGoodThree: null,
              })
            }}
          >
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Signals
