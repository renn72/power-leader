'use client'
import { useFormContext } from 'react-hook-form'
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

const WeighIn = () => {
    const { control } = useFormContext()
    return (
        <Card className='w-full'>
            <CardHeader className='mb-4'>
                <CardTitle>Weigh In</CardTitle>
            </CardHeader>
            <CardContent className=''>
                <FormField
                    control={control}
                    name='weight'
                    render={({ field }) => (
                        <FormItem className='w-full'>
                            <FormControl>
                                <Input
                                    className='font-medium text-2xl h-24 text-center'
                                    placeholder='Weight'
                                    type='number'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    )
}
export default WeighIn
