'use client'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { api } from '~/trpc/react'

import { CalendarIcon } from 'lucide-react'
import { cn } from '~/lib/utils'
import { Calendar } from '~/components/ui/calendar'

import { format } from 'date-fns'
import { toast } from 'sonner'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
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
import { Checkbox } from '~/components/ui/checkbox'

export const dynamic = 'force-dynamic'

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  federation: z.string(),
  country: z.string(),
  state: z.string(),
  city: z.string(),
  date: z.date(),
  daysOfCompetition: z.number(),
  rules: z.string(),
  events: z.string(),
  notes: z.string(),
  items: z.array(z.string()),
  divisions: z.array(z.number()),
})

export default function Dashboard() {
  const context = api.useUtils()

  const { mutate: createComp } = api.competition.create.useMutation({
    onSettled: () => {
      context.competition.invalidate()
    },
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      federation: '',
      country: '',
      state: '',
      city: '',
      date: new Date(),
      daysOfCompetition: 1,
      rules: '',
      events: '',
      notes: '',
      items: [],
      divisions: [],
    },
  })

  // 2. Define a submit handler.
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    toast(JSON.stringify(data, null, 2))
  }

  return (
    <section className='m-8 flex h-full grow flex-col'>
      create
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8'
        >
          <FormField
            control={form.control}
            name='name'
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='event name'
                    type='text'
                    {...field}
                  />
                </FormControl>
                <FormDescription>description</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='federation'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Federation</FormLabel>
                <FormControl>
                  <Input
                    placeholder='event name'
                    type='text'
                    {...field}
                  />
                </FormControl>
                <FormDescription>description</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='country'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input
                    placeholder='event name'
                    type='text'
                    {...field}
                  />
                </FormControl>
                <FormDescription>description</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='state'
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input
                    placeholder='event name'
                    type='text'
                    {...field}
                  />
                </FormControl>
                <FormDescription>description</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='city'
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input
                    placeholder='event name'
                    type='text'
                    {...field}
                  />
                </FormControl>
                <FormDescription>description</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='date'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className='w-auto p-0'
                    align='start'
                  >
                    <Calendar
                      mode='single'
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>description</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='daysOfCompetition'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Days of Competition</FormLabel>
                <FormControl>
                  <Input
                    placeholder='event name'
                    type='text'
                    {...field}
                  />
                </FormControl>
                <FormDescription>description</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='rules'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rules</FormLabel>
                <FormControl>
                  <Input
                    placeholder='event name'
                    type='text'
                    {...field}
                  />
                </FormControl>
                <FormDescription>description</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='events'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Events</FormLabel>
                <FormControl>
                  <Input
                    placeholder='event name'
                    type='text'
                    {...field}
                  />
                </FormControl>
                <FormDescription>description</FormDescription>
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
                  <Input
                    placeholder='event name'
                    type='text'
                    {...field}
                  />
                </FormControl>
                <FormDescription>description</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='items'
            render={() => (
              <FormItem>
                <div className='mb-4'>
                  <FormLabel className='text-base'>Lifts</FormLabel>
                  <FormDescription>
                  </FormDescription>
                </div>
                <div className='flex gap-4' >
                {['sbd','s', 'b', 'd',  'sb', 'sd', 'bd'].map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name='items'
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item}
                          className='flex flex-col items-center space-y-1'
                        >
                          <FormLabel className='font-normal'>
                            {item}
                          </FormLabel>
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item,
                                      ),
                                    )
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )
                    }}
                  />
                ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit'>Submit</Button>
        </form>
      </Form>
    </section>
  )
}
