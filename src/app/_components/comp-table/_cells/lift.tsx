'use client'

import { useState } from 'react'

import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { TableCell } from '~/components/ui/table-scroll'
import type {
	GetCompetitionByUuid,
	GetCompetitionEntryById,
	GetLiftById,
} from '~/lib/types'
import { cn } from '~/lib/utils'
import { api } from '~/trpc/react'
import { Circle, MinusCircle, PlusCircle } from 'lucide-react'
import { toast } from 'sonner'

const Lift = ({
	input,
	title,
	lift,
	previousLift,
	isHighlighted = false,
	liftName,
	liftNumber,
	lifter,
	bracket,
}: {
	input: string
	title: string
	previousLift?: GetLiftById | undefined
	lift: GetLiftById | undefined
	isHighlighted?: boolean
	liftName: string
	liftNumber: number
	lifter: GetCompetitionEntryById
	bracket: string
}) => {
	const [value, setValue] = useState(() => {
		if (!input) return previousLift?.weight || ''
		return input
	})

	const [isOpen, setIsOpen] = useState(false)

	const [isRecord, setIsRecord] = useState(() => lift?.isRecord)

	const ctx = api.useUtils()
	const { mutate: createUpdateLift } = api.lift.createUpdate.useMutation({
		onSuccess: () => {
			toast('Saved')
			setIsOpen(false)
			void ctx.competition.getCompetitionByUuid.invalidate()
		},
	})

	const isOne = lift?.isGoodOne
	const isTwo = lift?.isGoodTwo
	const isThree = lift?.isGoodThree

	const isJudged = isOne !== null && isTwo !== null && isThree !== null && lift
	const isGood = (isOne && isTwo) || (isTwo && isThree) || (isOne && isThree)

	const handleClick = () => {
		createUpdateLift({
			compEntryId: lifter?.id,
			lift: liftName,
			gender: lifter?.gender || '',
			bracket: Number(bracket),
			userWeight: lifter?.weight || '',
			weight: value,
			liftNumber: liftNumber,
			name: lifter?.user?.name || '',
			isRecord: isRecord,
		})
		return
	}
	return (
		<TableCell
			className={cn(
				isHighlighted && 'bg-yellow-800/10',
				'py-0 w-28',
				'p-0 lg:px-1  h-8 ',
			)}
		>
			<Dialog
				open={isOpen}
				onOpenChange={(open) => {
					setIsOpen(open)
				}}
			>
				<DialogTrigger
					className={cn(
						'flex w-full cursor-pointer items-center justify-between gap-0 px-[4px] lg:px-3 py-1 lg:py-1 tracking-tighter min-w-[52px] min-h-[30px]',
						input === '' ? '' : 'rounded-md outline outline-border',
						isJudged
							? isGood
								? 'border-0 outline-0 bg-green-600/20 font-bold'
								: 'border-0 outline-0 bg-red-600/20 font-bold'
							: '',
					)}
				>
					<div className='mr-0 xl:mr-4 tracking-tightest xl:tracking-tighter text-sm xl:text-lg'>
						{input + (input !== '' ? 'kg' : '')}
					</div>
					<div
						className={cn('flex flex-col gap-1', input === '' ? 'hidden' : '')}
					>
						<Circle
							size={6}
							fill={isOne === true ? 'green' : isOne === false ? 'red' : 'gray'}
							className={cn(
								'text-accent',
								isOne === true
									? 'text-green-600'
									: isOne === false
										? 'text-red-600'
										: '',
							)}
						/>
						<Circle
							size={6}
							fill={isTwo === true ? 'green' : isTwo === false ? 'red' : 'gray'}
							className={cn(
								'text-accent',
								isTwo === true
									? 'text-green-600'
									: isTwo === false
										? 'text-red-600'
										: '',
							)}
						/>
						<Circle
							size={6}
							fill={
								isThree === true ? 'green' : isThree === false ? 'red' : 'gray'
							}
							className={cn(
								'text-accent',
								isThree === true
									? 'text-green-600'
									: isThree === false
										? 'text-red-600'
										: '',
							)}
						/>
					</div>
				</DialogTrigger>
				<DialogContent
					onOpenAutoFocus={(e) => e.preventDefault()}
					className='select-none'
				>
					<DialogHeader>
						<DialogTitle className='text-center'>{title}</DialogTitle>
					</DialogHeader>
					<div className='flex items-center justify-between'>
						<MinusCircle
							className='cursor-pointer'
							size={48}
							onClick={() => {
								let c = Math.floor(Number(value) / 2.5)
								c = Number((c * 2.5 - 2.5).toFixed(2))
								let fixed = c % 0.5 > 0 ? 2 : c % 1 > 0 ? 1 : 0
								setValue(c.toFixed(fixed))
							}}
						/>
						<Input
							className='h-full w-52 py-4 text-center md:text-2xl font-bold'
							value={value}
							onChange={(e) => {
								setValue(e.target.value)
							}}
						/>
						<PlusCircle
							className='cursor-pointer'
							focusable
							size={48}
							onClick={() => {
								let c = Math.floor(Number(value) / 2.5)
								c = Number((c * 2.5 + 2.5).toFixed(2))
								let fixed = c % 0.5 > 0 ? 2 : c % 1 > 0 ? 1 : 0
								setValue(c.toFixed(fixed))
							}}
						/>
					</div>
					<div
						className={cn(
							'flex items-center justify-center gap-1 mx-auto border-2 rounded-lg px-4 py-4 ',
							isRecord === true ? 'border-primary' : '',
						)}
					>
						<Label className='text-sm'>Record</Label>
						<Checkbox
							checked={isRecord ?? false}
							onCheckedChange={(e) => {
								if (e === true) setIsRecord(true)
								if (e === false) setIsRecord(false)
							}}
						/>
					</div>
					<Button
						className='mt-2'
						variant='secondary'
						onClick={() => {
							handleClick()
						}}
					>
						Save
					</Button>
				</DialogContent>
			</Dialog>
		</TableCell>
	)
}

export default Lift
