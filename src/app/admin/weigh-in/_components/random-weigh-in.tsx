
'use client'
import { api } from '~/trpc/react'

import { Button } from '~/components/ui/button'

import type { GetCompetitionById } from '~/lib/types'

const roundPL = (num: number) => {
  return Math.round(num / 2.5) * 2.5
}

const RandomWeighIn = ({ competition }: { competition: GetCompetitionById }) => {
  const ctx = api.useUtils()
  const { data: isAdmin } = api.user.isAdmin.useQuery()
  const { mutate: updateAndLock } = api.compEntry.updateAndLock.useMutation({
    onSettled: () => {
    },
  })

  console.log(competition)

  const update = () => {
    const wc_male = competition.wc_male?.split('/').map((item) => Number(item))
    const wc_female = competition.wc_female
      ?.split('/')
      .map((item) => Number(item))

    for (const entry of competition.entries) {
      const isSquat =
        entry?.events.reduce((a, c) => {
          if (c.event?.isSquat) return true
          return a
        }, false) || false
      const isBench =
        entry?.events.reduce((a, c) => {
          if (c.event?.isBench) return true
          return a
        }, false) || false
      const isDeadlift =
        entry?.events.reduce((a, c) => {
          if (c.event?.isDeadlift) return true
          return a
        }, false) || false

      const squatOpener = roundPL(50 + Math.floor(Math.random() * 270))
      const benchOpener = roundPL(50 + Math.floor(Math.random() * 270))
      const deadliftOpener = roundPL(50 + Math.floor(Math.random() * 270))
      const weight = 50 + Math.floor(Math.random() * 70)

      let wc = ''
      if (entry?.gender?.toLowerCase() == 'female' && wc_female) {
        wc =
          wc_female
            .reduce((a, c) => (weight < c && weight > a ? c : a), 0)
            .toString() + '-f'
      } else {
        if (wc_male && entry?.gender?.toLowerCase() !== 'female') {
          wc =
            wc_male
              .reduce((a, c) => (weight < c && weight > a ? c : a), 0)
              .toString() + '-m'
        }
      }

      updateAndLock({
        id: entry.id,
        address: entry?.address || '',
        phone: entry?.phone || '',
        instagram: entry?.instagram || '',
        openlifter: entry?.openlifter || '',
        birthDate: entry?.birthDate || new Date(),
        equipment: entry?.equipment || '',
        gender: entry?.gender || '',
        predictedWeight: entry?.predictedWeight || '',
        weight: weight.toString(),
        wc: wc.toString(),
        squatOpener: isSquat ? squatOpener.toString() : '',
        squarRackHeight: isSquat ? '8out' : '',
        benchOpener: isBench ? benchOpener.toString() : '',
        benchRackHeight: isBench ? '8/4' : '',
        deadliftOpener: isDeadlift ? deadliftOpener.toString() : '',
        isFake: 'fake',
        squatPB: '',
        benchPB: '',
        deadliftPB: '',
        name: entry?.user?.name || '',
        compId: competition?.id || 0,
        userId: entry.userId || 0,
        notes: entry?.notes || '',
      })
    }
  }

  return (
    <>
      {isAdmin && (
        <div className='flex flex-col gap-4'>
          <Button
            className='w-min'
            variant='secondary'
            onClick={update}
          >
            Random Weigh In
          </Button>
        </div>
      )}
    </>
  )
}

export default RandomWeighIn
