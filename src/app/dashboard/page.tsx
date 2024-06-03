'use client'
import { api } from '~/trpc/react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Button } from '~/components/ui/button'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function Dashboard() {
  const { data: competitions } = api.competition.getMyCompetitions.useQuery()

  console.log(competitions)

  return (
    <section className='mt-8 flex h-full grow flex-col'>
      <Tabs
        defaultValue='competition'
        orientation='vertical'
        className='flex h-full grow space-x-2'
      >
        <div className='min-h-[calc(100vh - 10rem)] rounded-md bg-muted p-2'>
          <TabsList className='flex h-full w-36 flex-col justify-start space-x-2'>
            <TabsTrigger
              value='competition'
              className='w-28'
            >
              Competition
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent
          className='min-h-[calc(100vh - 10rem)] w-full'
          value='competition'>
          <section className='grid grid-cols-1 place-content-between gap-4 h-full'>
            <div className='flex flex-col gap-2'>
            </div>
            <Link href='/dashboard/create'>
              <Button>Create</Button>
            </Link>
          </section>
        </TabsContent>
        <TabsContent value='password'>Change your password here.</TabsContent>
      </Tabs>
    </section>
  )
}
