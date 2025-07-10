'use client'

import { Button } from '~/components/ui/button'
import type { GetCompetitionById } from '~/lib/types'
import { api } from '~/trpc/react'

const roundPL = (num: number) => {
	return Math.round(num / 2.5) * 2.5
}

const RandomWeighIn = ({
	competition,
}: {
	competition: GetCompetitionById
}) => {
	const ctx = api.useUtils()
	const { data: isAdmin } = api.user.isAdmin.useQuery()
	const { mutate: updateAndLock } = api.compEntry.updateAndLock.useMutation({
		onSettled: () => {},
	})

	console.log(competition)

	const update = () => {
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
			const weight = Math.floor(Math.random() * 70) + 50
			const squarRackHeight =
				entry?.squarRackHeight === null || entry?.squarRackHeight === ''
					? '8in'
					: entry?.squarRackHeight
			const benchRackHeight =
        entry?.benchRackHeight === null || entry?.benchRackHeight === ''
					? '4/8'
					: entry?.benchRackHeight


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
				wc: entry?.wc || '',
				squatOpener: isSquat ? squatOpener.toString() : '',
				squarRackHeight: isSquat && squarRackHeight ? squarRackHeight : '',
				benchOpener: isBench ? benchOpener.toString() : '',
				benchRackHeight: isBench && benchRackHeight ? benchRackHeight : '',
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
					<Button className='w-min' variant='secondary' onClick={update}>
						Weigh In Blackout -random
					</Button>
				</div>
			)}
		</>
	)
}

export default RandomWeighIn
