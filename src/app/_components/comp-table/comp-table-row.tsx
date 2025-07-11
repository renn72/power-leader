'use client'

import { useState } from 'react'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { TableCell as Cell, TableRow } from '~/components/ui/table-scroll'
import type { GetCompetitionByUuid, GetCompetitionEntryById } from '~/lib/types'
import { cn } from '~/lib/utils'
import { api } from '~/trpc/react'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'

import BenchRackHeight from './_cells/bench-rack-height'
import Lift from './_cells/lift'
import SquatRackHeight from './_cells/squat-rack-height'

export const dynamic = 'force-dynamic'

const CompTableRow = ({
	lifter,
	index,
	round,
	bracket,
	setIndex,
	competition,
	i,
	lift,
	arr,
}: {
	lifter: GetCompetitionEntryById
	index: string
	round: string
	bracket: string
	setIndex: (index: string) => void
	competition: GetCompetitionByUuid
	arr: GetCompetitionEntryById[]
	i: number
	lift: string
}) => {
	const isLifter = +index === i
	const lifterId = lifter.id
	const lifterName = lifter?.user?.name
	const lifterWc = lifter?.wc?.split('-')[0] + 'kg'
	const lifterEquip = lifter?.equipment
	const gender = lifter?.user?.gender?.slice(0, 1)
	const lifterSquatRackHeight = lifter?.squarRackHeight || ''
	const lifterBenchRackHeight = lifter?.benchRackHeight || ''

	const lifterOrder =
		lifter?.lift?.find(
			(item) => item.lift === lift && item.liftNumber === Number(round),
		)?.order || null

	const isSquatOne = round === '1' && lift === 'squat'
	const lifterSquatOneLift = lifter?.lift?.find(
		(item) => item.lift === 'squat' && item.liftNumber === 1,
	)
	const lifterSquatOne = lifter?.lift?.find(
		(item) => item.lift === 'squat' && item.liftNumber === 1,
	)
		? lifter.lift.find((item) => item.lift === 'squat' && item.liftNumber === 1)
				?.weight || ''
		: ''

	const isSquatTwo = round === '2' && lift === 'squat'
	const lifterSquatTwoLift = lifter?.lift?.find(
		(item) => item.lift === 'squat' && item.liftNumber === 2,
	)
	const lifterSquatTwo = lifter?.lift?.find(
		(item) => item.lift === 'squat' && item.liftNumber === 2,
	)
		? lifter.lift.find((item) => item.lift === 'squat' && item.liftNumber === 2)
				?.weight || ''
		: ''

	const isSquatThree = round === '3' && lift === 'squat'
	const lifterSquatThreeLift = lifter?.lift?.find(
		(item) => item.lift === 'squat' && item.liftNumber === 3,
	)
	const lifterSquatThree = lifter?.lift?.find(
		(item) => item.lift === 'squat' && item.liftNumber === 3,
	)
		? lifter.lift.find((item) => item.lift === 'squat' && item.liftNumber === 3)
				?.weight || ''
		: ''

	const isSquatFour = round === '4' && lift === 'squat'
	const lifterSquatFourLift = lifter?.lift?.find(
		(item) => item.lift === 'squat' && item.liftNumber === 4,
	)
	const lifterSquatFour = lifter?.lift?.find(
		(item) => item.lift === 'squat' && item.liftNumber === 4,
	)
		? lifter.lift.find((item) => item.lift === 'squat' && item.liftNumber === 4)
				?.weight || ''
		: ''

	const isBenchOne = round === '1' && lift === 'bench'
	const lifterBenchOneLift = lifter?.lift?.find(
		(item) => item.lift === 'bench' && item.liftNumber === 1,
	)
	const lifterBenchOne = lifter?.lift?.find(
		(item) => item.lift === 'bench' && item.liftNumber === 1,
	)
		? lifter.lift.find((item) => item.lift === 'bench' && item.liftNumber === 1)
				?.weight || ''
		: ''

	const isBenchTwo = round === '2' && lift === 'bench'
	const lifterBenchTwoLift = lifter?.lift?.find(
		(item) => item.lift === 'bench' && item.liftNumber === 2,
	)
	const lifterBenchTwo = lifter?.lift?.find(
		(item) => item.lift === 'bench' && item.liftNumber === 2,
	)
		? lifter.lift.find((item) => item.lift === 'bench' && item.liftNumber === 2)
				?.weight || ''
		: ''

	const isBenchThree = round === '3' && lift === 'bench'
	const lifterBenchThreeLift = lifter?.lift?.find(
		(item) => item.lift === 'bench' && item.liftNumber === 3,
	)
	const lifterBenchThree = lifter?.lift?.find(
		(item) => item.lift === 'bench' && item.liftNumber === 3,
	)
		? lifter.lift.find((item) => item.lift === 'bench' && item.liftNumber === 3)
				?.weight || ''
		: ''

	const isBenchFour = round === '4' && lift === 'bench'
	const lifterBenchFourLift = lifter?.lift?.find(
		(item) => item.lift === 'bench' && item.liftNumber === 4,
	)
	const lifterBenchFour = lifter?.lift?.find(
		(item) => item.lift === 'bench' && item.liftNumber === 4,
	)
		? lifter.lift.find((item) => item.lift === 'bench' && item.liftNumber === 4)
				?.weight || ''
		: ''

	const isDeadliftOne = round === '1' && lift === 'deadlift'
	const lifterDeadliftOneLift = lifter?.lift?.find(
		(item) => item.lift === 'deadlift' && item.liftNumber === 1,
	)
	const lifterDeadliftOne = lifter?.lift?.find(
		(item) => item.lift === 'deadlift' && item.liftNumber === 1,
	)
		? lifter.lift.find(
				(item) => item.lift === 'deadlift' && item.liftNumber === 1,
			)?.weight || ''
		: ''

	const isDeadliftTwo = round === '2' && lift === 'deadlift'
	const lifterDeadliftTwoLift = lifter?.lift?.find(
		(item) => item.lift === 'deadlift' && item.liftNumber === 2,
	)
	const lifterDeadliftTwo = lifter?.lift?.find(
		(item) => item.lift === 'deadlift' && item.liftNumber === 2,
	)
		? lifter.lift.find(
				(item) => item.lift === 'deadlift' && item.liftNumber === 2,
			)?.weight || ''
		: ''

	const isDeadliftThree = round === '3' && lift === 'deadlift'
	const lifterDeadliftThreeLift = lifter?.lift?.find(
		(item) => item.lift === 'deadlift' && item.liftNumber === 3,
	)
	const lifterDeadliftThree = lifter?.lift?.find(
		(item) => item.lift === 'deadlift' && item.liftNumber === 3,
	)
		? lifter.lift.find(
				(item) => item.lift === 'deadlift' && item.liftNumber === 3,
			)?.weight || ''
		: ''

	const isDeadliftFour = round === '4' && lift === 'deadlift'
	const lifterDeadliftFourLift = lifter?.lift?.find(
		(item) => item.lift === 'deadlift' && item.liftNumber === 4,
	)
	const lifterDeadliftFour = lifter?.lift?.find(
		(item) => item.lift === 'deadlift' && item.liftNumber === 4,
	)
		? lifter.lift.find(
				(item) => item.lift === 'deadlift' && item.liftNumber === 4,
			)?.weight || ''
		: ''

	const ctx = api.useUtils()
	const [userName, setUserName] = useState(lifter.user?.name || '')
	const [isOpenUserName, setIsOpenUserName] = useState(false)

	const [userGender, setUserGender] = useState(lifter.user?.gender || '')
	const [isOpenUserGender, setIsOpenUserGender] = useState(false)

	const [userEquip, setUserEquip] = useState(lifter.equipment || '')
	const [isOpenUserEquip, setIsOpenUserEquip] = useState(false)

	const [userWC, setUserWC] = useState(lifter.wc || '')
	const [isOpenUserWC, setIsOpenUserWC] = useState(false)

	const { mutate: updateName } = api.compEntry.updateUserName.useMutation({
		onSettled: () => {
			ctx.competition.getCompetitionByUuid.refetch()
			setIsOpenUserName(false)
		},
	})
	const { mutate: updateGender } = api.compEntry.updateUserGender.useMutation({
		onSettled: () => {
			ctx.competition.getCompetitionByUuid.refetch()
			setIsOpenUserGender(false)
		},
	})
	const { mutate: updateEquipment } = api.compEntry.updateEquipment.useMutation(
		{
			onSettled: () => {
				ctx.competition.getCompetitionByUuid.refetch()
				setIsOpenUserEquip(false)
			},
		},
	)
	const { mutate: updateWC } = api.compEntry.updateWC.useMutation({
		onSettled: () => {
			ctx.competition.getCompetitionByUuid.refetch()
			setIsOpenUserWC(false)
		},
	})

	return (
		<TableRow
			key={lifter.id}
			className={cn(
				isLifter ? 'bg-secondary/30  border-2 border-blue-400/50' : '',
				'py-0',
			)}
		>
			<Dialog
				open={isOpenUserName}
				onOpenChange={(open) => {
					setIsOpenUserName(open)
				}}
			>
				<DialogTrigger asChild>
					<Cell className='p-0 tracking-tightest xl:tracking-tight  py-0 xl:p-2 truncate max-w-[80px] xl:max-w-[155px] capitalize h-8 lg:h-12 cursor-pointer'>
						{lifterName}
					</Cell>
				</DialogTrigger>
				<DialogContent
					onOpenAutoFocus={(e) => {
						e.preventDefault()
					}}
				>
					<DialogHeader>
						<DialogTitle>Update Name</DialogTitle>
						<DialogDescription>new name</DialogDescription>
					</DialogHeader>
					<Input
						value={userName}
						onChange={(e) => {
							setUserName(e.target.value)
						}}
					/>
					<Button
						className='w-full'
						onClick={() => {
							if (!userName) return
							if (!lifter.user?.id) return
							updateName({
								id: lifter.user.id,
								userName: userName,
							})
						}}
					>
						Update
					</Button>
				</DialogContent>
			</Dialog>
			<Dialog
				open={isOpenUserGender}
				onOpenChange={(open) => {
					setIsOpenUserGender(open)
				}}
			>
				<DialogTrigger asChild>
					<Cell
						className={cn(
							'p-0  h-8 xl:h-10 py-0 xl:p-2 text-center text-sm cursor-pointer',
							gender === 'm' ? 'text-sky-400' : 'text-rose-400',
						)}
					>
						{gender}
					</Cell>
				</DialogTrigger>
				<DialogContent
					onOpenAutoFocus={(e) => {
						e.preventDefault()
					}}
				>
					<DialogHeader>
						<DialogTitle>Update gender</DialogTitle>
						<DialogDescription>new gender</DialogDescription>
					</DialogHeader>
					<Input
						value={userGender}
						onChange={(e) => {
							setUserGender(e.target.value)
						}}
					/>
					<Button
						className='w-full'
						onClick={() => {
							if (!userGender) return
							if (!lifter.user?.id) return
							updateGender({
								userGender: userGender,
								userId: lifter.user.id,
							})
						}}
					>
						Update
					</Button>
				</DialogContent>
			</Dialog>
			<Dialog
				open={isOpenUserEquip}
				onOpenChange={(open) => {
					setIsOpenUserEquip(open)
				}}
			>
				<DialogTrigger asChild>
					<Cell className='p-0  h-8 xl:h-10 py-0 xl:p-2  text-center text-sm cursor-pointer'>
						{lifterEquip}
					</Cell>
				</DialogTrigger>
				<DialogContent
					onOpenAutoFocus={(e) => {
						e.preventDefault()
					}}
				>
					<DialogHeader>
						<DialogTitle>Update equipment</DialogTitle>
						<DialogDescription>new equipment</DialogDescription>
					</DialogHeader>
					<Input
						value={userEquip}
						onChange={(e) => {
							setUserEquip(e.target.value)
						}}
					/>
					<Button
						className='w-full'
						onClick={() => {
							if (!userEquip) return
							if (!lifter.user?.id) return
							updateEquipment({
								equipment: userEquip,
								userId: lifter.user.id,
							})
						}}
					>
						Update
					</Button>
				</DialogContent>
			</Dialog>
			<Dialog
				open={isOpenUserWC}
				onOpenChange={(open) => {
					setIsOpenUserWC(open)
				}}
			>
				<DialogTrigger asChild>
					<Cell className='p-0  h-8 xl:h-10 py-0 xl:p-2 cursor-pointer'>
						<Badge className='w-9  xl:w-12 items-center justify-center'>
							{lifterWc === 'SHWkg' ? 'SHW' : lifterWc}
						</Badge>
					</Cell>
				</DialogTrigger>
				<DialogContent
					onOpenAutoFocus={(e) => {
						e.preventDefault()
					}}
				>
					<DialogHeader>
						<DialogTitle>Update wc</DialogTitle>
						<DialogDescription>new wc</DialogDescription>
					</DialogHeader>
					<Input
						value={userWC}
						onChange={(e) => {
							setUserWC(e.target.value)
						}}
					/>
					<Button
						className='w-full'
						onClick={() => {
							if (!userWC) return
							if (!lifter.user?.id) return
              updateWC({
                wc: userWC,
                userId: lifter.user.id,
              })
						}}
					>
						Update
					</Button>
				</DialogContent>
			</Dialog>
			{lifterSquatOneLift ? (
				<>
					<SquatRackHeight height={lifterSquatRackHeight} entryId={lifterId} />
					<Lift
						bracket={bracket}
						lifter={lifter}
						input={lifterSquatOne}
						title='Squat 1'
						lift={lifterSquatOneLift}
						isHighlighted={isSquatOne}
						liftName='squat'
						liftNumber={1}
					/>
					<Lift
						bracket={bracket}
						lifter={lifter}
						input={lifterSquatTwo}
						title='Squat 2'
						previousLift={lifterSquatOneLift}
						lift={lifterSquatTwoLift}
						isHighlighted={isSquatTwo}
						liftName='squat'
						liftNumber={2}
					/>
					<Lift
						bracket={bracket}
						lifter={lifter}
						input={lifterSquatThree}
						title='Squat 3'
						previousLift={lifterSquatTwoLift}
						lift={lifterSquatThreeLift}
						isHighlighted={isSquatThree}
						liftName='squat'
						liftNumber={3}
					/>
					<Lift
						bracket={bracket}
						lifter={lifter}
						input={lifterSquatFour}
						title='Squat 4'
						previousLift={lifterSquatThreeLift}
						lift={lifterSquatFourLift}
						isHighlighted={isSquatFour}
						liftName='squat'
						liftNumber={4}
					/>
				</>
			) : (
				<>
					<Cell className=''>
						<div className='flex justify-center items-center h-full w-full'>
							<div className='border-fuchsia-800 bg-fuchsia-800 rounded-full h-1 w-1' />
						</div>
					</Cell>
					<Cell className=''>
						<div className='flex justify-center items-center h-full w-full'>
							<div className='border-fuchsia-800 bg-fuchsia-800 rounded-full h-1 w-1' />
						</div>
					</Cell>
					<Cell className=''>
						<div className='flex justify-center items-center h-full w-full'>
							<div className='border-fuchsia-800 bg-fuchsia-800 rounded-full h-1 w-1' />
						</div>
					</Cell>
					<Cell className=''>
						<div className='flex justify-center items-center h-full w-full'>
							<div className='border-fuchsia-800 bg-fuchsia-800 rounded-full h-1 w-1' />
						</div>
					</Cell>
					<Cell className=''>
						<div className='flex justify-center items-center h-full w-full'>
							<div className='border-fuchsia-800 bg-fuchsia-800 rounded-full h-1 w-1' />
						</div>
					</Cell>
				</>
			)}
			{lifterBenchOneLift ? (
				<>
					<BenchRackHeight height={lifterBenchRackHeight} entryId={lifterId} />
					<Lift
						bracket={bracket}
						lifter={lifter}
						input={lifterBenchOne}
						title='Bench 1'
						lift={lifterBenchOneLift}
						isHighlighted={isBenchOne}
						liftName='bench'
						liftNumber={1}
					/>
					<Lift
						bracket={bracket}
						lifter={lifter}
						input={lifterBenchTwo}
						title='Bench 2'
						previousLift={lifterBenchOneLift}
						lift={lifterBenchTwoLift}
						isHighlighted={isBenchTwo}
						liftName='bench'
						liftNumber={2}
					/>
					<Lift
						bracket={bracket}
						lifter={lifter}
						input={lifterBenchThree}
						title='Bench 3'
						previousLift={lifterBenchTwoLift}
						lift={lifterBenchThreeLift}
						isHighlighted={isBenchThree}
						liftName='bench'
						liftNumber={3}
					/>
					<Lift
						bracket={bracket}
						lifter={lifter}
						input={lifterBenchFour}
						title='Bench 4'
						previousLift={lifterBenchThreeLift}
						lift={lifterBenchFourLift}
						isHighlighted={isBenchFour}
						liftName='bench'
						liftNumber={4}
					/>
				</>
			) : (
				<>
					<Cell className=''>
						<div className='flex justify-center items-center h-full w-full'>
							<div className='border-fuchsia-800 bg-fuchsia-800 rounded-full h-1 w-1' />
						</div>
					</Cell>
					<Cell className=''>
						<div className='flex justify-center items-center h-full w-full'>
							<div className='border-fuchsia-800 bg-fuchsia-800 rounded-full h-1 w-1' />
						</div>
					</Cell>
					<Cell className=''>
						<div className='flex justify-center items-center h-full w-full'>
							<div className='border-fuchsia-800 bg-fuchsia-800 rounded-full h-1 w-1' />
						</div>
					</Cell>
					<Cell className=''>
						<div className='flex justify-center items-center h-full w-full'>
							<div className='border-fuchsia-800 bg-fuchsia-800 rounded-full h-1 w-1' />
						</div>
					</Cell>
					<Cell className=''>
						<div className='flex justify-center items-center h-full w-full'>
							<div className='border-fuchsia-800 bg-fuchsia-800 rounded-full h-1 w-1' />
						</div>
					</Cell>
				</>
			)}
			{lifterDeadliftOneLift ? (
				<>
					<Lift
						bracket={bracket}
						lifter={lifter}
						input={lifterDeadliftOne}
						title='Deadlift 1'
						lift={lifterDeadliftOneLift}
						isHighlighted={isDeadliftOne}
						liftName='deadlift'
						liftNumber={1}
					/>
					<Lift
						bracket={bracket}
						lifter={lifter}
						input={lifterDeadliftTwo}
						title='Deadlift 2'
						previousLift={lifterDeadliftOneLift}
						lift={lifterDeadliftTwoLift}
						isHighlighted={isDeadliftTwo}
						liftName='deadlift'
						liftNumber={2}
					/>
					<Lift
						bracket={bracket}
						lifter={lifter}
						input={lifterDeadliftThree}
						title='Deadlift 3'
						previousLift={lifterDeadliftTwoLift}
						lift={lifterDeadliftThreeLift}
						isHighlighted={isDeadliftThree}
						liftName='deadlift'
						liftNumber={3}
					/>
					<Lift
						bracket={bracket}
						lifter={lifter}
						input={lifterDeadliftFour}
						title='Deadlift 4'
						previousLift={lifterDeadliftThreeLift}
						lift={lifterDeadliftFourLift}
						isHighlighted={isDeadliftFour}
						liftName='deadlift'
						liftNumber={4}
					/>
				</>
			) : (
				<>
					<Cell className=''>
						<div className='flex justify-center items-center h-full w-full'>
							<div className='border-fuchsia-800 bg-fuchsia-800 rounded-full h-1 w-1' />
						</div>
					</Cell>
					<Cell className=''>
						<div className='flex justify-center items-center h-full w-full'>
							<div className='border-fuchsia-800 bg-fuchsia-800 rounded-full h-1 w-1' />
						</div>
					</Cell>
					<Cell className=''>
						<div className='flex justify-center items-center h-full w-full'>
							<div className='border-fuchsia-800 bg-fuchsia-800 rounded-full h-1 w-1' />
						</div>
					</Cell>
					<Cell className=''>
						<div className='flex justify-center items-center h-full w-full'>
							<div className='border-fuchsia-800 bg-fuchsia-800 rounded-full h-1 w-1' />
						</div>
					</Cell>
				</>
			)}
		</TableRow>
	)
}

export default CompTableRow
