'use client'
import { useState } from 'react'
import { api } from '~/trpc/react'

import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import {
    TableCell,
    TableRow,
} from '~/components/ui/table'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '~/components/ui/hover-card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTrigger,
} from '~/components/ui/dialog'
import { XIcon } from 'lucide-react'

import type { GetCompetitionById } from '~/lib/types'

export const dynamic = 'force-dynamic'

const Competition = ({ competition } : { competition: GetCompetitionById }) => {
    const [isOpenClosing, setIsOpenClosing] = useState(false)
    const [open, setOpen] = useState('Open')
    const [close, setClose] = useState('Close')
    const [openDelete, setOpenDelete] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteText, setDeleteText] = useState('Delete')
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
                setDeleteText('Closing...')
            },
            onSettled: async () => {
                await ctx.competition.getMyCompetitions.refetch()
                setIsOpenClosing(false)
                setClose('Close')
            },
        })
    const { mutate: deleteCompetition } =
        api.competition.deleteCompetition.useMutation({
            onMutate: () => {
                setDeleteText('Deleting...')
                setIsDeleting(true)
            },
            onSettled: async () => {
                await ctx.competition.getMyCompetitions.refetch()
                setOpenDelete(false)
                setIsDeleting(false)
                setDeleteText('Deleted')
            },
        })
    return (
        <>
            <TableRow key={competition.id}>
                <TableCell>{competition.name}</TableCell>
                <TableCell>{competition.venue}</TableCell>
                <TableCell>{competition.federation}</TableCell>
                <TableCell>{competition.city}</TableCell>
                <TableCell>{competition.state}</TableCell>
                <TableCell>{competition.country}</TableCell>
                <TableCell>
                    {new Date(competition.date || '').toLocaleDateString()}
                </TableCell>
                <TableCell>{competition.daysOfCompetition}</TableCell>
                <TableCell>{competition.platforms}</TableCell>
                <TableCell>{competition.rules}</TableCell>
                <TableCell>
                    {competition.events?.split('/').map((event) => (
                        <div
                            key={event}
                            className='text-nowrap'
                        >
                            {event}
                        </div>
                    ))}
                </TableCell>
                <TableCell>
                    {competition.equipment?.split('/').map((event) => (
                        <div
                            key={event}
                            className='text-nowrap'
                        >
                            {event}
                        </div>
                    ))}
                </TableCell>
                <TableCell>{competition.formular}</TableCell>
                <TableCell>
                    <HoverCard>
                        <HoverCardTrigger>
                            <div className='flex gap-1'>
                                {competition.wc_male
                                    ?.split('/')
                                    .slice(0, 3)
                                    .map((event) => (
                                        <div
                                            key={event}
                                            className='text-nowrap'
                                        >
                                            {event}
                                            kg
                                        </div>
                                    ))}
                                {competition.wc_male &&
                                    competition.wc_male?.split('/')?.length >
                                        3 && (
                                        <div className='text-nowrap'>...</div>
                                    )}
                            </div>
                        </HoverCardTrigger>
                        <HoverCardContent>
                            <div className='grid grid-cols-4 gap-1'>
                                {competition.wc_male
                                    ?.split('/')
                                    .map((event) => (
                                        <div
                                            key={event}
                                            className='text-nowrap'
                                        >
                                            {event}
                                            kg
                                        </div>
                                    ))}
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                </TableCell>
                <TableCell>
                    <HoverCard>
                        <HoverCardTrigger>
                            <div className='flex gap-1'>
                                {competition.wc_female
                                    ?.split('/')
                                    .slice(0, 3)
                                    .map((event) => (
                                        <div
                                            key={event}
                                            className='text-nowrap'
                                        >
                                            {event}
                                            kg
                                        </div>
                                    ))}
                                {competition.wc_female &&
                                    competition.wc_female?.split('/')?.length >
                                        3 && (
                                        <div className='text-nowrap'>...</div>
                                    )}
                            </div>
                        </HoverCardTrigger>
                        <HoverCardContent>
                            <div className='grid grid-cols-4 gap-1'>
                                {competition.wc_female
                                    ?.split('/')
                                    .map((event) => (
                                        <div
                                            key={event}
                                            className='text-nowrap'
                                        >
                                            {event}
                                            kg
                                        </div>
                                    ))}
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                </TableCell>
                <TableCell>
                    <HoverCard>
                        <HoverCardTrigger>
                            <div className='flex gap-1'>
                                {competition.wc_mix
                                    ?.split('/')
                                    .slice(0, 3)
                                    .map((event) => (
                                        <div
                                            key={event}
                                            className='text-nowrap'
                                        >
                                            {event}
                                            kg
                                        </div>
                                    ))}
                                {competition.wc_mix &&
                                    competition.wc_mix?.split('/')?.length >
                                        3 && (
                                        <div className='text-nowrap'>...</div>
                                    )}
                            </div>
                        </HoverCardTrigger>
                        <HoverCardContent>
                            <div className='grid grid-cols-4 gap-1'>
                                {competition.wc_mix?.split('/').map((event) => (
                                    <div
                                        key={event}
                                        className='text-nowrap'
                                    >
                                        {event}
                                        kg
                                    </div>
                                ))}
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                </TableCell>
                <TableCell>
                    <HoverCard>
                        <HoverCardTrigger>
                            <div className='flex flex-col gap-1'>
                                {competition.divisions
                                    ?.slice(0, 3)
                                    .map((division) => (
                                        <div
                                            key={division.id}
                                            className='text-nowrap'
                                        >
                                            {division.name}
                                        </div>
                                    ))}
                                {competition.divisions?.length > 3 && (
                                    <div className='text-nowrap'>...</div>
                                )}
                            </div>
                        </HoverCardTrigger>
                        <HoverCardContent>
                            <div className='flex flex-col gap-1'>
                                <div className='grid grid-cols-6 gap-1'>
                                    <div className='col-span-2'>Name</div>
                                    <div>Min</div>
                                    <div>Max</div>
                                    <div className='col-span-2'>Info</div>
                                </div>
                                {competition.divisions.map((division, i) => (
                                    <div
                                        key={division.id}
                                        className='grid grid-cols-6 gap-1'
                                    >
                                        {i !== 0 && (
                                            <Separator className='col-span-6' />
                                        )}
                                        <div className='col-span-2'>
                                            {division.name}
                                        </div>
                                        <div>{division.minAge || '-'}</div>
                                        <div>{division.maxAge || '-'}</div>
                                        <div className='col-span-2'>
                                            {division.info}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                </TableCell>
                <TableCell>{competition.notes}</TableCell>
                <TableCell>
                    {(competition.currentState === '' ||
                        competition.currentState === null ||
                        competition.currentState === 'closed') && (
                        <div className='flex flex-col items-center gap-2'>
                            <div className='font-bold text-destructive'>
                                Closed
                            </div>
                            <Button
                                variant='outline_card'
                                className='min-w-[130px]'
                                onClick={() => {
                                    openCompetition(competition.id)
                                }}
                            >
                                {isOpenClosing && (
                                    <div className='mr-3 animate-spin'>
                                        <div className='h-4 w-4 rounded-full border-b-2 border-t-2 border-border' />
                                    </div>
                                )}
                                {open}
                            </Button>
                        </div>
                    )}
                    {competition.currentState === 'open' && (
                        <div className='flex flex-col items-center gap-2'>
                            <div className='font-bold text-secondary'>Open</div>
                            <Button
                                variant='outline_card'
                                className='min-w-[130px]'
                                onClick={() => {
                                    closeCompetition(competition.id)
                                }}
                            >
                                {isOpenClosing && (
                                    <div className='mr-3 animate-spin'>
                                        <div className='h-4 w-4 rounded-full border-b-2 border-t-2 border-border' />
                                    </div>
                                )}
                                {close}
                            </Button>
                        </div>
                    )}
                </TableCell>
                <TableCell>
                    <Dialog
                        open={openDelete}
                        onOpenChange={setOpenDelete}
                    >
                        <DialogTrigger asChild>
                            <XIcon
                                size={32}
                                className='text-destructive hover:text-destructive/50'
                            />
                        </DialogTrigger>
                        <DialogContent className='flex flex-col gap-8 p-4'>
                            <DialogHeader>
                                Delete Competition
                                <DialogDescription>
                                    Are you sure you want to delete this
                                    competition?
                                </DialogDescription>
                            </DialogHeader>
                            <Button
                                variant='destructive'
                                className='mx-auto w-48'
                                onClick={(e) => {
                                    e.preventDefault()
                                    deleteCompetition(competition.id)
                                }}
                            >
                                {isDeleting && (
                                    <div className='mr-3 animate-spin'>
                                        <div className='h-4 w-4 rounded-full border-b-2 border-t-2 border-border' />
                                    </div>
                                )}
                                {deleteText}
                            </Button>
                        </DialogContent>
                    </Dialog>
                </TableCell>
            </TableRow>
        </>
    )
}

export default Competition
