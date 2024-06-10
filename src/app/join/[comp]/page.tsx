'use client'

import { useUser } from '@clerk/nextjs'

import { api } from '~/trpc/react'

import { Skeleton } from '~/components/ui/skeleton'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray, FormProvider } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '~/components/ui/button'
import {
    Form,
} from '~/components/ui/form'

import WeightClass from './_components/weight-class'
import Equipment from './_components/equipment'
import Personal from './_components/personal'
import CompInfo from './_components/comp-info'
import Events from './_components/events'
import Divisions from './_components/divisions'
import LiftInfo from './_components/lift-info'
import Notes from './_components/notes'

export const dynamic = 'force-dynamic'

const formSchema = z.object({
    address: z.string(),
    phone: z.string(),
    instagram: z.string(),
    openlifter: z.string(),
    birthDate: z.date(),
    equipment: z.array(z.string()),
    gender: z.string(),
    predictedWeight: z.string(),
    weight: z.string(),
    events: z.string(),
    division: z.string(),
    squatOpener: z.string(),
    squarRackHeight: z.string(),
    benchOpener: z.string(),
    benchRackHeight: z.string(),
    deadliftOpener: z.string(),
    squatPB: z.string(),
    benchPB: z.string(),
    deadliftPB: z.string(),
    notes: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
})

const JoinCompPage = ({ params }: { params: { comp: string } }) => {
    const { comp } = params
    const hostName = window.location.origin
    const { isSignedIn, isLoaded } = useUser()

    const context = api.useUtils()

    const { data: competition, isLoading: competitionLoading } =
        api.competition.getCompetitionByUuid.useQuery(comp)

    const { data: user, isLoading: userLoading } =
        api.user.getCurrentUser.useQuery()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            address: user && user.address ? user.address : '',
            phone: user && user.phone ? user.phone : '',
            instagram: user && user.instagram ? user.instagram : '',
            openlifter: user && user.openlifter ? user.openlifter : '',
            birthDate: user && user.birthDate ? user.birthDate : undefined,
            equipment: [''],
            gender: '',
            predictedWeight: '',
            weight: '',
            events: '',
            division: '',
            squatOpener: '',
            squarRackHeight: '',
            benchOpener: '',
            benchRackHeight: '',
            deadliftOpener: '',
            squatPB: '',
            benchPB: '',
            deadliftPB: '',
            notes: '',
        },
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log('data', data)
    }

    if (!isLoaded) {
        return null
    }

    if (!isSignedIn) {
        return (
            <div className='flex w-full flex-col items-center justify-center gap-2'>
                <a
                    href={`https://welcomed-hound-18.accounts.dev/sign-up?redirect_url=${hostName}/join/${comp}`}
                >
                    <Button size='lg'>Sign up</Button>
                </a>
                <a
                    href={`https://welcomed-hound-18.accounts.dev/sign-in?redirect_url=${hostName}/join/${comp}`}
                >
                    <Button size='lg'>Sign in</Button>
                </a>
            </div>
        )
    }

    if (competitionLoading) {
        return <Skeleton className='h-[800px] w-[600px]' />
    }

    if (!competition) {
        return <div>Competition not found</div>
    }

    return (
        <>
            <div className='flex w-full grow flex-col items-center gap-4'>
                <CompInfo competition={competition} />
                <FormProvider {...form}>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='flex w-full max-w-2xl flex-col gap-2'
                        >
                            <Personal />
                            <WeightClass competition={competition} />
                            <Equipment competition={competition} />
                            <Events competition={competition} />
                            <Divisions competition={competition} />
                            <LiftInfo />
                            <Notes />
                            <Button
                                className='mt-4 w-min'
                                type='submit'
                                onClick={(e) => {
                                    e.preventDefault()
                                    console.log(form.getValues())
                                }}
                            >
                                Submit
                            </Button>
                        </form>
                    </Form>
                </FormProvider>
            </div>
        </>
    )
}

export default JoinCompPage
