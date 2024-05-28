'use client'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
})

import { api } from '~/trpc/react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
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
  insertCompetitionSchema,
  insertDivisionSchema,
} from '~/server/db/schema'

export const dynamic = 'force-dynamic'

export default function Dashboard() {
  const context = api.useUtils()

  const { mutate: createComp } = api.competition.create.useMutation({
    onSettled: () => {
      context.competition.invalidate()
    },
  })

  const form = useForm<z.infer<typeof insertCompetitionSchema>>({
    resolver: zodResolver(insertCompetitionSchema),
    defaultValues: {
      name: '',
      federation: '',
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof insertCompetitionSchema>,) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
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
                <FormDescription>
                  description
                </FormDescription>
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
                    placeholder='federation'
                    {...field}
                  />
                </FormControl>
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
