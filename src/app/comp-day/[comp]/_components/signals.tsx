import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Check, X } from 'lucide-react'

import { api } from '~/trpc/react'

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
    <div className='flex flex-col items-center lg:gap-1'>
      <Check
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
      <div>
        {currentLift ? (
          <div>
            {isGood === null ? (
              <div className='h-8 w-8 lg:h-16 lg:w-16 rounded-full border border-4 border-white/60 '></div>
            ) : isGood ? (
              <div className='good-lift h-8 w-8 lg:h-16 lg:w-16 rounded-full '></div>
            ) : (
              <div className='bad-lift h-8 w-8 lg:h-16 lg:w-16 rounded-full '></div>
            )}
          </div>
        ) : (
          <div className=' h-16 w-16 rounded-full border border-4 border-white/60 '></div>
        )}
      </div>
      <X
        className='cursor-pointer'
        onClick={() => {
          updateIsLiftGood({
            id: currentLift?.id || -1,
            entryId: lifter?.id || -1,
            uuid: uuid,
            [`${field}`]: false,
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
        ctx.competition.get.refetch()
      },
    })
  return (
    <Card>
      <CardHeader className='p-0'></CardHeader>
      <CardContent className='flex w-full justify-around p-0 lg:p-6'>
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
