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

const WeighIn = () => {
    const { data: competitions, isLoading: competitionsLoading } =
        api.competition.getMyCompetitions.useQuery()
    return (
        <div className='flex flex-col gap-4'>
            <Select>
                <SelectTrigger className='w-[180px]'>
                    <SelectValue placeholder='Theme' />
                </SelectTrigger>
                <SelectContent>
                    {competitions?.map((competition) => (
                        <SelectItem key={competition.id} value={competition.id.toString()}>
                            {competition.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            Weight Classes
        </div>
    )
}

export default WeighIn
