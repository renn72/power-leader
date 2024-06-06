'use client'
import { useState } from 'react'
import { api } from '~/trpc/react'
import Link from 'next/link'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '~/components/ui/table'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '~/components/ui/hover-card'
import Create from './_components/create'
import Competitions from './_components/competions'
import List from './_components/list'

export const dynamic = 'force-dynamic'

export default function Dashboard() {
    const [isOpenClosing, setIsOpenClosing] = useState(false)
    const [open, setOpen] = useState('Open')
    const [close, setClose] = useState('Close')

    const { data: competitions, isLoading: competitionsLoading } =
        api.competition.getMyCompetitions.useQuery()

    const { data: allCompetitions, isLoading: allCompetitionsLoading } =
        api.competition.getAll.useQuery()

    const ctx = api.useUtils()

    const { mutate: openCompetition } =
        api.competition.openCompetition.useMutation({
            onMutate: () => {
                setIsOpenClosing(true)
                setOpen('Opening...')
            },
            onSettled: async () => {
                await ctx.competition.getMyCompetitions.refetch()
                setIsOpenClosing(false)
                setOpen('Open')
            },
        })

    const { mutate: closeCompetition } =
        api.competition.closeCompetition.useMutation({
            onMutate: () => {
                setIsOpenClosing(true)
                setClose('Closing...')
            },
            onSettled: async () => {
                await ctx.competition.getMyCompetitions.refetch()
                setIsOpenClosing(false)
                setClose('Close')
            },
        })

    return (
        <section className='mt-8 flex h-full grow flex-col'>
            <Tabs
                defaultValue='competition'
                orientation='vertical'
                className='flex h-full grow  flex-col space-x-2 lg:flex-row'
            >
                <div className='lg:min-h-[calc(100vh - 10rem)] rounded-md bg-muted p-2'>
                    <TabsList className='flex h-full w-36 justify-start gap-6 space-x-2 lg:flex-col'>
                        <TabsTrigger
                            value='join'
                            className='w-28'
                        >
                            Join
                        </TabsTrigger>
                        <TabsTrigger
                            value='competition'
                            className='w-28'
                        >
                            Competition
                        </TabsTrigger>
                        <TabsTrigger
                            value='create'
                            className='w-28'
                        >
                            Create
                        </TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent
                    className='min-h-[calc(100vh - 10rem)] w-full'
                    value='join'
                >
                    <List />
                </TabsContent>

                <TabsContent
                    className='min-h-[calc(100vh - 10rem)] w-full'
                    value='competition'
                >
                    <Competitions />
                </TabsContent>
                <TabsContent
                    className='min-h-[calc(100vh - 10rem)] w-full'
                    value='create'
                >
                    <Create />
                </TabsContent>
            </Tabs>
        </section>
    )
}
