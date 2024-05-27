'use client'
import { api } from '~/trpc/react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'

export const dynamic = 'force-dynamic'

export default function Dashboard() {
  return (
    <section className='flex h-full grow flex-col mt-8'>
      <Tabs
        defaultValue='account'
        orientation='vertical'
        className='flex h-full grow space-x-2'
      >
        <div className='min-h-[calc(100vh - 10rem)] bg-muted p-2 rounded-md'>
          <TabsList className='flex h-full flex-col justify-start space-x-2 w-36'>
            <TabsTrigger
              value='account'
              className='w-28'
            >Account</TabsTrigger>
            <TabsTrigger
              value='password'
              className='w-28'
            >Pasword</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value='account'>
          Make changes to your account here.
        </TabsContent>
        <TabsContent value='password'>Change your password here.</TabsContent>
      </Tabs>
    </section>
  )
}
