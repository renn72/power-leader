'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { api } from '~/trpc/react'

import { CalendarIcon, XCircle } from 'lucide-react'
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
import { Textarea } from '~/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group'

import { ageDivisionsData, eventsData } from '~/lib/store'

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
  daysOfCompetition: z.number().nonnegative().int().min(1),
  platforms: z.number().nonnegative().int().min(1),
  rules: z.string(),
  notes: z.string(),
  events: z.array(z.string()),
  divisions: z.array(
    z.object({
      name: z.string(),
      minAge: z.number().positive().or(z.string()),
      maxAge: z.number().positive().or(z.string()),
      info: z.string(),
    }),
  ),
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
      platforms: 1,
      rules: '',
      events: [],
      notes: '',
      divisions: [],
    },
  })

  // 2. Define a submit handler.
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    toast(JSON.stringify(data, null, 2))
  }

  return (
    <section className='font-xl my-8 flex h-full w-full grow flex-col items-center'>
      <h1 className='text-4xl font-bold'>Create Your Event</h1>
      <h2 className='text-lg font-normal text-muted-foreground '>
        Fill out the form to set up your powerlifting competition.
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex w-full max-w-2xl flex-col gap-2'
        >
          <div className='flex w-full items-end gap-4'>
            <FormField
              control={form.control}
              name='name'
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='event name'
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
              name='date'
              render={({ field }) => (
                <FormItem className='flex w-full flex-col'>
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'min-w-[240px] pl-3 text-left font-normal',
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='flex w-full items-end gap-4'>
            <FormField
              control={form.control}
              name='city'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='event name'
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
              name='state'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='event name'
                      type='text'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex w-full items-end gap-4'>
            <FormField
              control={form.control}
              name='country'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='event name'
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
              name='federation'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Federation</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='event name'
                      type='text'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='notes'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='description'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <br />

          <div className='flex w-full items-center gap-4'>
            <FormField
              control={form.control}
              name='daysOfCompetition'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Days of Competition</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='event name'
                      type='number'
                      {...field}
                      onChange={(e) => {
                        field.onChange(parseInt(e.target.value))
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='platforms'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Platfroms</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='event name'
                      type='number'
                      {...field}
                      onChange={(e) => {
                        field.onChange(parseInt(e.target.value))
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <br />

          <FormField
            control={form.control}
            name='events'
            render={({ field }) => (
              <FormItem className='cursor-auto rounded-lg border px-6 py-4'>
                <FormLabel className='text-base'>Events</FormLabel>
                <ToggleGroup
                  type='multiple'
                  onValueChange={(value) => {
                    console.log(value)
                    field.onChange(value)
                  }}
                >
                  <div className='flex flex-wrap justify-around gap-2'>
                    {eventsData.map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name='events'
                        render={() => {
                          return (
                            <FormItem key={item}>
                              <FormControl>
                                <ToggleGroupItem
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

          <br />

          <FormField
            control={form.control}
            name='divisions'
            render={({ field }) => (
              <FormItem className='cursor-auto rounded-lg border px-6 py-4'>
                <div className='flex items-center justify-between'>
                  <FormLabel>Divsions</FormLabel>
                  <Button
                    variant='outline'
                    onClick={(e) => {
                      e.preventDefault()
                      field.onChange([...ageDivisionsData])
                    }}
                  >
                    defaults
                  </Button>
                </div>
                <div className='flex flex-col gap-1'>
                  <div className='grid grid-cols-9 gap-2'>
                    <div className='col-span-2'>
                      <FormLabel>Name</FormLabel>
                    </div>
                    <div>
                      <FormLabel>Min Age</FormLabel>
                    </div>
                    <div>
                      <FormLabel>Max Age</FormLabel>
                    </div>
                    <div className='col-span-4'>
                      <FormLabel>Info</FormLabel>
                    </div>
                  </div>
                  {field.value?.map((division, index) => (
                    <div
                      key={index}
                      className='grid grid-cols-9 items-center gap-2'
                    >
                      <FormField
                        control={form.control}
                        name={`divisions.${index}.name`}
                        render={({ field }) => (
                          <FormItem className='col-span-2'>
                            <FormControl>
                              <Input
                                placeholder='name'
                                type='text'
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`divisions.${index}.minAge`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder='min'
                                type='number'
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`divisions.${index}.maxAge`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder='max'
                                type='number'
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`divisions.${index}.info`}
                        render={({ field }) => (
                          <FormItem className='col-span-4'>
                            <FormControl>
                              <Input
                                placeholder='info'
                                type='text'
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <XCircle
                        className='cursor-pointer place-self-center hover:text-destructive-foreground'
                        onClick={() => {
                          field.onChange(
                            field.value.filter((_, i) => i !== index),
                          )
                        }}
                      />
                    </div>
                  ))}
                </div>
                <FormControl></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <br />

          <Button type='submit'>Submit</Button>
          <Button
            className='w-min'
            onClick={(e) => {
              e.preventDefault()
              console.log(form.getValues())
            }}
          >Data</Button>
        </form>
      </Form>
    </section>
  )
}
