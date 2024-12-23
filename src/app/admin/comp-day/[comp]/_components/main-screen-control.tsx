'use client'

import { api } from '~/trpc/react'
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group-bold'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'

const MainScreenControl = ({
  competition,
  lift,
  bracket,
  round,
  index,
  setLift,
  setBracket,
  setRound,
  syncToCompetition,
}: {
  competition: any
  lift: string
  bracket: string
  round: string
  index: string
  setLift: (lift: string) => void
  setBracket: (bracket: string) => void
  setRound: (round: string) => void
  syncToCompetition: () => void
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

  const brackets =
    lift === 'squat'
      ? Number(competition.squatBrackets)
      : lift === 'bench'
        ? Number(competition.benchPressBrackets)
        : Number(competition.deadliftBrackets)

  return (
    <div className='flex flex-row items-center gap-2'>
      <div className='flex items-center justify-around gap-2 rounded-md border border-input p-2'>
        <ToggleGroup
          type='single'
          variant='outline'
          size='lg'
          defaultValue={competition.compDayInfo.lift.toLowerCase()}
          onValueChange={(value) => {
            if (value === '') return
            updateLift({
              id: competition.id,
              uuid: competition.uuid || '',
              round: competition.compDayInfo.round,
              lift: value,
              bracket: competition.compDayInfo.bracket,
              index: competition.compDayInfo.index,
            })
          }}
        >
          <ToggleGroupItem value='squat'>Squat</ToggleGroupItem>
          <ToggleGroupItem value='bench'>Bench</ToggleGroupItem>
          <ToggleGroupItem value='deadlift'>Deadlift</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className='flex  items-center justify-around gap-2 rounded-md border border-input p-2'>
        <div className='text-lg font-bold'>Rnd</div>
        <ToggleGroup
          type='single'
          size='lg'
          variant='outline'
          defaultValue={competition.compDayInfo.round.toString()}
          onValueChange={(value) => {
            if (value === '') return
            setRound(value)
            updateLift({
              id: competition.id,
              uuid: competition.uuid || '',
              round: +value,
              lift: competition.compDayInfo.lift,
              bracket: competition.compDayInfo.bracket,
              index: competition.compDayInfo.index,
            })
          }}
        >
          <ToggleGroupItem value='1'>1</ToggleGroupItem>
          <ToggleGroupItem value='2'>2</ToggleGroupItem>
          <ToggleGroupItem value='3'>3</ToggleGroupItem>
          <ToggleGroupItem value='4'>4</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className='flex  items-center justify-around gap-2 rounded-md border border-input p-2'>
        <ToggleGroup
          type='single'
          size='lg'
          variant='outline'
          defaultValue={competition.compDayInfo.bracket.toString() || '1'}
          onValueChange={(value) => {
            if (value === '') return
            updateLift({
              id: competition.id,
              uuid: competition.uuid || '',
              round: competition.compDayInfo.round,
              lift: competition.compDayInfo.lift,
              bracket: +value,
              index: competition.compDayInfo.index,
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
      <Button
        className='h-12 w-12 rounded-full text-white'
        variant='outline'
        onClick={syncToCompetition}
      >
        Sync
      </Button>
      <Button
        className='h-12 w-12 rounded-full bg-blue-600/80 font-extrabold text-slate-900'
        variant='outline'
        onClick={() => {
          updateLift({
            id: competition.id,
            uuid: competition.uuid || '',
            round: competition.compDayInfo.round,
            lift: competition.compDayInfo.lift,
            bracket: competition.compDayInfo.bracket,
            index: competition.compDayInfo.index,
          })
        }}
      >
        Ping
      </Button>
    </div>
  )
}

export default MainScreenControl
