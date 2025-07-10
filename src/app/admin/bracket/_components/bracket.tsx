'use client'

import { useEffect, useState } from 'react'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '~/components/ui/card'
import type { GetCompetitionById, GetCompetitionEntryById } from '~/lib/types'

import Entry from './comp-entry'

const Bracket = ({
	entries,
	competition,
	lift,
	title,
	bracket,
	isAdmin,
  isLocked,
}: {
	entries: GetCompetitionEntryById[]
	competition: GetCompetitionById
	lift: string
	title: string
	bracket: number
	isAdmin: boolean
    isLocked: boolean
}) => {

	const [entryList, setEntryList] = useState<GetCompetitionEntryById[]>(
		() => entries,
	)

	useEffect(() => {
		if (lift === 'squat') {
			setEntryList(
				entries
					.filter((entry) => entry.squatBracket === bracket)
					.sort((a, b) => {
						if (Number(a.squatOpener) === 0 && a.squatOpener !== '0') return 1
						if (Number(b.squatOpener) === 0 && b.squatOpener !== '0') return -1
						return Number(a.squatOpener) - Number(b.squatOpener)
					}),
			)
		}
		if (lift === 'bench') {
			setEntryList(
				entries
					.filter((entry) => entry.benchBracket === bracket)
					.sort((a, b) => {
						if (Number(a.benchOpener) === 0 && a.benchOpener !== '0') return 1
						if (Number(b.benchOpener) === 0 && b.benchOpener !== '0') return -1
						return Number(a.benchOpener) - Number(b.benchOpener)
					}),
			)
		}
		if (lift === 'deadlift') {
			setEntryList(
				entries
					.filter((entry) => entry.deadliftBracket === bracket)
					.sort((a, b) => {
						if (Number(a.deadliftOpener) === 0 && a.deadliftOpener !== '0')
							return 1
						if (Number(b.deadliftOpener) === 0 && b.deadliftOpener !== '0')
							return -1
						return Number(a.deadliftOpener) - Number(b.deadliftOpener)
					}),
			)
		}
	}, [entries])


	return (
		<Card className='relative min-w-[500px] max-w-[650px] shadow-md'>
			<CardHeader className='mb-0 pb-0 pt-1'>
				<CardTitle className='flex items-baseline justify-center lg:text-3xl gap-2'>
					<div className='capitalize'>{title}</div>
					<div className='text-base font-medium'>Flight {bracket}</div>
				</CardTitle>
				<CardDescription className='' />
			</CardHeader>
			<CardContent className='px-2'>
				<div className='flex flex-col gap-1'>
					{entryList.map((entry, i) => (
						<Entry
              key={entry.id}
							entry={entry}
							competition={competition}
							lift={lift}
							i={i}
							isAdmin={isAdmin}
              isLocked={isLocked}
              bracket={bracket}
						/>
					))}
				</div>
			</CardContent>
		</Card>
	)
}

export default Bracket
