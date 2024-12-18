'use client'

import { api } from '~/trpc/react'
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group-bold'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'

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
  const { mutate: startTimer } = api.competitionDay.startTimer.useMutation()
  const { mutate: stopTimer } = api.competitionDay.stopTimer.useMutation()
  const { mutate: resetTimer } = api.competitionDay.resetTimer.useMutation()

  const brackets =
    lift === 'squat'
      ? Number(competition.squatBrackets)
      : lift === 'bench'
        ? Number(competition.benchPressBrackets)
        : Number(competition.deadliftBrackets)

  return (
    <div className='grid grid-cols-3 gap-2'>
      <div className='flex items-center justify-around rounded-md border border-input p-2'>
        <div className='text-lg font-bold'>Lift</div>
        <ToggleGroup
          type='single'
          variant='outline'
          size='lg'
          value={lift}
          defaultValue={competition.compDayInfo.lift.toLowerCase()}
          onValueChange={(value) => {
            setLift(value)
            return
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
      <div className='flex items-center justify-around rounded-md border border-input p-2'>
        <div className='text-lg font-bold'>Bracket</div>
        <ToggleGroup
          type='single'
          size='lg'
          variant='outline'
          value={bracket}
          defaultValue={competition.compDayInfo.bracket.toString() || '1'}
          onValueChange={(value) => {
            setBracket(value)
            return
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
          {Array.from({ length: brackets }, (_, i) => i + 1).map((bracket) => (
            <ToggleGroupItem
              key={bracket}
              value={bracket.toString()}
            >
              {bracket}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className='flex items-center justify-around rounded-md border border-input p-2'>
        <div>Timer</div>
        <Button
          onClick={() => {
            startTimer({
              id: competition.id,
              uuid: competition.uuid || '',
            })
          }}
          variant='secondary'
        >
          Start
        </Button>
        <Button
          onClick={() => {
            resetTimer({
              id: competition.id,
              uuid: competition.uuid || '',
            })
          }}
          variant='secondary'
        >
          Reset
        </Button>
        <Button
          onClick={() => {
            stopTimer({
              id: competition.id,
              uuid: competition.uuid || '',
            })
          }}
          variant='secondary'
        >
          Stop
        </Button>
      </div>
    </div>
  )
}

export default ActionPanel
