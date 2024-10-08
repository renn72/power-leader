'use client'
import { api } from '~/trpc/react'
import { useUser } from '@clerk/nextjs'

import { Button } from '~/components/ui/button'
import { toast } from 'sonner'

import JoinCompForm from '~/app/_components/join/join'

export const dynamic = 'force-dynamic'

const JoinCompPage = ({ params }: { params: { comp: string } }) => {
  const { comp } = params
  const hostName = window.location.origin
  const { isSignedIn, isLoaded } = useUser()

  const { data: isAdmin } = api.user.isAdmin.useQuery()
  const { data: competition, isLoading: competitionLoading } =
    api.competition.getCompetitionByUuid.useQuery(comp)

  const { mutate: createFakeUsers } = api.compEntry.createFake.useMutation({
    onSettled: () => {
      toast('Created')
    },
    onError: (err) => {
      console.log(err)
      toast('Error')
    },
    onSuccess: () => {
      toast('Created')
    },
  })

  const { data: fakeUsers } = api.user.getFakeUsers.useQuery()

  const createFake = () => {
    if (!isAdmin) {
      return
    }
    if (!fakeUsers) {
      return
    }
    const divisions =
      competition?.divisions?.map((division) => division.id) || []
    const equipment = competition?.equipment?.split('/') || []
    const events = competition?.events?.map((event) => event.id) || []

    for (const user of fakeUsers) {
      if (!user.birthDate) continue
      const birthDate = new Date(user.birthDate)
      let pickedEvents = events
        .filter((event) => Math.random() > 0.5)
        .map((event) => event.toString())
      if (pickedEvents.length == 0 && events[0]) {
        pickedEvents = [events[0].toString()]
      }

      let pickedDivisions = divisions
        .filter((_division) => Math.random() > 0.5)
        .map((division) => division.toString())
      if (pickedDivisions.length == 0 && divisions[0]) {
        pickedDivisions = [divisions[0].toString()]
      }
      console.log(pickedEvents, pickedDivisions)
      // createFakeUsers({
      //     birthDate: birthDate,
      //     address: user.address || '',
      //     phone: user.phone || '',
      //     instagram: user.instagram || '',
      //     openlifter: user.openlifter || '',
      //     equipment: equipment[Math.floor(Math.random() * equipment.length)] || '',
      //     gender: Math.random() > 0.5 ? 'Male' : 'Female',
      //     predictedWeight: (60 + Math.floor(Math.random() * 100)).toString(),
      //     event: pickedEvents,
      //     division: pickedDivisions,
      //     squatOpener: '',
      //     squarRackHeight: '',
      //     benchOpener: '',
      //     benchRackHeight: '',
      //     deadliftOpener: '',
      //     squatPB: '',
      //     benchPB: '',
      //     deadliftPB: '',
      //     compId: competition?.id || 0,
      //     notes: '',
      //     userId: user.id,
      // })
    }
  }

  if (!isLoaded) {
    return null
  }

  if (!isSignedIn) {
    return (
      <div className='flex w-full flex-col items-center justify-center gap-2'>
        <a
          href={`https://welcomed-hound-18.accounts.dev/sign-up?redirect_url=${hostName}/join/${comp}`}
        >
          <Button size='lg'>Sign up</Button>
        </a>
        <a
          href={`https://welcomed-hound-18.accounts.dev/sign-in?redirect_url=${hostName}/join/${comp}`}
        >
          <Button size='lg'>Sign in</Button>
        </a>
      </div>
    )
  }

  return (
    <>
      <div className='flex w-full grow flex-col items-center gap-4'>
        <JoinCompForm comp={comp} />
        {isAdmin && (
          <Button
            className='mt-4 w-min'
            onClick={createFake}
          >
            Add Fake Users
          </Button>
        )}
      </div>
    </>
  )
}

export default JoinCompPage
