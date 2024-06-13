'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import Create from './_components/create'
import Competitions from './_components/competition/competitions'
import List from './_components/list'
import { useSearchParams } from 'next/navigation'
import Upcoming from './_components/upcoming'
import WeighIn from './_components/weigh-in'

export const dynamic = 'force-dynamic'

export default function Dashboard({ params }: { params: { tab: string } }) {
    const searchParams = useSearchParams()
    const tab = searchParams.get('tab')
    console.log(tab)



    return (
        <section className='mt-8 flex h-full grow flex-col'>
            <Tabs
                defaultValue={ tab || 'competition' }
                orientation='vertical'
                className='flex h-full grow  flex-col space-x-2 lg:flex-row'
            >
                <div className='rounded-md bg-muted p-2'>
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
                            value='upcoming'
                            className='w-28'
                        >
                           Upcoming
                        </TabsTrigger>
                        <TabsTrigger
                            value='create'
                            className='w-28'
                        >
                            Create
                        </TabsTrigger>
                        <TabsTrigger
                            value='weigh-in'
                            className='w-28'
                        >
                            Weigh In
                        </TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent
                    className='min-h-[calc(100vh-10rem)] w-full'
                    value='join'
                >
                    <List />
                </TabsContent>

                <TabsContent
                    className='min-h-[calc(100vh-10rem)] w-full'
                    value='competition'
                >
                    <Competitions />
                </TabsContent>
                <TabsContent
                    className='min-h-[calc(100vh-10rem)] w-full'
                    value='upcoming'
                >
                    <Upcoming />
                </TabsContent>
                <TabsContent
                    className='min-h-[calc(100vh-10rem)] w-full'
                    value='create'
                >
                    <Create />
                </TabsContent>
                <TabsContent
                    className='min-h-[calc(100vh-10rem)] w-full'
                    value='weigh-in'
                >
                    <WeighIn />
                </TabsContent>
            </Tabs>
        </section>
    )
}
