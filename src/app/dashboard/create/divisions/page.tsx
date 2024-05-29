'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { api } from '~/trpc/react'

import { cn, getDateFromString } from '~/lib/utils'
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
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'

import { ageDivisionsData } from '~/lib/store'

import { insertDivisionSchema } from '~/server/db/schema'
import { Minus, XIcon } from 'lucide-react'

const divisionSchema = z.object({
  name: z.string(),
  minAge: z.string(),
  maxAge: z.string(),
  info: z.string(),
})


export const dynamic = 'force-dynamic'

export default function Divisions() {
  const context = api.useUtils()

  const { mutate: createDivision } = api.division.create.useMutation({
    onSettled: () => {
      context.division.getAll.invalidate()
    },
    onSuccess: () => {
      toast('Division created')
    },
    onError: (error) => {
      toast(error.message)
    }

  })

  const { mutate: generateDivision } = api.division.generate.useMutation({
    onSettled: () => {
      context.division.getAll.invalidate()
    },
    onSuccess: () => {
      toast('Division created')
    },
    onError: (error) => {
      toast(error.message)
    }
  })

  const { mutate: deleteAllDivisions } = api.division.deleteAll.useMutation({
    onSettled: () => {
      context.division.getAll.invalidate()
    },
    onSuccess: () => {
      toast('All Divisions deleted')
    },
    onError: (error) => {
      toast(error.message)
    }
  })

  const { mutate: deleteDivision } = api.division.delete.useMutation({
    onSettled: () => {
      context.division.getAll.invalidate()
    },
    onSuccess: () => {
      toast('Division deleted')
    },
    onError: (error) => {
      toast(error.message)
    }
  })

  const { data: divisions } = api.division.getAll.useQuery()
  console.log(divisions)

  const form = useForm<z.infer<typeof divisionSchema>>({
    resolver: zodResolver(divisionSchema),
    defaultValues: {
      name: '',
      minAge: '',
      maxAge: '',
      info: '',
    },
  })

  const generateDivisions = () => {
    generateDivision(ageDivisionsData as z.infer<typeof insertDivisionSchema>[])
  }


  const onSubmit = (data: z.infer<typeof divisionSchema>) => {
    createDivision(
      {
        name: data.name,
        minAge: Number(data.minAge),
        maxAge: Number(data.maxAge),
        info: data.info,
      }
      )
  }

  return (
    <section className='m-8 flex h-full grow flex-col items-center gap-8'>
      <div className='flex max-w-2xl flex-col'>
        <h1 className='text-3xl font-bold'>Create Divisions</h1>
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
                      placeholder='division name'
                      type='text'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-between gap-4 items-end'>
            <FormField
              control={form.control}
              name='minAge'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input
                     placeholder='min'
                      type='number'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
              <Minus className='text-muted-foreground mb-4' />
            <FormField
              control={form.control}
              name='maxAge'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder='max'
                      type='number'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
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
      </div>
      <div className='flex gap-2 flex-wrap justify-center'>
        {divisions?.map((division) => (
          <Card
            key={division.id}
            className='w-[380px]'>
            <CardHeader className='relative'>
              <CardTitle>{division.name}</CardTitle>
              <XIcon
                onClick={() => {
                  deleteDivision(division.id)
                }}
                className={cn(
                  'absolute top-2 right-2 cursor-pointer',
                  'text-muted-foreground hover:text-destructive-foreground',
                )}
              />
            </CardHeader>
            <CardContent className='grid gap-4'>
              <div className=' flex flex-col items-start gap-4 rounded-md border p-4'>
                <div className='flex items-baseline gap-4'>
                  <p className='text-sm font-medium leading-none'>Age Range</p>
                  <p className='text-sm text-muted-foreground'>
                    {division.minAge}
                  </p>
                </div>
                <div className='flex items-baseline gap-4'>
                  <p className='text-sm font-medium leading-none'>Gender</p>
                  <p className='text-sm text-muted-foreground'>
                    {division.maxAge}
                  </p>
                </div>
                <div className='flex items-baseline gap-4'>
                  <p className='text-sm font-medium leading-none'>
                    Information
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {division.info}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className='text-muted-foreground text-xs font-lightest'>{getDateFromString(division.createdAt)}</CardFooter>
          </Card>
        ))}
      </div>
      <Button
        onClick={generateDivisions}
        className='w-40'
      >
        Generate
      </Button>
      <Button
        variant='destructive'
        onClick={() => deleteAllDivisions()}
        className='w-40'
      >
        Delete All
      </Button>
    </section>
  )
}
