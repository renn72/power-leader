
'use client'
import { api } from '~/trpc/react'

import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

import type { GetCompetitionByUuid } from '~/lib/types'

import { atlasUsers } from '~/lib/atlas-users'

export const dynamic = 'force-dynamic'

const AddAtlasUsers = ({
  competition,
  className,
}: {
  competition: GetCompetitionByUuid
  className?: string
}) => {
  const ctx = api.useUtils()

  const { mutate } = api.compEntry.createEntry.useMutation({
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

    for (const user of atlasUsers) {
      let pickedEvents = events
        .filter((e) => user.events.includes(e.name))
        .map((event) => event.id.toString())

      let pickedDivisions = divisions
        .filter((d) => user.division.includes(d.name))
        .map((division) => division.id.toString())

      console.log(user.name, pickedDivisions, pickedEvents)
      mutate({
        name: user.name,
        birthDate: user.birthDate,
        email: user.email,
        address: '',
        phone: '',
        equipment: user.equipment,
        weight: user.weight,
        gender: user.gender,
        squatRackHeight: user.squatRackHeight,
        squatOpener: user.squatOpener,
        benchOpener: user.benchOpener,
        benchRackHeight: user.benchRackHeight,
        deadliftOpener: user.deadliftOpener,
        events: pickedEvents,
        divisions: pickedDivisions,
        compId: competition?.id || 0,
        notes: '',
      })
    }
  }

  return (
    <Button
      className={cn(className)}
      onClick={createCE}
    >
      Add CE Lifters
    </Button>
  )
}

export default AddAtlasUsers
