'use client'
import { useState, useEffect } from 'react'
import { api } from '~/trpc/react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Icons } from '~/components/ui/icons'

import Competition from './_components/competition'

const CompDay = () => {
    const [compId, setCompId] = useState('')
    const [entryId, setEntryId] = useState<number | null>(null)

    const { data: competitions, isLoading: competitionsLoading } =
        api.competition.getMyCompetitions.useQuery()

    const competition = competitions?.find(
        (competition) => competition.id === +compId,
    )

    useEffect(() => {
        setCompId(competitions?.[0]?.id.toString() || '')
    }, [competitions])

    if (competitionsLoading) {
        return (
            <div className='flex flex-col w-full h-full min-h-[calc(100vh-10rem)] items-center justify-center animate-spin'>
                <Icons.spinner className='h-40 w-40' />
            </div>
        )
    }

    return (
        <div className='flex flex-col gap-4 p-4'>
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
            {competition?.currentState === 'open' ? (
                <Alert
                    variant='destructive'
                    className='w-[200px]'
                >
                    <AlertTitle>Heads up!</AlertTitle>
                    <AlertDescription>comp is still open</AlertDescription>
                </Alert>
            ) : (
                <>
                    {competition && (
                        <Competition competitionId={competition.id} competitonUuid={competition.uuid || ''} />
                    )}
                </>
            )}
        </div>
    )
}

export default CompDay
