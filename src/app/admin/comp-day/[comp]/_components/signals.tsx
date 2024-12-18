import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Check, X } from 'lucide-react'

import { api } from '~/trpc/react'

export const dynamic = 'force-dynamic'

const Sign = ({
  isGood,
  updateIsLiftGood,
  currentLift,
  lifter,
  uuid,
  field,
}: {
  isGood: boolean
  updateIsLiftGood: any
  currentLift: any
  lifter: any
  uuid: string
  field: string
}) => {
  return (
    <div className='flex flex-col items-center gap-2 lg:gap-1'>
      <div className='flex items-center justify-center gap-2'>
        <Check
          size={36}
          className='cursor-pointer'
          onClick={() => {
            updateIsLiftGood({
              id: currentLift?.id || -1,
              entryId: lifter?.id || -1,
              uuid: uuid,
              [`${field}`]: true,
            })
          }}
        />
        <div className=''>
          {currentLift ? (
            <div>
              {isGood === null ? (
                <div className='h-8 w-8 rounded-full border border-4 border-white/60 lg:h-12 lg:w-12 '></div>
              ) : isGood ? (
                <div className='good-lift h-8 w-8 rounded-full lg:h-12 lg:w-12 '></div>
              ) : (
                <div className='bad-lift h-8 w-8 rounded-full lg:h-12 lg:w-12 '></div>
              )}
            </div>
          ) : (
            <div className=' h-12 w-12 rounded-full border border-4 border-white/60 '></div>
          )}
        </div>
        <X
          className='cursor-pointer'
          size={36}
          onClick={() => {
            updateIsLiftGood({
              id: currentLift?.id || -1,
              entryId: lifter?.id || -1,
              uuid: uuid,
              [`${field}`]: false,
            })
          }}
        />
      </div>
      <Button
        variant='outline'
        className='opacity-50 h-6'
        size='sm'
        onClick={() => {
          updateIsLiftGood({
            id: currentLift?.id || -1,
            entryId: lifter?.id || -1,
            uuid: uuid,
            [`${field}`]: null,
          })
        }}
      >
        Clear
      </Button>
    </div>
  )
}

const Signals = ({
  currentLift,
  lifter,
  uuid,
}: {
  currentLift: any
  lifter: any
  uuid: string
}) => {
  const ctx = api.useUtils()
  const { mutate: updateIsLiftGood } =
    api.competitionDay.updateIsLiftGood.useMutation({
      onSettled: () => {
        ctx.competition.getCompetitionByUuid.refetch()
      },
    })
  return (
    <Card>
      <CardHeader className='p-0'></CardHeader>
      <CardContent className='flex w-full justify-around p-1'>
        <Sign
          isGood={currentLift?.isGoodOne}
          updateIsLiftGood={updateIsLiftGood}
          currentLift={currentLift}
          lifter={lifter}
          uuid={uuid}
          field='isGoodOne'
        />
        <Sign
          isGood={currentLift?.isGoodTwo}
          updateIsLiftGood={updateIsLiftGood}
          currentLift={currentLift}
          lifter={lifter}
          uuid={uuid}
          field='isGoodTwo'
        />
        <Sign
          isGood={currentLift?.isGoodThree}
          updateIsLiftGood={updateIsLiftGood}
          currentLift={currentLift}
          lifter={lifter}
          uuid={uuid}
          field='isGoodThree'
        />
      </CardContent>
    </Card>
  )
}

export default Signals
