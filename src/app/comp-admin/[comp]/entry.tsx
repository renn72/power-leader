'use client'

import { getAge } from '~/lib/utils'
import { cn } from '~/lib/utils'

import type { GetCompetitionEntryById } from '~/lib/types'
import { CircleCheck, CircleDot, TicketCheck } from 'lucide-react'
import { Badge } from '~/components/ui/badge'

const Cell = ({
  title,
  info,
  className,
}: {
  title: string
  info: string | number | null | undefined
  className?: string
}) => {
  return (
    <div className={cn('flex flex-col items-center gap-0', className)}>
      <div className='text-xs text-muted-foreground'>{title}</div>
      <div
        className={cn(
          'text-center text-lg font-medium',
          info ? 'text-primary' : 'text-secondary',
          title === 'Weight' && 'text-xl',
        )}
      >
        {info || '-'}
      </div>
    </div>
  )
}
const CellBadge = ({
  title,
  info,
  className,
}: {
  title: string
  info: string | number | null | undefined
  className?: string
}) => {
  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <div className='text-xs text-muted-foreground'>{title}</div>
      {info && (
        <Badge className='flex w-16 items-center justify-center'>
          {info}kg
        </Badge>
      )}
    </div>
  )
}

const CellArray = ({
  title,
  info,
  className,
}: {
  title: string
  info: string[] | null | undefined
  className?: string
}) => {
  if (!info) {
    return null
  }
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-between gap-2',
        className,
      )}
    >
      <div className='text-sm text-muted-foreground'>{title}</div>
      <div className='flex flex-wrap items-center justify-center gap-1 text-sm leading-none'>
        {info.map((item, i) => (
          <div
            className={cn(
              'flex items-center gap-1 font-medium tracking-tight',
              item ? 'text-primary' : 'text-secondary',
            )}
            key={item}
          >
            {item || '-'}
            {i !== info.length - 1 && (
              <CircleDot
                size={6}
                className='bg-muted'
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const Entry = ({ entry }: { entry: GetCompetitionEntryById }) => {
  return (
    <div
      className={cn(
        'grid-cols-11 grid cursor-pointer grid-flow-row justify-between rounded-full',
        'relative border border-input px-8 py-2 hover:bg-input hover:bg-opacity-10',
      )}
    >
      {entry.isLocked && (
        <CircleCheck
          size={24}
          strokeWidth={3}
          className='absolute left-6 top-1/2 -translate-y-1/2 text-complete '
        />
      )}
      <Cell
        title='Name'
        className='col-span-2'
        info={entry.user?.name}
      />
      <Cell
        title='Gender'
        info={entry?.gender}
      />
      <Cell
        title='Age'
        info={getAge(entry.birthDate, entry.competition?.date)}
      />
      <CellArray
        title='Events'
        className='col-span-4'
        info={entry.events?.map((event) => event.event?.name || '')}
      />
      <CellArray
        title='Divisions'
        className='col-span-3'
        info={entry.compEntryToDivisions?.map(
          (division) => division.division?.name || '',
        )}
      />
    </div>
  )
}

export default Entry
