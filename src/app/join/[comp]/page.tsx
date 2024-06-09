'use client'

import { useUser } from '@clerk/nextjs'

import { api } from '~/trpc/react'

import { Skeleton } from '~/components/ui/skeleton'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'

import { CalendarIcon, PlusCircle, XCircle } from 'lucide-react'
import { cn } from '~/lib/utils'
import { Calendar } from '~/components/ui/calendar'

import { format } from 'date-fns'
import { toast } from 'sonner'
import { Card, CardContent, CardTitle, CardDescription, CardFooter, CardHeader } from '~/components/ui/card'
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '~/components/ui/popover'
import { Textarea } from '~/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTrigger,
    DialogClose,
} from '~/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select'

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

    console.log(user)
    console.log(competition)

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
        if (!user || !user?.id) {
            return
        }
        console.log(data)
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
            <div className='grow'>
                <h1>Join</h1>
                <Card className='w-full sm:w-96'>
                    <CardHeader>
                        <CardTitle>{competition?.name}</CardTitle>
                        <CardDescription>{competition?.venue}{competition?.city}</CardDescription>
                    </CardHeader>
                    <CardContent className='flex flex-col gap-2'>
                    </CardContent>
                </Card>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='flex w-full max-w-2xl flex-col gap-2'
                    >
                        <FormField
                            control={form.control}
                            name='address'
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='address'
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
                            name='phone'
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='phone'
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
                            name='instagram'
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Instagram</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='instagram'
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
                            name='openlifter'
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Openlifter</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='openlifter'
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
                            name='birthDate'
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Birth Date</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='birthDate'
                                            type='date'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='equipment'
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Equipment</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='equipment'
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
                            name='gender'
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Gender</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='gender'
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
                            name='predictedWeight'
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Predicted Weight</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='predictedWeight'
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
                            name='weight'
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Weight</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='weight'
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
                    </form>
                </Form>
            </div>
        </>
    )
}

export default JoinCompPage
