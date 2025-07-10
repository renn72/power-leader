'use client'

import { useEffect, useState } from 'react'

import { Badge } from '~/components/ui/badge'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '~/components/ui/card'
import type { GetCompetitionById, GetCompetitionEntryById } from '~/lib/types'
import { cn } from '~/lib/utils'
import { api } from '~/trpc/react'
import { toast } from 'sonner'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

const Entry = ({
	entry,
	competition,
	lift,
	i,
	isAdmin,
}: {
	entry: GetCompetitionEntryById
	competition: GetCompetitionById
	lift: string
	i: number
	isAdmin: boolean
}) => {
	const ctx = api.useUtils()
	const { mutate: updateBracket } = api.compEntry.updateBracket.useMutation({
		onMutate: async (newData) => {
			await ctx.competition.getMyCompetitions.cancel()

			const oldData = ctx.competition.getMyCompetitions.getData()

			if (!oldData) return

			ctx.competition.getMyCompetitions.setData(undefined, [
				...oldData.map((c) => {
					if (c.id === competition.id) {
						return {
							...c,
							entries: c.entries.map((e) => {
								if (e.id === newData.id) {
									return {
										...e,
										squatBracket:
											newData.bracket.squatBracket || e.squatBracket || 1,
										benchBracket:
											newData.bracket.benchBracket || e.benchBracket || 1,
										deadliftBracket:
											newData.bracket.deadliftBracket || e.deadliftBracket || 1,
									}
								}
								return e
							}),
						}
					}
					return c
				}),
			])
			return { oldData }
		},
		onError: (err, newData, context) => {
			toast.error('Error Updating Order')
			if (!context?.oldData) return
			ctx.competition.getMyCompetitions.setData(undefined, context.oldData)
		},
		onSettled: () => {
			ctx.competition.getMyCompetitions.refetch()
		},
		onSuccess: () => {},
	})

	const handleBracket = (bracket: number, id: number) => {
		if (lift === 'squat') {
			updateBracket({
				id: id,
				bracket: {
					squatBracket: bracket,
					benchBracket: bracket,
					deadliftBracket: bracket,
				},
			})
		} else if (lift === 'bench') {
			updateBracket({
				id: id,
				bracket: {
					benchBracket: bracket,
					deadliftBracket: bracket,
				},
			})
		} else if (lift === 'deadlift') {
			updateBracket({
				id: id,
				bracket: {
					deadliftBracket: bracket,
				},
			})
		}
	}

	const squatBrackets = Number(competition.squatBrackets)
	const benchBrackets = Number(competition.benchPressBrackets)
	const deadliftBrackets = Number(competition.deadliftBrackets)
	const numberOfBrackets =
		lift === 'squat'
			? squatBrackets
			: lift === 'bench'
				? benchBrackets
				: deadliftBrackets

	const [selectedBracket, setSelectedBracket] = useState<number>(() => {
		if (lift === 'squat') {
			return entry.squatBracket || 1
		}
		if (lift === 'bench') {
			return entry.benchBracket || 1
		}
		if (lift === 'deadlift') {
			return entry.deadliftBracket || 1
		}
		return 1
	})
	const opener =
		lift === 'squat'
			? entry.squatOpener
			: lift === 'bench'
				? entry.benchOpener
				: entry.deadliftOpener
	return (
		<div data-label={entry.id} className={cn('flex items-center gap-1')}>
			<div
				className={cn(
					'grid grid-cols-12 place-items-center gap-1 border border-input text-base tracking-tighter lg:tracking-tight w-full',
					'rounded-full px-[1px] py-[2px] text-xs sm:text-sm ',
					lift === 'squat' &&
						entry.squatOrderOne !== null &&
						'border-0 border-complete bg-muted/80',
					lift === 'bench' &&
						entry.benchOrderOne !== null &&
						'border-0 border-complete bg-muted/80',
					lift === 'deadlift' &&
						entry.deadliftOrderOne !== null &&
						'border-0 border-complete bg-muted/80',
				)}
			>
				<div className='font-extrabold tracking-wider text-muted-foreground'>
					{i + 1}
				</div>
				<Badge className='flex text-[0.60rem] lg:text-xs py-0 lg:py-0.5 w-8 tracking-tighter lg:w-12 items-center justify-center'>
					{entry.wc === 'SHW' ? 'SHW' : `${entry.wc?.split('-')[0]}kg`}
				</Badge>
				<div
					className={cn(
						'font-extrabold ',
						entry.gender?.toLowerCase() === 'female'
							? 'text-pink-400'
							: 'text-teal-400',
					)}
				>
					{entry.gender?.toLowerCase() === 'female' ? 'F' : 'M'}
				</div>
				<div
					className={cn(
						'font-extrabold ',
						entry.compEntryToDivisions?.[0]?.division?.name.toLowerCase() ===
							'open'
							? 'text-slate-400'
							: entry.compEntryToDivisions?.[0]?.division?.name.toLowerCase() ===
									'pro'
								? 'text-red-500'
								: 'text-green-600',
					)}
				>
					{entry.compEntryToDivisions?.[0]?.division?.name
						.slice(0, 1)
						.toUpperCase()}
				</div>
				<div
					className={cn(
						'font-extrabold ',
						entry.events?.[0]?.event?.name.toLowerCase() === 'open'
							? 'text-slate-400'
							: entry.compEntryToDivisions?.[0]?.division?.name.toLowerCase() ===
									'pro'
								? 'text-red-500'
								: 'text-green-600',
					)}
				>
					{entry.events?.[0]?.event?.name === 'Squat, Bench, Deadlift'
						? 'SBD'
						: entry.events?.[0]?.event?.name === 'Push Pull'
							? 'BD'
							: entry.events?.[0]?.event?.name === 'Deadlift only'
								? 'D'
								: entry.events?.[0]?.event?.name === 'Bench only'
									? 'B'
									: entry.events?.[0]?.event?.name === 'Squat only'
										? 'S'
										: ''}
				</div>
				<div
					className={cn(
						'font-extrabold ',
						entry.equipment?.toLowerCase() === 'classic'
							? 'text-orange-400'
							: entry.equipment?.toLowerCase() === 'raw'
								? 'text-indigo-400'
								: 'text-emerald-500',
					)}
				>
					{entry.equipment?.slice(0, 1).toUpperCase()}
				</div>
				<div className='col-span-3 tracking-tighter truncate capitalize overflow-hidden'>
					{!isAdmin && entry.user?.name && entry.user?.name.length > 18
						? entry.user?.name.slice(0, 15) + '...'
						: entry.user?.name}
				</div>
				<div className='col-span-2'>
					{opener === '' || opener === null ? '-' : opener + 'kg'}
				</div>
				{isAdmin ? (
					<Select
						value={selectedBracket.toString()}
						onValueChange={(value) => {
							if (value) {
								setSelectedBracket(Number(value))
							}
						}}
					>
						<SelectTrigger className='rounded-full px-2 py-0 text-xs sm:text-sm h-full'>
							<SelectValue placeholder='flight' />
						</SelectTrigger>
						<SelectContent>
							{Array.from(Array(numberOfBrackets).keys()).map((b) => (
								<SelectItem key={b} value={(b + 1).toString()}>
									{b + 1}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				) : (
					<div />
				)}
			</div>
		</div>
	)
}

export default Entry
