'use client'

import { useEffect, useState } from 'react'

import { sortEntriesFilter, liftState } from '~/lib/comp-day'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Switch } from '~/components/ui/switch'
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group-bold'
import { api } from '~/trpc/react'
import { toast } from 'sonner'

import { GetCompetitionByUuid } from '~/lib/types'

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
  competition: GetCompetitionByUuid
  lift: string
  bracket: string
  round: string
  index: string
  setLift: (lift: string) => void
  setBracket: (bracket: string) => void
  setRound: (round: string) => void
  syncToCompetition: () => void
}) => {
  const [isAuto, setIsAuto] = useState(false)
  const [isTicking, setIsTicking] = useState(false)
  const ctx = api.useUtils()
  const { mutate: updateLift } = api.competitionDay.updateLift.useMutation({
    onSettled: () => {
      ctx.competition.get.refetch()
    },
    onSuccess: (e) => {
      toast(JSON.stringify(e))
    },
  })

  console.log({competition, lift, bracket, round, index})

  useEffect(() => {
    const entries = sortEntriesFilter(competition.entries, lift, bracket, round)
    const curentEntry = entries.find((e, i) => i === Number(index))
    console.log('curentEntry', curentEntry)

    const curentEntryLift = curentEntry?.lift.find(
      (l) => l.lift === competition.compDayInfo.lift && l.liftNumber === Number(round),
    )
    console.log('curentEntryLift', curentEntryLift)

    if (!curentEntryLift) return

    const { isJudged, isGood } = liftState(curentEntryLift)
    console.log('isJudged', isJudged)
    console.log('isGood', isGood)

    if (isJudged && !isTicking && Number(index) < entries.length && isAuto) {
      setIsTicking(true)
      setTimeout(() => {
        console.log('tick')
        setIsTicking(false)

        updateLift({
          id: competition.id,
          uuid: competition.uuid || '',
          round: competition.compDayInfo.round,
          lift: competition.compDayInfo.lift,
          bracket: competition.compDayInfo.bracket,
          index: Number(index) + 1,
        })

      }, 5000)
    } else {
      console.log('not tick')
    }



  }, [isAuto, competition, index, round, bracket, lift])

  const brackets =
    lift === 'squat'
      ? Number(competition.squatBrackets)
      : lift === 'bench'
        ? Number(competition.benchPressBrackets)
        : Number(competition.deadliftBrackets)

  return (
    <div className='flex flex-row items-center gap-2 col-span-3'>
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
      <div className='flex justify-around gap-2 mx-auto'>
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
        <div className='flex flex-col items-center'>
          <Label className='text-sm'>Auto</Label>
          <Switch
            checked={isAuto}
            onCheckedChange={(value) => {
              setIsAuto(value)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default MainScreenControl
