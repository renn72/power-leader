'use client'
import { api } from '~/trpc/react'

import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

import type { GetCompetitionByUuid } from '~/lib/types'

import {users} from '~/lib/showdown'

export const dynamic = 'force-dynamic'

const AddShowdownUsers = ({
  competition,
  className,
}: {
  competition: GetCompetitionByUuid
  className?: string
}) => {
  const ctx = api.useUtils()

  const { mutate } = api.compEntry.createEntryWithClerk.useMutation({
    onError: (err) => {
      console.log(err)
      toast('Error')
    },
    onSuccess: () => {
      toast('Created')
      void ctx.competition.getCompetitionByUuid.invalidate()
    },
  })

  const createCE = () => {
    const divisions = competition?.divisions?.map((division) => ({
      id: division.id.toString(),
      name: division.name,
    }))
    const equipment = competition?.equipment?.split('/') || []
    const events = competition?.events?.map((event) => ({
      id: event.id.toString(),
      name: event.name,
    }))

    for (const user of users) {

      const bench = events.find((e) => e.name.toLowerCase() === 'bench only')?.id
      const deadlift = events.find((e) => e.name.toLowerCase() === 'deadlift only')?.id
      const pushPull = events.find((e) => e.name.toLowerCase() === 'push pull')?.id
      const all = events.find((e) => e.name.toLowerCase() === 'squat, bench, deadlift')?.id

      const pickedEvents = user.isBench ? bench : user.isDeadlift ? deadlift : user.isPushPull ? pushPull : all

      let pickedDivisions = divisions
        .filter((d) => user.category === 'first' ? d.name === 'First Timers' : user.category == d.name.toLowerCase())
        .map((division) => division.id.toString())
      const equipment = user.equip

      const today = new Date(new Date().getTime() - (22 * 24 * 60 * 60 * 1000))
      const birthDate = new Date(today.getTime() - (365 * 24 * 60 * 60 * 1000 * user.age))

      console.log(user, pickedDivisions, pickedEvents, birthDate)


      mutate({
        name: user.name,
        birthDate: birthDate,
        email: user.email,
        address: '',
        phone: '',
        equipment: equipment,
        gender: user.sex === 'f' ? 'female' : 'male',
        events: [pickedEvents ?? ''],
        divisions: pickedDivisions,
        compId: competition?.id || 0,
        notes: user.div,
        wc: user.wc.toString(),
      })
    }
  }

  return (
    <Button
      className={cn(className)}
      onClick={createCE}
    >
      Add Showdown Lifters
    </Button>
  )
}

export default AddShowdownUsers
