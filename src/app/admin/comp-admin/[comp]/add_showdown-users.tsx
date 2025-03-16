'use client'

import { Button } from '~/components/ui/button'
import { users } from '~/lib/showdown'
import type { GetCompetitionByUuid } from '~/lib/types'
import { cn } from '~/lib/utils'
import { api } from '~/trpc/react'
import { toast } from 'sonner'

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

  const createCE = (start: number, end: number) => {
    const divisions = competition?.divisions?.map((division) => ({
      id: division.id.toString(),
      name: division.name,
    }))
    const equipment = competition?.equipment?.split('/') || []
    const events = competition?.events?.map((event) => ({
      id: event.id.toString(),
      name: event.name,
    }))

    for (const user of users.slice(start, end)) {
      const bench = events.find(
        (e) => e.name.toLowerCase() === 'bench only',
      )?.id
      const deadlift = events.find(
        (e) => e.name.toLowerCase() === 'deadlift only',
      )?.id
      const pushPull = events.find(
        (e) => e.name.toLowerCase() === 'push pull',
      )?.id
      const all = events.find(
        (e) => e.name.toLowerCase() === 'squat, bench, deadlift',
      )?.id

      const pickedEvents = user.isBench
        ? bench
        : user.isDeadlift
          ? deadlift
          : user.isPushPull
            ? pushPull
            : all

      let pickedDivisions = divisions
        .filter((d) =>
          user.category === 'first'
            ? d.name === 'First Timers'
            : user.category == d.name.toLowerCase(),
        )
        .map((division) => division.id.toString())
      const equipment = user.equip

      const today = new Date(new Date().getTime() - 22 * 24 * 60 * 60 * 1000)
      const birthDate = new Date(
        today.getTime() - 365 * 24 * 60 * 60 * 1000 * user.age,
      )

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
    <div className='flex gap-2 hidden '>
      <Button
        className={cn(className)}
        onClick={() => {
          createCE(0, 10)
        }}
      >
        Showdown 1
      </Button>
      <Button
        className={cn(className)}
        onClick={() => {
          createCE(10, 20)
        }}
      >
        Showdown 2
      </Button>
      <Button
        className={cn(className)}
        onClick={() => {
          createCE(20, 30)
        }}
      >
        Showdown 3
      </Button>
      <Button
        className={cn(className)}
        onClick={() => {
          createCE(30, 40)
        }}
      >
        Showdown 4
      </Button>
      <Button
        className={cn(className)}
        onClick={() => {
          createCE(40, 60)
        }}
      >
        Showdown 5
      </Button>
    </div>
  )
}

export default AddShowdownUsers
