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
import { Card, CardContent, CardHeader } from '~/components/ui/card'

const Address = () => {
    const form= useFormContext()
    return (
        <Card className='w-full sm:max-w-2xl'>
            <CardHeader></CardHeader>
            <CardContent className='flex flex-col gap-2'>
              <FormField
                control={form.control}
                name='notes'
                render={({ field }) => (
                  <FormItem className='w-full flex gap-2 items-baseline'>
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
            </CardContent>
        </Card>
    )
}
export default Address
