'use client'
import { api } from '~/trpc/react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'

export const dynamic = 'force-dynamic'

export default function Dashboard() {
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
            <TabsTrigger
              value='password'
              className='w-28'
            >
              Pasword
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value='competition'>
          <section className='flex flex-col gap-4'>
            <div
              className='flex flex-col gap-2'
            >
            </div>
            <Input
              type='text'
              placeholder='Name'
              className='w-full'
            />
            <Button>Create</Button>
          </section>
        </TabsContent>
        <TabsContent value='password'>Change your password here.</TabsContent>
      </Tabs>
    </section>
  )
}
