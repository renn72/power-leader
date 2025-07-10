'use client'

import { Button } from '~/components/ui/button'
import { users } from '~/lib/blackout'
import type { GetCompetitionByUuid } from '~/lib/types'
import { cn } from '~/lib/utils'
import { api } from '~/trpc/react'
import { toast } from 'sonner'

export const dynamic = 'force-dynamic'

const AddBlackoutUsers = ({
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
			const bench = events.find(
				(e) => e.name.toLowerCase() === 'bench only',
			)?.id
			const deadlift = events.find(
				(e) => e.name.toLowerCase() === 'deadlift only',
			)?.id
			const pushPull = events.find(
				(e) => e.name.toLowerCase() === 'push pull',
			)?.id
			const squat = events.find(
				(e) => e.name.toLowerCase() === 'squat only',
			)?.id
			const all = events.find(
				(e) => e.name.toLowerCase() === 'squat, bench, deadlift',
			)?.id

			const pickedEvent = user.isBench
				? bench
				: user.isDeadlift
					? deadlift
					: user.isSquat
						? squat
						: user.isPushPull
							? pushPull
							: all

			const div = user.age < 19 ? 'teen' : user.age > 39 ? 'master' : 'open'

			const pickedDivisions = divisions.filter(
				(division) => division.name.toLowerCase() === div,
			).map((division) => division.id)

			const equipment = user.equip

			const today = new Date(new Date().getTime() - 22 * 24 * 60 * 60 * 1000)
			const birthDate = new Date(
				today.getTime() - 365 * 24 * 60 * 60 * 1000 * user.age,
			)

			console.log(user, pickedDivisions, pickedEvent, birthDate)

			mutate({
				name: user.name,
				birthDate: birthDate,
				email: user.email,
				address: '',
				phone: '',
				equipment: equipment,
				gender: user.sex === 'f' ? 'female' : 'male',
				events: [pickedEvent ?? ''],
				divisions: pickedDivisions,
				compId: competition?.id || 0,
				notes: user.div,
				wc: user.wc.toString(),
			})
		}
	}

	return (
		<div className='flex gap-2 '>
			<Button
				className={cn(className)}
				onClick={() => {
					createCE()
				}}
			>
				Add Blackout Users
			</Button>
		</div>
	)
}

export default AddBlackoutUsers
