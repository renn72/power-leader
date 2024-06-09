'use client'

import { useUser } from '@clerk/nextjs'

import { api } from '~/trpc/react'

import { Skeleton } from '~/components/ui/skeleton'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray, FormProvider } from 'react-hook-form'
import { z } from 'zod'

import Address from './_components/address'

import { cn, getFormattedDate } from '~/lib/utils'

import { toast } from 'sonner'
import {
    Card,
    CardContent,
    CardTitle,
    CardDescription,
    CardFooter,
    CardHeader,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '~/components/ui/form'
import { Textarea } from '~/components/ui/textarea'

import Phone from './_components/phone'
import BirthDate from './_components/birth-date'
import Gender from './_components/gender'
import Instagram from './_components/instagram'
import Openlifter from './_components/openlifter'
import WeightClass from './_components/weight-class'
import Equipment from './_components/equipment'

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
        return <Skeleton className='h-[200px] w-[600px]' />
    }

    if (!competition) {
        return <div>Competition not found</div>
    }

    return (
        <>
            <div className='flex w-full grow flex-col items-center gap-4'>
                <Card className='w-full sm:max-w-2xl'>
                    <CardHeader>
                        <CardTitle>{competition?.name}</CardTitle>
                        <CardDescription className='flex flex-col gap-1'>
                            <div>
                                {competition.date
                                    ? getFormattedDate(competition.date)
                                    : ''}
                            </div>
                            <div>
                                {competition.venue
                                    ? competition.venue + ','
                                    : ''}
                            </div>
                            <div className='flex items-center gap-1 text-xs'>
                                <div>
                                    {competition.city
                                        ? competition.city + ','
                                        : ''}
                                </div>
                                <div>
                                    {competition.state
                                        ? competition.state + ','
                                        : ''}
                                </div>
                            </div>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='flex flex-col gap-2'></CardContent>
                </Card>
                <FormProvider {...form}>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='flex w-full max-w-2xl flex-col gap-2'
                        >
                            <Card>
                                <CardHeader></CardHeader>
                                <CardContent className='flex flex-col gap-2'>
                                    <Address />
                                    <div className='flex w-full items-end justify-between gap-4'>
                                        <Phone />
                                        <BirthDate />
                                    </div>
                                    <div className='flex w-full items-end justify-between gap-4'>
                                        <Gender />
                                        <Instagram />
                                    </div>
                                    <Openlifter />
                                </CardContent>
                            </Card>
                            <WeightClass competition={competition} />
                            <Equipment competition={competition} />
                            <FormField
                                control={form.control}
                                name='events'
                                render={({ field }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Events</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='events'
                                                type='text'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='division'
                                render={({ field }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Division</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='division'
                                                type='text'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='squatOpener'
                                render={({ field }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Squat Opener</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='squatOpener'
                                                type='text'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='squarRackHeight'
                                render={({ field }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Squar Rack Height</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='squarRackHeight'
                                                type='text'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='benchOpener'
                                render={({ field }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Bench Opener</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='benchOpener'
                                                type='text'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='benchRackHeight'
                                render={({ field }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Bench Rack Height</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='benchRackHeight'
                                                type='text'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='deadliftOpener'
                                render={({ field }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Deadlift Opener</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='deadliftOpener'
                                                type='text'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='squatPB'
                                render={({ field }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Squat PB</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='squatPB'
                                                type='text'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='benchPB'
                                render={({ field }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Bench PB</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='benchPB'
                                                type='text'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='deadliftPB'
                                render={({ field }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Deadlift PB</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='deadliftPB'
                                                type='text'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='notes'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Notes</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder='notes'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
