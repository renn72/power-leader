'use client'
import { useState } from 'react'
import { api } from '~/trpc/react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select'
import { getFormattedDate, getAge } from '~/lib/utils'
import { cn } from '~/lib/utils'

import type { GetCompetitionEntryById } from '~/lib/types'

const Cell = ({ title, info }: { title: string; info: string | number | null | undefined }) => {
    return (
        <div className='flex flex-col items-center gap-2'>
            <div className='text-sm text-muted-foreground'>{title}</div>
            <div className={cn('font-medium', info ? 'text-primary' : 'text-secondary')}>
                {info || '-'}
            </div>
        </div>
    )
}

const CellArray = ({ title, info }: { title: string; info: string[] | null | undefined }) => {
    if (!info) {
        return null
    }
    return (
        <div className='flex flex-col items-center gap-2'>
            <div className='text-sm text-muted-foreground'>{title}</div>
            <div className='flex flex-col gap-0 text-sm leading-none'>
                {info.map((item) => (
                    <div className={cn('font-medium', item ? 'text-primary' : 'text-secondary')} key={item}>
                        {item || '-'}
                    </div>
                ))}
            </div>
        </div>
    )
}

const Entry = ({ entry }: { entry: GetCompetitionEntryById }) => {
    return (
        <div className='grid grid-flow-row grid-cols-12 justify-between border border-input py-2 px-8 rounded-full hover:bg-input hover:bg-opacity-10 cursor-pointer'>
            <Cell
                title='Name'
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
                title='Equipment'
                info={entry?.equipment}
            />
            <CellArray
                title='Events'
                info={entry.events?.split('/')}
            />
            <CellArray
                title='Divisions'
                info={entry.compEntryToDivisions?.map((division) => division.division?.name || '')}
            />
            <Cell
                title='Weight'
                info={entry.weight}
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
        </div>
    )
}

const WeighIn = () => {
    const [compId, setCompId] = useState('')

    const { data: competitions } = api.competition.getMyCompetitions.useQuery()

    const competition = competitions?.find(
        (competition) => competition.id === +compId,
    )

    console.log(competition)

    return (
        <div className='flex flex-col gap-4'>
            <Select
                onValueChange={setCompId}
                defaultValue={compId}
            >
                <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Competitions' />
                </SelectTrigger>
                <SelectContent>
                    {competitions?.map((competition) => (
                        <SelectItem
                            key={competition.id}
                            value={competition.id.toString()}
                        >
                            {competition.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <h2>Weight In</h2>
            {competition && (
                <div className='flex flex-col gap-2 mx-4'>
                    {competition.entries?.map((entry) => (
                        <Entry
                            entry={entry}
                            key={entry.id}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default WeighIn
