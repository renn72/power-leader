'use client'
import { useFormContext } from 'react-hook-form'
import {
    FormField,
    FormItem,
    FormControl,
    FormMessage,
} from '~/components/ui/form'
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group'
import { Card, CardContent, CardTitle, CardHeader } from '~/components/ui/card'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '~/components/ui/hover-card'
import type { GetCompetitionByUuid } from '~/lib/types'

const Divisions = ({ competition }: { competition: GetCompetitionByUuid }) => {
    const form = useFormContext()
    return (
        <Card>
            <CardHeader>
                <CardTitle>Events</CardTitle>
            </CardHeader>
            <CardContent className='mt-4 flex flex-col gap-2'>
                <FormField
                    control={form.control}
                    name='equipment'
                    render={({ field }) => (
                        <FormItem>
                            <ToggleGroup
                                type='multiple'
                                defaultValue={['']}
                                onValueChange={(value) => {
                                    field.onChange(value)
                                }}
                            >
                                <div className='flex flex-col gap-2 px-6 w-full'>
                                    <div className='w-full'>
                                        <div className='grid w-full grid-cols-6 place-items-center gap-1 text-xs'>
                                            <div className='col-span-1'>
                                                Name
                                            </div>
                                            <div>min age</div>
                                            <div>max age</div>
                                            <div className='col-span-2'>
                                                info
                                            </div>
                                        </div>
                                    </div>
                                    {competition.divisions.map((item) => (
                                        <FormField
                                            key={item.name}
                                            control={form.control}
                                            name='events'
                                            render={() => {
                                                return (
                                                    <FormItem key={item.id}>
                                                        <FormControl>
                                                            <ToggleGroupItem
                                                                variant='secondary'
                                                                className='w-full rounded-md border border-input tracking-tight'
                                                                value={
                                                                    item.name
                                                                }
                                                            >
                                                                <div className='grid w-full grid-cols-6 gap-1 divide-x divide-muted'>
                                                                    <div className='col-span-1'>
                                                                        {item
                                                                            .name
                                                                            .length >
                                                                        12 ? (
                                                                            <HoverCard>
                                                                                <HoverCardTrigger>
                                                                                    {item.name.slice(
                                                                                        0,
                                                                                        12,
                                                                                    ) +
                                                                                        '...'}
                                                                                </HoverCardTrigger>
                                                                                <HoverCardContent>
                                                                                    {
                                                                                        item.name
                                                                                    }
                                                                                </HoverCardContent>
                                                                            </HoverCard>
                                                                        ) : (
                                                                            item.name
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        {item.minAge ||
                                                                            '.'}
                                                                    </div>
                                                                    <div>
                                                                        {item.maxAge ||
                                                                            '.'}
                                                                    </div>
                                                                    <div className='col-span-3'>
                                                                        {item
                                                                            .info
                                                                            .length >
                                                                        24 ? (
                                                                            <HoverCard>
                                                                                <HoverCardTrigger>
                                                                                    {item.info.slice(
                                                                                        0,
                                                                                        24,
                                                                                    ) +
                                                                                        '...'}
                                                                                </HoverCardTrigger>
                                                                                <HoverCardContent>
                                                                                    {
                                                                                        item.info
                                                                                    }
                                                                                </HoverCardContent>
                                                                            </HoverCard>
                                                                        ) : (
                                                                            item.info
                                                                        )}
                                                                    </div>
                                                                </div>
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
export default Divisions
