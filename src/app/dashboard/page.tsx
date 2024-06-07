'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import Create from './_components/create'
import Competitions from './_components/competions'
import List from './_components/list'

export const dynamic = 'force-dynamic'

export default function Dashboard() {
    return (
        <section className='mt-8 flex h-full grow flex-col'>
            <Tabs
                defaultValue='competition'
                orientation='vertical'
                className='flex h-full grow  flex-col space-x-2 lg:flex-row'
            >
                <div className='lg:min-h-[calc(100vh - 10rem)] rounded-md bg-muted p-2'>
                    <TabsList className='flex h-full w-36 justify-start gap-6 space-x-2 lg:flex-col'>
                        <TabsTrigger
                            value='join'
                            className='w-28'
                        >
                            Join
                        </TabsTrigger>
                        <TabsTrigger
                            value='competition'
                            className='w-28'
                        >
                            Competition
                        </TabsTrigger>
                        <TabsTrigger
                            value='create'
                            className='w-28'
                        >
                            Create
                        </TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent
                    className='min-h-[calc(100vh - 10rem)] w-full'
                    value='join'
                >
                    <List />
                </TabsContent>

                <TabsContent
                    className='min-h-[calc(100vh - 10rem)] w-full'
                    value='competition'
                >
                    <Competitions />
                </TabsContent>
                <TabsContent
                    className='min-h-[calc(100vh - 10rem)] w-full'
                    value='create'
                >
                    <Create />
                </TabsContent>
            </Tabs>
        </section>
    )
}
