'use client'

import { api } from '~/trpc/react'
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group-bold'
import { toast } from 'sonner'

const ActionPanel = ({
  competition,
  lift,
  bracket,
  round,
  index,
  setLift,
  setBracket,
  setRound,
}: {
  competition: any
  lift: string
  bracket: string
  round: string
  index: string
  setLift: (lift: string) => void
  setBracket: (bracket: string) => void
  setRound: (round: string) => void
}) => {
  const ctx = api.useUtils()
  const { mutate: updateLift } = api.competitionDay.updateLift.useMutation({
    onSettled: () => {
      ctx.competition.get.refetch()
    },
    onSuccess: (e) => {
      toast(JSON.stringify(e))
    },
  })

  return (
    <div className='grid grid-cols-3 gap-2'>
      <div className='hidden'>
        <div>Day</div>
        <div>{competition.compDayInfo.day + 1}</div>
      </div>
      <div className='rounded-md border border-input p-2'>
        <div className='text-lg font-bold'>Lift</div>
        <ToggleGroup
          type='single'
          variant='outline'
          size='lg'
          defaultValue={competition.compDayInfo.lift.toLowerCase()}
          onValueChange={(value) => {
            setLift(value)
            updateLift({
              id: competition.id,
              uuid: competition.uuid || '',
              round: +round,
              lift: value,
              bracket: +bracket,
              index: +index,
            })
          }}
        >
          <ToggleGroupItem value='squat'>Squat</ToggleGroupItem>
          <ToggleGroupItem value='bench'>Bench</ToggleGroupItem>
          <ToggleGroupItem value='deadlift'>Deadlift</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className='rounded-md border border-input p-2'>
        <div className='text-lg font-bold'>Round</div>
        <ToggleGroup
          type='single'
          size='lg'
          variant='outline'
          defaultValue={competition.compDayInfo.round.toString()}
          onValueChange={(value) => {
            setRound(value)
            updateLift({
              id: competition.id,
              uuid: competition.uuid || '',
              round: +value,
              lift: lift,
              bracket: +bracket,
              index: +index,
            })
          }}
        >
          <ToggleGroupItem value='1'>1</ToggleGroupItem>
          <ToggleGroupItem value='2'>2</ToggleGroupItem>
          <ToggleGroupItem value='3'>3</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className='rounded-md border border-input p-2'>
        <div className='text-lg font-bold'>Bracket</div>
        <ToggleGroup
          type='single'
          size='lg'
          variant='outline'
          defaultValue={competition.compDayInfo.bracket.toString() || '1'}
          onValueChange={(value) => {
            setBracket(value)
            updateLift({
              id: competition.id,
              uuid: competition.uuid || '',
              round: +round,
              lift: lift,
              bracket: +value,
              index: +index,
            })
          }}
        >
          <ToggleGroupItem value='1'>1</ToggleGroupItem>
          <ToggleGroupItem value='2'>2</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  )
}

export default ActionPanel
