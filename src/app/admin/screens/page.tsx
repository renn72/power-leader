'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import { wcFData, wcMData } from '~/lib/store'
import type { GetCompetitionByUuid } from '~/lib/types'
import { api } from '~/trpc/react'
import { CirclePlus, Minus, PlusIcon, RefreshCcw } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

const ages = [
	{
		name: 'teen',
		min: 14,
		max: 16,
	},
	{
		name: 'sub-junior',
		min: 17,
		max: 19,
	},
	{
		name: 'junior',
		min: 20,
		max: 23,
	},
	{
		name: 'open',
		min: 24,
		max: 39,
	},
	{
		name: 'm1',
		min: 40,
		max: 49,
	},
	{
		name: 'm2',
		min: 50,
		max: 59,
	},
	{
		name: 'm3',
		min: 60,
		max: 69,
	},
	{
		name: 'm4',
		min: 70,
		max: 79,
	},
	{
		name: 'm5',
		min: 80,
		max: 999,
	},
]
const screens = [
	'screen1',
	'screen2',
	'screen3',
	'screen4',
	'screen5',
	'screen6',
]

const types = [
	'nil',
	'screen',
	'loading',
	'comp-bracket',
	'squat-bracket',
	'bench-bracket',
	'dead-bracket',
  'board-all',
	'board-teen-b',
	'board-teen-g',
	'board-open-b',
	'board-open-g',
	'board-master-b',
	'board-master-g',
	'board-results',
]

const NumberInput = ({
	value,
	setValue,
	fixed: _fixed = 0,
	scale: _scale,
	postfix = '',
}: {
	value: number | null
	setValue: (value: number) => void
	fixed?: number
	scale: number
	postfix?: string
}) => {
	const fixed = _fixed
	const scale = _scale
	return (
		<div className='w-60 relative border rounded-lg h-10 flex items-center'>
			<Input
				placeholder='...'
				className={cn(
					'relative w-full text-2xl font-medium rounded-lg text-center h-min border-none outline-none rounded-none border-l-0 px-0 mx-2',
					' focus-visible:ring-0 focus:border-none focus:border-0 focus:shadow-none py-0 active:border-0 active:ring-0 focus:ring-0',
					'focus-visible:ring-none',
				)}
				type='number'
				value={value && value % 1 === 0 ? value : (value?.toFixed(fixed) ?? '')}
				onChange={(e) => {
					setValue(Number(e.target.value))
				}}
			/>

			<div className='absolute right-16 top-1/2 -translate-y-1/2 text-sm text-muted-foreground flex gap-0 items-start pt-[2px]'>
				{postfix}
			</div>

			<div
				onClick={() => {
					if (!value) {
						setValue(scale)
						return
					}
					const m = Math.floor(Number(value) / scale)
					setValue(Number((m * scale).toFixed(0)) + scale)
				}}
				className='absolute right-0 top-1/2 -translate-y-1/2 text-xs text-secondary-foreground flex gap-0 items-start border-l active:bg-primary/60 rounded-r-lg'
			>
				<div className='h-10 w-14 flex items-center justify-center scale-75'>
					<PlusIcon size={28} />
				</div>
			</div>
			<div
				onClick={() => {
					if (!value) return
					const m = Math.floor(Number(value) / scale)
					setValue(Number((m * scale).toFixed(0)) - scale)
				}}
				className='absolute left-0 top-1/2 -translate-y-1/2 text-xs text-secondary-foreground flex gap-0 items-start border-r active:bg-primary/30 rounded-l-lg'
			>
				<div className='h-10 w-14 flex items-center justify-center active:scale-75'>
					<Minus size={28} />
				</div>
			</div>
		</div>
	)
}

