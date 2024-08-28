'use client'
import { api } from '~/trpc/react'

import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { Skeleton } from '~/components/ui/skeleton'

import Competition from './competition'

export const dynamic = 'force-dynamic'

const Competitions = () => {
  const { data: competitions, isLoading: competitionsLoading } =
    api.competition.getMyCompetitions.useQuery()

  return (
    <section className='min-h-[calc(100vh - 10rem)] grid w-full grid-cols-1 place-content-between gap-4'>
      {competitionsLoading ? (
        <div className='flex flex-col items-center justify-center gap-2'>
          <Skeleton className='h-[20px] w-[80vw] rounded-full' />
          <Skeleton className='h-[20px] w-[80vw] rounded-full' />
          <Skeleton className='h-[20px] w-[80vw] rounded-full' />
          <Skeleton className='h-[200px] w-[80vw] rounded-xl' />
        </div>
      ) : (
        <Table>
          <TableCaption>Competitions</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Venue</TableHead>
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
              <TableHead>Information</TableHead>
              <TableHead className='hidden'>Actions</TableHead>
              <TableHead>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {competitions?.map((competition) => (
              <Competition
                competition={competition}
                key={competition.id}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  )
}

export default Competitions
