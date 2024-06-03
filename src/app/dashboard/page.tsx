'use client'
import { api } from '~/trpc/react'
import Link from 'next/link'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Button } from '~/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

export const dynamic = 'force-dynamic'

export default function Dashboard() {
  const { data: competitions, isLoading: competitionsLoading } =
    api.competition.getMyCompetitions.useQuery()

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
          value='competition'
        >
          <section className='grid h-full grid-cols-1 place-content-between gap-4'>
            {competitionsLoading ? (
              <div className='flex flex-col items-center justify-center gap-2'>
                <div className='animate-spin'>
                  <div className='h-4 w-4 rounded-full border-b-2 border-t-2 border-gray-200' />
                </div>
              </div>
            ) : (
              <Table>
                <TableCaption>Competitions</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Federation</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Platforms</TableHead>
                    <TableHead>Rules</TableHead>
                    <TableHead>Events</TableHead>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Formula</TableHead>
                    <TableHead>WC Men</TableHead>
                    <TableHead>WC Women</TableHead>
                    <TableHead>WC Mix</TableHead>
                    <TableHead>Divisions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {competitions?.map((competition) => (
                    <TableRow key={competition.id}>
                      <TableCell>{competition.name}</TableCell>
                      <TableCell>{competition.federation}</TableCell>
                      <TableCell>{competition.city}</TableCell>
                      <TableCell>{competition.state}</TableCell>
                      <TableCell>{competition.country}</TableCell>
                      <TableCell>
                        {new Date(competition.date || '').toLocaleDateString()}
                      </TableCell>
                      <TableCell>{competition.daysOfCompetition}</TableCell>
                      <TableCell>{competition.platforms}</TableCell>
                      <TableCell>{competition.rules}</TableCell>
                      <TableCell>
                        {competition.events?.split('/').map((event) => (
                          <div
                            key={event}
                            className='text-nowrap'
                          >
                            {event}
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>
                        {competition.equipment?.split('/').map((event) => (
                          <div
                            key={event}
                            className='text-nowrap'
                          >
                            {event}
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>{competition.formular}</TableCell>
                      <TableCell>
                        {competition.wc_male
                          ?.split('/')
                          .slice(0, 3)
                          .map((event) => (
                            <div
                              key={event}
                              className='text-nowrap'
                            >
                              {event}
                            </div>
                          ))}
                      </TableCell>
                      <TableCell>
                        <div className='flex gap-1'>
                          {competition.wc_female
                            ?.split('/')
                            .slice(0, 3)
                            .map((event) => (
                              <div
                                key={event}
                                className='text-nowrap'
                              >
                                {event}kg
                              </div>
                            ))}
                          {competition.wc_female && competition.wc_female?.split('/')?.length > 3 && (
                            <div className='text-nowrap'>...</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {competition.wc_mix
                          ?.split('/')
                          .slice(0, 3)
                          .map((event) => (
                            <div
                              key={event}
                              className='text-nowrap'
                            >
                              {event}
                            </div>
                          ))}
                      </TableCell>
                      <TableCell>
                        {competition.divisions?.map((division) => (
                          <div
                            key={division.id}
                            className='text-nowrap'
                          >
                            {division.name}
                          </div>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
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
