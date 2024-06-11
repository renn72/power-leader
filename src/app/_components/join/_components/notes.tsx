'use client'
import { useFormContext } from 'react-hook-form'
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '~/components/ui/form'
import { Textarea } from '~/components/ui/textarea'
import {
    Card,
    CardContent,
    CardHeader,
} from '~/components/ui/card'

const Address = () => {
    const { control } = useFormContext()
    return (
        <Card className='w-full sm:max-w-2xl'>
            <CardHeader></CardHeader>
            <CardContent className='flex flex-col gap-2'>
                <div className='flex w-full items-end justify-between gap-4'>
                    <FormField
                        control={control}
                        name='notes'
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Notes</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder=''
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
export default Address
