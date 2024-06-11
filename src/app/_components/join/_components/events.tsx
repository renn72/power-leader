'use client'
import { useFormContext } from 'react-hook-form'
import {
    FormField,
    FormItem,
    FormControl,
    FormMessage,
} from '~/components/ui/form'
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group'
import {
    Card,
    CardContent,
    CardTitle,
    CardHeader,
} from '~/components/ui/card'
import type { GetCompetitionByUuid } from '~/lib/types'

const Events = ({
    competition,
}: {
    competition: GetCompetitionByUuid
}) => {
    const form = useFormContext()
    return (
        <Card className='w-full sm:max-w-2xl'>
            <CardHeader>
                <CardTitle>Events</CardTitle>
            </CardHeader>
            <CardContent className='mt-4 flex flex-col gap-2'>
                <FormField
                    control={form.control}
                    name='events'
                    rules={{ required: true }}
                    render={({ field }) => (
                        <FormItem>
                            <ToggleGroup
                                type='multiple'
                                defaultValue={[]}
                                onValueChange={(value) => {
                                    field.onChange(value)
                                }}
                            >
                                <div className='flex flex-wrap justify-around gap-2 px-6'>
                                    {competition.events
                                        ?.split('/')
                                        .map((item) => (
                                            <FormField
                                                key={item}
                                                control={form.control}
                                                name='events'
                                                render={() => {
                                                    return (
                                                        <FormItem key={item}>
                                                            <FormControl>
                                                                <ToggleGroupItem
                                                                    variant='secondary'
                                                                    className='rounded-md border border-input'
                                                                    value={item}
                                                                >
                                                                    {item}
                                                                </ToggleGroupItem>
                                                            </FormControl>
                                                        </FormItem>
                                                    )
                                                }}
                                            />
                                        ))}
                                </div>
                            </ToggleGroup>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    )
}
export default Events
