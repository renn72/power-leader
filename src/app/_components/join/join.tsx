'use client'

import { api } from '~/trpc/react'

import { Skeleton } from '~/components/ui/skeleton'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray, FormProvider } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { toast } from 'sonner'

import WeightClass from './_components/weight-class'
import Equipment from './_components/equipment'
import Personal from './_components/personal'
import CompInfo from './_components/comp-info'
import Events from './_components/events'
import Divisions from './_components/divisions'
import LiftInfo from './_components/lift-info'
import Notes from './_components/notes'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

const formSchema = z.object({
    address: z.string(),
    phone: z.string(),
    instagram: z.string(),
    openlifter: z.string(),
    birthDate: z.date(),
    equipment: z.string(),
    gender: z.string(),
    predictedWeight: z.string(),
    events: z.array(z.string()),
    division: z.array(z.string()),
    squatOpener: z.string(),
    squarRackHeight: z.string(),
    benchOpener: z.string(),
    benchRackHeight: z.string(),
    deadliftOpener: z.string(),
    squatPB: z.string(),
    benchPB: z.string(),
    deadliftPB: z.string(),
    notes: z.string(),
})

const JoinCompForm = ({ comp }: { comp: string }) => {
    const [isPending, setIsPending] = useState(false)
    const [submitText, setSubmitText] = useState('Submit')

    const router = useRouter()

    const { data: competition, isLoading: competitionLoading } =
        api.competition.getCompetitionByUuid.useQuery(comp)

    const { data: user, isLoading: userLoading } =
        api.user.getCurrentUser.useQuery()

    const { mutate: createComp } = api.compEntry.create.useMutation({
        onMutate: () => {
            setIsPending(true)
            setSubmitText('Entering...')
        },
        onSettled: async () => {
            setIsPending(false)
        },
        onError: (err) => {
            console.log(err)
            toast('Error')
        },
        onSuccess: () => {
            setSubmitText('Entered')
            setTimeout(() => {
                router.push('/dashboard?tab=upcoming')
            }, 500)

            form.reset()
        },
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            address: user && user.address ? user.address : '',
            phone: user && user.phone ? user.phone : '',
            instagram: user && user.instagram ? user.instagram : '',
            openlifter: user && user.openlifter ? user.openlifter : '',
            birthDate: user && user.birthDate ? user.birthDate : undefined,
            equipment: '',
            gender: '',
            predictedWeight: '',
            events: [],
            division: [],
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
        if (!competition || !competition.id) {
            return
        }

        const formData = {
            ...data,
            equipment: data.equipment === '' ? (competition.equipment?.split('/')[0] || 'nil') : data.equipment,
            events: data.events.join('/'),
            compId: competition.id,
        }
        console.log('formData', formData)
        createComp(formData)
    }

    if (competitionLoading) {
        return <Skeleton className='h-[800px] w-[600px]' />
    }

    if (!competition) {
        return <div>Competition not found</div>
    }

    return (
        <>
            <div className='flex w-full flex-col items-center gap-4'>
                <CompInfo competition={competition} />
                <FormProvider {...form}>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='flex w-full max-w-2xl flex-col items-center gap-2'
                        >
                            <Personal />
                            <WeightClass competition={competition} />
                            <Equipment competition={competition} />
                            <Events competition={competition} />
                            <Divisions competition={competition} />
                            <LiftInfo />
                            <Notes />
                            <Button
                                className='mt-4 w-min min-w-[170px]'
                                type='submit'
                            >
                                {isPending && (
                                    <div className='mr-3 animate-spin'>
                                        <div className='h-4 w-4 rounded-full border-b-2 border-t-2 border-border' />
                                    </div>
                                )}
                                {submitText}
                            </Button>
                        </form>
                    </Form>
                </FormProvider>
            </div>
        </>
    )
}

export default JoinCompForm
