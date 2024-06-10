import { useFormContext } from 'react-hook-form'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '~/components/ui/form'
import {
    Card,
    CardContent,
    CardTitle,
    CardHeader,
    CardDescription,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
const LiftInfo = () => {
    const form = useFormContext()
    return (
        <>
            <Card className='w-full sm:max-w-2xl'>
                <CardHeader>
                    <CardTitle>Lift Info</CardTitle>
                    <CardDescription>
                        You can edit this info later
                    </CardDescription>
                </CardHeader>
                <CardContent className='mt-2 flex flex-col gap-2 tracking-tight'>
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-xl'>Squat</CardTitle>
                            <CardDescription className='text-sm font-medium text-muted-foreground'>
                                in kg
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='grid grid-cols-3 gap-1'>
                            <FormField
                                control={form.control}
                                name='squatOpener'
                                render={({ field }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Opener</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder=''
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
                                        <FormLabel>Rack Height</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='eg. 12in or 4out'
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
                                                placeholder=''
                                                type='text'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-xl'>Bench</CardTitle>
                            <CardDescription className='text-sm font-medium text-muted-foreground'>
                                in kg
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='grid grid-cols-3 gap-1'>
                            <FormField
                                control={form.control}
                                name='benchOpener'
                                render={({ field }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Opener</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder=''
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
                                        <FormLabel>Rack Height</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='eg. 8/4 8=rack, 4=safety'
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
                                        <FormLabel>PB</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder=''
                                                type='text'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-xl'>Deadlift</CardTitle>
                            <CardDescription className='text-sm font-medium text-muted-foreground'>
                                in kg
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='grid grid-cols-3 gap-1'>
                            <FormField
                                control={form.control}
                                name='deadliftOpener'
                                render={({ field }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>Opener</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder=''
                                                type='text'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div></div>
                            <FormField
                                control={form.control}
                                name='deadliftPB'
                                render={({ field }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel>PB</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder=''
                                                type='text'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </>
    )
}
export default LiftInfo
