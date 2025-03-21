'use client'

import { useEffect, useState } from 'react'

import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import type { GetCompetitionById, GetCompetitionEntryById } from '~/lib/types'
import { cn } from '~/lib/utils'
import { api } from '~/trpc/react'
import { ChevronLeftCircle, ChevronRightCircle } from 'lucide-react'
import { toast } from 'sonner'
import { sortEntriesFilter } from '~/lib/comp-day'

const Bracket = ({
  entries,
  competition,
  lift,
  title,
  bracket,
  isAdmin,
}: {
  entries: GetCompetitionEntryById[]
  competition: GetCompetitionById
  lift: string
  title: string
  bracket: number
  isAdmin: boolean
}) => {

  const [entryList, setEntryList] = useState<GetCompetitionEntryById[]>(
    () => entries,
  )

  useEffect(() => {
    if (lift === 'squat') {
      setEntryList(
        entries
          .filter((entry) => entry.squatBracket == bracket)
          .sort((a, b) => {
            if (Number(a.squatOpener) === 0 && a.squatOpener !== '0') return 1
            if (Number(b.squatOpener) === 0 && b.squatOpener !== '0') return -1
            return Number(a.squatOpener) - Number(b.squatOpener)
          }),
      )
    }
    if (lift === 'bench') {
      setEntryList(
        entries
          .filter((entry) => entry.benchBracket == bracket)
          .sort((a, b) => {
            if (Number(a.benchOpener) === 0 && a.benchOpener !== '0') return 1
            if (Number(b.benchOpener) === 0 && b.benchOpener !== '0') return -1
            return Number(a.benchOpener) - Number(b.benchOpener)
          }),
      )
    }
    if (lift === 'deadlift') {
      setEntryList(
        entries
          .filter((entry) => entry.deadliftBracket == bracket)
          .sort((a, b) => {
            if (Number(a.deadliftOpener) === 0 && a.deadliftOpener !== '0')
              return 1
            if (Number(b.deadliftOpener) === 0 && b.deadliftOpener !== '0')
              return -1
            return Number(a.deadliftOpener) - Number(b.deadliftOpener)
          }),
      )
    }
  }, [entries])

  const round = competition.compDayInfo.round.toString()
  const index = competition.compDayInfo.index.toString()

  const currentBracket = competition.compDayInfo.bracket.toString()
  const currentLift = competition.compDayInfo.lift

  const lifters = sortEntriesFilter(competition.entries, lift, bracket.toString(), round)

  const lifter = lifters.find((l, i) => {
      return i== Number(index)
  })



  return (
    <Card className='relative min-w-[360px] max-w-[600px] shadow-md'>
      <CardHeader className='mb-1 pb-0'>
        <CardTitle className='flex items-center flex-col justify-around lg:text-3xl'>
          <div className='capitalize'>{title}</div>
          <div className='text-base font-medium'>Flight {bracket}</div>
        </CardTitle>
        <CardDescription className=''></CardDescription>
      </CardHeader>
      <CardContent className='px-2'>
        <div className='flex flex-col gap-1'>
          {entryList.map((entry, i) => {
            const opener =
              lift === 'squat'
                ? entry.squatOpener
                : lift === 'bench'
                  ? entry.benchOpener
                  : entry.deadliftOpener
            return (
              <div
                key={entry.id}
                data-label={entry.id}
                className={cn('flex items-center gap-1')}
              >
                <div
                  className={cn(
                    'grid grid-cols-10 place-items-center gap-1 border border-input text-base tracking-tighter lg:tracking-tight w-full',
                    'rounded-full px-[1px] py-[2px] text-xs sm:text-sm ',
                    entry.id === lifter?.id && currentLift === lift && currentBracket == bracket.toString() ? 'border-yellow-500 bg-black' : '',
                  )}
                >
                  <div className='font-extrabold tracking-wider text-muted-foreground'>
                    {i + 1}
                  </div>
                  <Badge className='flex text-[0.60rem] lg:text-xs py-0 lg:py-0.5 w-8 tracking-tighter lg:w-12 items-center justify-center'>
                    {entry.wc?.split('-')[0]}kg
                  </Badge>
                  <div
                    className={cn(
                      'font-extrabold ',
                      entry.gender?.toLowerCase() === 'female'
                        ? 'text-pink-400'
                        : 'text-teal-400',
                    )}
                  >
                    {entry.gender?.toLowerCase() === 'female' ? 'F' : 'M'}
                  </div>
                  <div
                    className={cn(
                      'font-extrabold ',
                      entry.compEntryToDivisions?.[0]?.division?.name.toLowerCase() ===
                        'open'
                        ? 'text-slate-400'
                        : entry.compEntryToDivisions?.[0]?.division?.name.toLowerCase() ===
                            'pro'
                          ? 'text-red-500'
                          : 'text-green-600',
                    )}
                  >
                    {entry.compEntryToDivisions?.[0]?.division?.name
                      .slice(0, 1)
                      .toUpperCase()}
                  </div>
                  <div
                    className={cn(
                      'font-extrabold ',
                      entry.equipment?.toLowerCase() === 'classic'
                        ? 'text-orange-400'
                        : entry.equipment?.toLowerCase() === 'raw'
                          ? 'text-indigo-400'
                          : 'text-emerald-500',
                    )}
                  >
                    {entry.equipment?.slice(0, 1).toUpperCase()}
                  </div>
                  <div className='col-span-3 tracking-tighter truncate capitalize overflow-hidden'>
                    {entry.user?.name && entry.user?.name.length > 18
                      ? entry.user?.name.slice(0, 15) + '...'
                      : entry.user?.name}
                  </div>
                  <div className='col-span-2'>
                    {opener === '' || opener === null ? '-' : opener + 'kg'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default Bracket