const Screen = ({
	screen,
	index,
	screenType,
	screenSize,
	uuid,
	compId,
}: {
	screen: string
	index: number
	screenType: string
	screenSize: string
	uuid: string
	compId: number
}) => {
	const [type, setType] = useState(() => screenType || 'nil')
	const [size, setSize] = useState(() => Number(screenSize))

	const ctx = api.useUtils()
	const { mutate: updateScreen } = api.competitionDay.updateScreen.useMutation({
		onError: (err) => {
			console.log(err)
		},
		onSuccess: (e) => {
			console.log(e)
			toast.success('Screen saved!')
			void ctx.competition.invalidate()
		},
	})

	return (
		<div className='flex flex-col items-center justify-center gap-2 rounded-lg border p-2 min-h-[10vh] w-full'>
			<div className='flex flex-col items-center justify-start gap-2'>
				<div className='text-2xl font-bold'>Screen {index + 1}</div>
				<Select onValueChange={setType} value={type} defaultValue={screenType}>
					<SelectTrigger
						className={cn(
							'w-full capitalize text-xl h-10 font-bold ',
							type.toLowerCase() === 'nil'
								? 'text-muted-foreground/60 font-normal'
								: '',
						)}
					>
						<SelectValue placeholder={screenType} />
					</SelectTrigger>
					<SelectContent>
						{types.map((t) => (
							<SelectItem key={t} value={t} className='capitalize'>
								{t}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<NumberInput value={size} setValue={setSize} fixed={0} scale={5} />
				<div className='flex gap-4 w-full justify-around'>
					<Button
						size='lg'
						onClick={() => {
							updateScreen({
								id: compId,
								uuid: uuid,
								[`${screen}`]: type,
								[`${screen}Size`]: size.toFixed(0),
							})
						}}
					>
						Save
					</Button>
					<Button
						variant='secondary'
						size='lg'
						onClick={() => {
							setSize(1)
							setType('nil')
						}}
					>
						Clear
					</Button>
				</div>
			</div>
		</div>
	)
}

const ResultsAge = ({ competition }: { competition: GetCompetitionByUuid }) => {
	const [age, setAge] = useState(() => competition.compDayInfo.resultAge || '')
	const ctx = api.useUtils()
	const { mutate: updateScreen } = api.competitionDay.updateScreen.useMutation({
		onError: (err) => {
			console.log(err)
		},
		onSuccess: (e) => {
			console.log(e)
			toast.success('Screen saved!')
			void ctx.competition.invalidate()
		},
	})

	return (
		<div className='flex flex-col items-center justify-center gap-4 rounded-lg border p-4 min-h-[10vh]'>
			<div className='flex flex-col items-center justify-start gap-4'>
				<div className='text-xl font-bold'>Results Age</div>
				<Select
					onValueChange={setAge}
					value={age}
					defaultValue={competition.compDayInfo.resultAge || ''}
				>
					<SelectTrigger
						className={cn(
							'w-full capitalize text-2xl h-10 font-bold ',
							age.toLowerCase() === 'open'
								? 'text-muted-foreground/60 font-normal'
								: '',
						)}
					>
						<SelectValue placeholder={age} />
					</SelectTrigger>
					<SelectContent>
						{ages.map((a) => (
							<SelectItem key={a.name} value={a.name} className='capitalize'>
								{a.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<div className='flex gap-4 w-full justify-around'>
					<Button
						size='sm'
						onClick={() => {
							updateScreen({
								id: competition.id,
								uuid: competition.uuid || '',
								resultAge: age,
								resultsReveal: '',
							})
						}}
					>
						Save
					</Button>
					<Button
						size='sm'
						onClick={() => {
							updateScreen({
								id: competition.id,
								uuid: competition.uuid || '',
								resultAge: '',
								resultsReveal: '',
							})
							setAge('')
						}}
					>
						Clear
					</Button>
				</div>
			</div>
		</div>
	)
}

const ResultsLift = ({
	competition,
  selectLifts
}: {
	competition: GetCompetitionByUuid
    selectLifts: string[]
}) => {
	const [gender, setGender] = useState(
		() => competition.compDayInfo.resultsLift || '',
	)
	const ctx = api.useUtils()
	const { mutate: updateScreen } = api.competitionDay.updateScreen.useMutation({
		onError: (err) => {
			console.log(err)
		},
		onSuccess: (e) => {
			console.log(e)
			toast.success('Screen saved!')
			void ctx.competition.invalidate()
		},
	})
	return (
		<div className='flex flex-col items-center justify-center gap-4 rounded-lg border p-4 min-h-[10vh]'>
			<div className='flex flex-col items-center justify-start gap-4'>
				<div className='text-xl font-bold'>Results Lift</div>
				<Select
					onValueChange={setGender}
					value={gender}
					defaultValue={competition.compDayInfo.resultsLift || ''}
				>
					<SelectTrigger
						className={cn('w-full capitalize text-2xl h-10 font-bold ')}
					>
						<SelectValue placeholder={gender} />
					</SelectTrigger>
					<SelectContent>
						{selectLifts.map((a) => (
							<SelectItem key={a} value={a} className='capitalize'>
								{a}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<div className='flex gap-4 w-full justify-around'>
					<Button
						size='sm'
						onClick={() => {
							updateScreen({
								id: competition.id,
								uuid: competition.uuid || '',
								resultsLift: gender,
								resultsReveal: '',
							})
						}}
					>
						Save
					</Button>
					<Button
						size='sm'
						onClick={() => {
							updateScreen({
								id: competition.id,
								uuid: competition.uuid || '',
								resultsLift: '',
								resultsReveal: '',
							})
							setGender('')
						}}
					>
						Clear
					</Button>
				</div>
			</div>
		</div>
	)
}
const ResultsGender = ({
	competition,
}: {
	competition: GetCompetitionByUuid
}) => {
	const [gender, setGender] = useState(
		() => competition.compDayInfo.resultGender || '',
	)
	const ctx = api.useUtils()
	const { mutate: updateScreen } = api.competitionDay.updateScreen.useMutation({
		onError: (err) => {
			console.log(err)
		},
		onSuccess: (e) => {
			console.log(e)
			toast.success('Screen saved!')
			void ctx.competition.invalidate()
		},
	})
	return (
		<div className='flex flex-col items-center justify-center gap-4 rounded-lg border p-4 min-h-[10vh]'>
			<div className='flex flex-col items-center justify-start gap-4'>
				<div className='text-xl font-bold'>Results Gender</div>
				<Select
					onValueChange={setGender}
					value={gender}
					defaultValue={competition.compDayInfo.resultGender || ''}
				>
					<SelectTrigger
						className={cn(
							'w-full capitalize text-2xl h-10 font-bold ',
							gender.toLowerCase() === 'open'
								? 'text-muted-foreground/60 font-normal'
								: '',
						)}
					>
						<SelectValue placeholder={gender} />
					</SelectTrigger>
					<SelectContent>
						{['male', 'female'].map((a) => (
							<SelectItem key={a} value={a} className='capitalize'>
								{a}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<div className='flex gap-4 w-full justify-around'>
					<Button
						size='sm'
						onClick={() => {
							updateScreen({
								id: competition.id,
								uuid: competition.uuid || '',
								resultGender: gender,
								resultsReveal: '',
							})
						}}
					>
						Save
					</Button>
					<Button
						size='sm'
						onClick={() => {
							updateScreen({
								id: competition.id,
								uuid: competition.uuid || '',
								resultGender: '',
								resultsReveal: '',
							})
							setGender('')
						}}
					>
						Clear
					</Button>
				</div>
			</div>
		</div>
	)
}

const ResultsReveal = ({
	competition,
}: {
	competition: GetCompetitionByUuid
}) => {
	const [reveal, setReveal] = useState(
		() => competition.compDayInfo.resultsReveal || 'hidden',
	)
	useEffect(() => {
		setReveal(competition.compDayInfo.resultsReveal || 'hidden')
	}, [competition])

	const ctx = api.useUtils()
	const { mutate: updateScreen } = api.competitionDay.updateScreen.useMutation({
		onError: (err) => {
			console.log(err)
		},
		onSuccess: (e) => {
			console.log(e)
			toast.success('Screen saved!')
			ctx.competition.invalidate()
		},
	})
	return (
		<div className='flex flex-col items-center justify-center gap-4 rounded-lg border p-4 min-h-[18vh] w-72'>
			<div className='flex flex-col items-center justify-start gap-4'>
				<div className='text-xl font-bold'>Reveal</div>
				<div className='flex gap-4 w-40 justify-around w-full'>
					<Select
						onValueChange={setReveal}
						value={reveal}
						defaultValue={competition.compDayInfo.resultsReveal || 'hidden'}
					>
						<SelectTrigger
							className={cn('w-full capitalize text-2xl h-10 font-bold ')}
						>
							<SelectValue placeholder={reveal} />
						</SelectTrigger>
						<SelectContent>
							{['hidden', '3', '2', '1'].map((a) => (
								<SelectItem key={a} value={a} className='capitalize'>
									{a}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button
						size='sm'
						variant='ghost'
						onClick={() => {
							let r = 'hidden'
							if (reveal === 'hidden') r = '3'
							if (reveal === '3') r = '2'
							if (reveal === '2') r = '1'
							updateScreen({
								id: competition.id,
								uuid: competition.uuid || '',
								resultsReveal: r,
							})
							setReveal(r)
						}}
					>
						<CirclePlus size={36} />
					</Button>
				</div>
				<div className='flex gap-4 w-full justify-around'>
					<Button
						size='sm'
						onClick={() => {
							updateScreen({
								id: competition.id,
								uuid: competition.uuid || '',
								resultsReveal: reveal,
							})
						}}
					>
						Save
					</Button>
					<Button
						size='sm'
						onClick={() => {
							updateScreen({
								id: competition.id,
								uuid: competition.uuid || '',
								resultsReveal: '',
							})
							setReveal('hidden')
						}}
					>
						Clear
					</Button>
				</div>
			</div>
		</div>
	)
}
const ResultsWC = ({
	competition,
	wClasses,
}: {
	competition: GetCompetitionByUuid
	wClasses: string[]
}) => {
	const [wc, setWC] = useState(() => competition.compDayInfo.resultWC || '')
	const ctx = api.useUtils()
	const { mutate: updateScreen } = api.competitionDay.updateScreen.useMutation({
		onError: (err) => {
			console.log(err)
		},
		onSuccess: (e) => {
			console.log(e)
			toast.success('Screen saved!')
			void ctx.competition.invalidate()
		},
	})
	return (
		<div className='flex flex-col items-center justify-center gap-4 rounded-lg border p-4 min-h-[10vh]'>
			<div className='flex flex-col items-center justify-start gap-4'>
				<div className='text-xl font-bold'>Results WC</div>
				<Select
					onValueChange={setWC}
					value={wc}
					defaultValue={competition.compDayInfo.resultWC || ''}
				>
					<SelectTrigger
						className={cn(
							'w-full capitalize text-2xl h-10 font-bold ',
							wc.toLowerCase() === 'open'
								? 'text-muted-foreground/60 font-normal'
								: '',
						)}
					>
						<SelectValue placeholder={wc} />
					</SelectTrigger>
					<SelectContent>
						{wClasses.map((a) => (
							<SelectItem key={a} value={a.toString()} className='capitalize'>
								{a}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<div className='flex gap-4 w-full justify-around'>
					<Button
						size='sm'
						onClick={() => {
							updateScreen({
								id: competition.id,
								uuid: competition.uuid || '',
								resultWC: wc,
								resultsReveal: '',
							})
						}}
					>
						Save
					</Button>
					<Button
						size='sm'
						onClick={() => {
							updateScreen({
								id: competition.id,
								uuid: competition.uuid || '',
								resultWC: '',
								resultsReveal: '',
							})
							setWC('')
						}}
					>
						Clear
					</Button>
				</div>
			</div>
		</div>
	)
}

const ResultsDiv = ({ competition }: { competition: GetCompetitionByUuid }) => {
	const [div, setDiv] = useState(() => competition.compDayInfo.resultDiv || '')
	const ctx = api.useUtils()
	const { mutate: updateScreen } = api.competitionDay.updateScreen.useMutation({
		onError: (err) => {
			console.log(err)
		},
		onSuccess: (e) => {
			console.log(e)
			toast.success('Screen saved!')
			void ctx.competition.invalidate()
		},
	})
	return (
		<div className='flex flex-col items-center justify-center gap-4 rounded-lg border p-4 min-h-[10vh] ml-20'>
			<div className='flex flex-col items-center justify-start gap-4'>
				<div className='text-xl font-bold'>Results Div</div>
				<Select
					onValueChange={setDiv}
					value={div}
					defaultValue={competition.compDayInfo.resultDiv || ''}
				>
					<SelectTrigger
						className={cn('w-full capitalize text-2xl h-10 font-bold ')}
					>
						<SelectValue placeholder={div} />
					</SelectTrigger>
					<SelectContent>
						{['open', 'teen', 'master'].map((a) => (
							<SelectItem key={a} value={a} className='capitalize'>
								{a}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<div className='flex gap-4 w-full justify-around'>
					<Button
						size='sm'
						onClick={() => {
							updateScreen({
								id: competition.id,
								uuid: competition.uuid || '',
								resultDiv: div,
							})
						}}
					>
						Save
					</Button>
					<Button
						size='sm'
						onClick={() => {
							updateScreen({
								id: competition.id,
								uuid: competition.uuid || '',
								resultDiv: '',
							})
						}}
					>
						Clear
					</Button>
				</div>
			</div>
		</div>
	)
}

const Screens = () => {
	const ctx = api.useUtils()
	const { data: competition } = api.competition.get.useQuery(1, {
		refetchInterval: 1000 * 160 * 1,
	})
	if (!competition) return null

	const gender = competition.compDayInfo.resultGender
	const wc = competition.compDayInfo.resultWC

	const selectLifts = competition.entries
		.filter((entry) => gender === '' || entry.gender === gender)
		.filter((entry) => wc === '' || entry.wc === wc)
		.map((entry) => {
			let isSquat = false
			let isBench = false
			let isDeadlift = false
			entry.lift.forEach((l) => {
				if (l.lift == 'squat') isSquat = true
				if (l.lift == 'bench') isBench = true
				if (l.lift == 'deadlift') isDeadlift = true
			})
			if (isSquat && isBench && isDeadlift) return '3lift'
			if (isBench && isDeadlift) return 'pushPull'
			if (isSquat) return 'squat'
			if (isDeadlift) return 'deadlift'
			if (isBench) return 'bench'

			return '3lift'
		})
		.filter((wc, i, arr) => arr.indexOf(wc) === i)

	const wcs = competition.entries
		.filter((entry) => gender === '' || entry.gender === gender)
		.map((entry) => entry.wc || '')
		.filter((wc, i, arr) => arr.indexOf(wc) === i)
		.sort((a, b) => Number(a) - Number(b))

	return (
		<div className='max-w-screen-xl mx-auto flex flex-col my-2'>
			<div className='flex gap-4 flex-wrap justify-center mt-20 mb-10'>
				<ResultsGender competition={competition} />
				<ResultsWC competition={competition} wClasses={wcs} />
				<ResultsLift competition={competition} selectLifts={selectLifts} />
				<ResultsDiv competition={competition} />
				<ResultsAge competition={competition} />
			</div>
			<div className='flex gap-4 flex-wrap justify-center mb-40 '>
				<ResultsReveal competition={competition} />
			</div>
			<div className='max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4 relative px-4 lg:px-0'>
				<RefreshCcw
					className={cn(
						'absolute -right-10 top-0 active:scale-75 cursor-pointer transition-transform',
					)}
					onClick={() => {
						void ctx.competition.invalidate()
					}}
				/>
				{screens.map((screen, i) => {
					// @ts-ignore
					const screenType = competition?.compDayInfo?.[`${screen}`] || 'nil'
					// @ts-ignore
					const screenSize =
						// @ts-ignore
						competition?.compDayInfo?.[`${screen}Size`] || 'nil'
					return (
						<Screen
							uuid={competition?.uuid || ''}
							compId={competition.id}
							screenType={screenType}
							screenSize={screenSize}
							screen={screen}
							index={i}
							key={screen}
						/>
					)
				})}
			</div>
		</div>
	)
}

export default Screens
