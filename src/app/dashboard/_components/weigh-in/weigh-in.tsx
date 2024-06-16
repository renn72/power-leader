'use client'
import { useState, useEffect } from 'react'
import { api } from '~/trpc/react'

import WeighInForm from './_components/form'
import Entry from './_components/entry'
import FakeUser from './_components/fake-user'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '~/components/ui/sheet'

const WeighIn = () => {
    const [compId, setCompId] = useState('')
    const [entryId, setEntryId] = useState<number | null>(null)

    const { data: competitions, isLoading: competitionsLoading } =
        api.competition.getMyCompetitions.useQuery()

    const competition = competitions?.find(
        (competition) => competition.id === +compId,
    )

    const entry = competition?.entries?.find(
        (entry) => entry.id === Number(entryId),
    )

    useEffect(() => {
        setCompId(competitions?.[0]?.id.toString() || '')
    }, [competitions])

    if (competitionsLoading) {
        return (
            <div className='flex flex-col items-center justify-center gap-2'>
                <div className='font-bold text-destructive'>Loading...</div>
            </div>
        )
    }

    return (
        <div className='flex flex-col gap-4'>
            <Select
                onValueChange={setCompId}
                defaultValue={compId}
            >
                <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder={competitions?.[0]?.name} />
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
            <Sheet>
                <div className='flex items-center gap-4'>
                    <h2 className='text-lg font-bold'>Weight In</h2>
                    {competition && <FakeUser competition={competition} />}
                </div>
                {competition && (
                    <div className='mx-4 flex flex-col gap-2'>
                        {competition.entries?.map((entry) => (
                            <Entry
                                entry={entry}
                                key={entry.id}
                                setEntryId={setEntryId}
                            />
                        ))}
                    </div>
                )}
                <SheetContent className='w-[400px] overflow-y-auto sm:w-[640px] sm:max-w-lg'>
                    <SheetHeader>
                        <SheetTitle>Weigh In</SheetTitle>
                    </SheetHeader>
                    <WeighInForm
                        entry={entry}
                        competition={competition}
                    />
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default WeighIn
