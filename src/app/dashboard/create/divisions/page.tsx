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
  name: z.string(),
  age: z.string(),
  gender: z.string(),
  weight: z.number(),
  equipment: z.string(),
  info: z.string(),
})

export default function Divisions() {
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
      age: '',
      gender: '',
      weight: 44,
      equipment: '',
      info: '',
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
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='age'
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input
                    placeholder='age'
                    type='text'
                    {...field}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='gender'
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Input
                    placeholder='gender'
                    type='text'
                    {...field}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='weight'
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight</FormLabel>
                <FormControl>
                  <Input
                    placeholder='weight'
                    type='number'
                    {...field}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='equipment'
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipment</FormLabel>
                <FormControl>
                  <Input
                    placeholder='equipment'
                    type='text'
                    {...field}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='info'
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Info</FormLabel>
                <FormControl>
                  <Input
                    placeholder='info'
                    type='text'
                    {...field}
                  />
                </FormControl>
                <FormDescription></FormDescription>
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
