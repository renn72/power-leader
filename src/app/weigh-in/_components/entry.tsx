'use client'
import { SheetTrigger } from '~/components/ui/sheet'

import { getAge } from '~/lib/utils'
import { cn } from '~/lib/utils'

import type { GetCompetitionEntryById } from '~/lib/types'
import { CircleCheck, CircleDot, TicketCheck } from 'lucide-react'

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

const Entry = ({
    entry,
    setEntryId,
}: {
    entry: GetCompetitionEntryById
    setEntryId: (id: number) => void
}) => {
    return (
        <SheetTrigger asChild>
            <div
                onClick={() => setEntryId(entry.id)}
                className={cn(
                    'grid-cols-15 grid cursor-pointer grid-flow-row justify-between rounded-full',
                    'border border-input px-8 py-2 hover:bg-input hover:bg-opacity-10 relative',
                )}
            >
                <CircleCheck
                    size={24}
                    strokeWidth={3}
                    className='text-complete absolute top-1/2 left-6 -translate-y-1/2 '
                />
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
                <Cell
                    title='Weight'
                    info={entry.weight}
                />
                <Cell
                    title='WC'
                    info={entry.wc}
                />
                <Cell
                    title='Squat'
                    info={entry.squatOpener}
                />
                <Cell
                    title='Squat Rack'
                    info={entry.squarRackHeight}
                />
                <Cell
                    title='Bench'
                    info={entry.benchOpener}
                />
                <Cell
                    title='Bench Rack'
                    info={entry.benchRackHeight}
                />
                <Cell
                    title='Deadlift'
                    info={entry.deadliftOpener}
                />
                <CellArray
                    title='Events'
                    className='col-span-2'
                    info={entry.events?.split('/')}
                />
                <CellArray
                    title='Divisions'
                    className='col-span-2'
                    info={entry.compEntryToDivisions?.map(
                        (division) => division.division?.name || '',
                    )}
                />
            </div>
        </SheetTrigger>
    )
}

export default Entry
