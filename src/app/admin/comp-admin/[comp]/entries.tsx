'use client'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { cn } from '~/lib/utils'

import Entry from './entry'
import EntryForm from './entry_form'
import AddFakeUsers from './add_fake_users'
import AddAtlasUsers from './add_atlas_users'
import DeleteAllEntries from './delete_all_entries'

import type { GetCompetitionByUuid } from '~/lib/types'

export const dynamic = 'force-dynamic'

const Entries = ({
  competition,
  className,
}: {
  competition: GetCompetitionByUuid
  className?: string
}) => {
  console.log({ competition })

  return (
    <div
      className={cn(
        className,
        'flex w-full flex-col items-center gap-2 text-lg font-medium',
      )}
    >
      <Card className='w-full'>
        <CardHeader>Entries</CardHeader>
        <CardContent>
          <div className='flex w-full flex-col gap-4'>
            <div className='flex w-full justify-end gap-4'>
              <EntryForm competition={competition} />
              <AddFakeUsers competition={competition} />
              <AddAtlasUsers competition={competition} />
            </div>
            {competition.entries?.map((entry) => (
              <Entry
                key={entry.id}
                entry={entry}
              />
            ))}
            <DeleteAllEntries compId={competition.id} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Entries
