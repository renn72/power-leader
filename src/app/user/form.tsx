'use client'

import { api } from '@/trpc/react'

import { useState } from 'react'

import { cn } from '@/lib/utils'
import { GetCompetitionEntryById } from '~/lib/types'
import { getAge } from '~/lib/utils'
import { Minus, PlusIcon } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

export const dynamic = 'force-dynamic'

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
  const fixed = 2
  const scale = 0.25
  return (
    <div className='w-60 relative border rounded-lg h-16 flex items-center'>
      <Input
        placeholder='...'
        className={cn(
          'relative w-full text-xl font-medium rounded-lg text-center h-min border-none outline-none rounded-none border-l-0 px-0',
          ' focus-visible:ring-0 focus:border-none focus:border-0 focus:shadow-none py-0 active:border-0 active:ring-0 focus:ring-0',
          'focus-visible:ring-none',
        )}
        type='number'
        value={value && value % 1 === 0 ? value : (value?.toFixed(fixed) ?? '')}
        onChange={(e) => {
          setValue(Number(e.target.value))
        }}
      />

      <div className='absolute right-16 top-1/2 -translate-y-1/2 text-xs text-muted-foreground flex gap-0 items-start pt-[2px]'>
        {postfix}
      </div>

      <div
        onClick={() => {
          if (!value) {
            setValue(scale)
            return
          }
          const m = Math.floor(Number(value) / scale)
          setValue(m * scale + scale)
        }}
        className='absolute right-0 top-1/2 -translate-y-1/2 text-xs text-secondary-foreground flex gap-0 items-start border-l active:bg-primary/60 rounded-r-lg'
      >
        <div className='h-16 w-14 flex items-center justify-center scale-75'>
          <PlusIcon size={24} />
        </div>
      </div>
      <div
        onClick={() => {
          if (!value) return
          const m = Math.floor(Number(value) / scale)
          setValue(m * scale - scale)
        }}
        className='absolute left-0 top-1/2 -translate-y-1/2 text-xs text-secondary-foreground flex gap-0 items-start border-r active:bg-primary/30 rounded-l-lg'
      >
        <div className='h-16 w-14 flex items-center justify-center active:scale-75'>
          <Minus size={24} />
        </div>
      </div>
    </div>
  )
}

const DialogWrapper = ({
  children,
  title,
  value,
}: {
  children: React.ReactNode
  title: string
  value: string
  fixed?: number
}) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <div
          className={cn(
            'flex gap-1 items-center justify-around flex-col bg-secondary px-4 py-1 rounded-md shadow-sm',
            'active:scale-90 active:shadow-none transition-transform cursor-pointer',
            isOpen ? 'scale-90 shadow-none' : '',
          )}
        >
          <div className='text-muted-foreground text-center text-sm font-semibold'>
            {title}
          </div>
          {value !== '' && value !== undefined && value !== null ? (
            <div className={cn('relative')}>{value}</div>
          ) : (
            <div className='text-muted-foreground'>...</div>
          )}
        </div>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault()
        }}
      >
        <div className='flex flex-col w-full relative gap-6'>{children}</div>
      </DialogContent>
    </Dialog>
  )
}

const Value = ({ value, title }: { value: string; title: string }) => {
  return (
    <div
      className={cn(
        'flex gap-1 items-center justify-around flex-col bg-secondary px-4 py-1 rounded-md shadow-sm',
        'active:scale-90 active:shadow-none transition-transform cursor-pointer',
      )}
    >
      <div className='text-muted-foreground text-center text-sm font-semibold'>
        {title}
      </div>
      <div className={cn('capitalize ')}>{value}</div>
    </div>
  )
}

const EntryForm = ({ entry }: { entry: GetCompetitionEntryById }) => {
  const ctx = api.useUtils()

  const [squatOpener, setSquatOpener] = useState<number | null>(
    Number(entry?.squatOpener) || null,
  )
  const [squatRackHeight, setSquatRackHeight] = useState<string | null>(
    entry?.squarRackHeight || null,
  )
  const [squatPB, setSquatPB] = useState<number | null>(
    Number(entry?.squatPB) || null,
  )
  const [benchOpener, setBenchOpener] = useState<number | null>(
    Number(entry?.benchOpener) || null,
  )
  const [benchRackHeight, setBenchRackHeight] = useState<string | null>(
    entry?.benchRackHeight || null,
  )
  const [benchPB, setBenchPB] = useState<number | null>(
    Number(entry?.benchPB) || null,
  )
  const [deadliftOpener, setDeadliftOpener] = useState<number | null>(
    Number(entry?.deadliftOpener) || null,
  )
  const [deadliftPB, setDeadliftPB] = useState<number | null>(
    Number(entry?.deadliftPB) || null,
  )

  const { mutate: updateSquatOpener } =
    api.compEntry.updateSquatOpener.useMutation({
      onError: (err) => {
        console.log(err)
      },
      onSuccess: () => {
        void ctx.compEntry.invalidate()
      },
    })
  const { mutate: updateSquatRackHeight } =
    api.compEntry.updateSquatRackHeight.useMutation({
      onError: (err) => {
        console.log(err)
      },
      onSuccess: () => {
        void ctx.compEntry.invalidate()
      },
    })
  const { mutate: updateSquatPB } = api.compEntry.updateSquatPB.useMutation({
    onError: (err) => {
      console.log(err)
    },
    onSuccess: () => {
      void ctx.compEntry.invalidate()
    },
  })
  const { mutate: updateBenchOpener } =
    api.compEntry.updateBenchOpener.useMutation({
      onError: (err) => {
        console.log(err)
      },
      onSuccess: () => {
        void ctx.compEntry.invalidate()
      },
    })
  const { mutate: updateBenchRackHeight } =
    api.compEntry.updateBenchRackHeight.useMutation({
      onError: (err) => {
        console.log(err)
      },
      onSuccess: () => {
        void ctx.compEntry.invalidate()
      },
    })
  const { mutate: updateBenchPB } = api.compEntry.updateBenchPB.useMutation({
    onError: (err) => {
      console.log(err)
    },
    onSuccess: () => {
      void ctx.compEntry.invalidate()
    },
  })
  const { mutate: updateDeadliftOpener } =
    api.compEntry.updateDeadliftOpener.useMutation({
      onError: (err) => {
        console.log(err)
      },
      onSuccess: () => {
        void ctx.compEntry.invalidate()
      },
    })
  const { mutate: updateDeadliftPB } =
    api.compEntry.updateDeadliftPB.useMutation({
      onError: (err) => {
        console.log(err)
      },
      onSuccess: () => {
        void ctx.compEntry.invalidate()
      },
    })

  return (
    <div className='flex flex-col gap-2 px-4'>
      <div className='flex gap-4 w-full justify-around'>
        <Value
          title='Name'
          value={entry.user?.name || ''}
        />
        <Value
          title='Gender'
          value={entry?.gender || ''}
        />
        <Value
          title='Age'
          value={getAge(entry.birthDate, entry.competition?.date).toString()}
        />
      </div>
      <div className='flex gap-4 w-full justify-around'>
        <Value
          title='Category'
          value={entry.compEntryToDivisions?.[0]?.division?.name || ''}
        />
        <Value
          title='Div'
          value={entry?.notes || ''}
        />
        <Value
          title='Equipment'
          value={entry?.equipment || ''}
        />
      </div>
      <div className='flex flex-col gap-3 p-2 border border-border rounded-xl'>
        <div className='flex gap-4 w-full justify-around font-bold'>Squat</div>
        <div className='grid grid-cols-3 gap-4 w-full justify-around'>
          <DialogWrapper
            title='Opener'
            value={entry?.squatOpener || ''}
          >
            <DialogHeader>
              <DialogTitle>Squat Opener</DialogTitle>
              <DialogDescription>Enter your Squat Opener</DialogDescription>
            </DialogHeader>

            <div className='flex justify-center '>
              <NumberInput
                value={squatOpener}
                setValue={setSquatOpener}
                fixed={2}
                scale={0.25}
                postfix='kg'
              />
            </div>
            <div className='flex  w-full items-center justify-around'>
              <DialogClose asChild>
                <div className='flex  w-full items-center justify-around'>
                  <Button
                    variant='default'
                    size='lg'
                    onClick={(e) => {
                      if (Number(squatOpener) % 0.25 !== 0) {
                        e.preventDefault()
                        toast.error(
                          'Please enter a number in 0.25kg increments',
                        )
                        return
                      }
                      updateSquatOpener({
                        id: entry.id,
                        squatOpener: squatOpener?.toString() || '',
                        userId: entry.user?.id || 0,
                        userName: entry.user?.name || '',
                      })
                    }}
                  >
                    Save
                  </Button>
                </div>
              </DialogClose>
              <Button
                variant='secondary'
                size='lg'
                onClick={() => {
                  setSquatOpener(null)
                }}
              >
                Clear
              </Button>
            </div>
          </DialogWrapper>
          <DialogWrapper
            title='Rack'
            value={entry?.squarRackHeight || ''}
          >
            <DialogHeader>
              <DialogTitle>Squat Rack Height</DialogTitle>
              <DialogDescription>
                Enter your Squat Rack Height, your pin height and if you want
                the arms 'in' or 'out', <br /> eg. '12in' or '4out'
              </DialogDescription>
              <DialogDescription></DialogDescription>
            </DialogHeader>

            <div className='flex justify-center '>
              <Input
                placeholder='eg. 12in or 4out'
                value={squatRackHeight ?? ''}
                onChange={(e) => {
                  setSquatRackHeight(e.target.value)
                }}
              />
            </div>
            <div className='flex  w-full items-center justify-around'>
              <DialogClose asChild>
                <div className='flex  w-full items-center justify-around'>
                  <Button
                    variant='default'
                    size='lg'
                    onClick={(e) => {
                      updateSquatRackHeight({
                        id: entry.id,
                        squatRackHeight: squatRackHeight?.toString() || '',
                        userId: entry.user?.id || 0,
                        userName: entry.user?.name || '',
                      })
                    }}
                  >
                    Save
                  </Button>
                </div>
              </DialogClose>
              <Button
                variant='secondary'
                size='lg'
                onClick={() => {
                  setSquatRackHeight(null)
                }}
              >
                Clear
              </Button>
            </div>
          </DialogWrapper>
          <DialogWrapper
            title='PB'
            value={entry?.squatPB || ''}
          >
            <DialogHeader>
              <DialogTitle>Personal Best</DialogTitle>
              <DialogDescription>Enter your PB</DialogDescription>
            </DialogHeader>

            <div className='flex justify-center '>
              <NumberInput
                value={squatPB}
                setValue={setSquatPB}
                fixed={2}
                scale={0.25}
                postfix='kg'
              />
            </div>
            <div className='flex  w-full items-center justify-around'>
              <DialogClose asChild>
                <div className='flex  w-full items-center justify-around'>
                  <Button
                    variant='default'
                    size='lg'
                    onClick={(e) => {
                      updateSquatPB({
                        id: entry.id,
                        squatPB: squatPB?.toString() || '',
                        userId: entry.user?.id || 0,
                        userName: entry.user?.name || '',
                      })
                    }}
                  >
                    Save
                  </Button>
                </div>
              </DialogClose>
              <Button
                variant='secondary'
                size='lg'
                onClick={() => {
                  setSquatPB(null)
                }}
              >
                Clear
              </Button>
            </div>

          </DialogWrapper>
        </div>
      </div>
      <div className='flex flex-col gap-3 p-2 border border-border rounded-xl'>
        <div className='flex gap-4 w-full justify-around font-bold'>Bench</div>
        <div className='grid grid-cols-3 gap-4 w-full justify-around'>
          <DialogWrapper
            title='Opener'
            value={entry?.benchOpener || ''}
          >
            <DialogHeader>
              <DialogTitle>Bench Opener</DialogTitle>
              <DialogDescription>Enter your Bench Opener</DialogDescription>
            </DialogHeader>

            <div className='flex justify-center '>
              <NumberInput
                value={benchOpener}
                setValue={setBenchOpener}
                fixed={1}
                scale={0.1}
                postfix='kg'
              />
            </div>
            <div className='flex  w-full items-center justify-around'>
              <DialogClose asChild>
                <div className='flex  w-full items-center justify-around'>
                  <Button
                    variant='default'
                    size='lg'
                    onClick={(e) => {
                      if (Number(benchOpener) % 0.25 !== 0) {
                        e.preventDefault()
                        toast.error(
                          'Please enter a number in 0.25kg increments',
                        )
                        return
                      }
                      updateBenchOpener({
                        id: entry.id,
                        benchOpener: benchOpener?.toString() || '',
                        userId: entry.user?.id || 0,
                        userName: entry.user?.name || '',
                      })
                    }}
                  >
                    Save
                  </Button>
                </div>
              </DialogClose>
              <Button
                variant='secondary'
                size='lg'
                onClick={() => {
                  setBenchOpener(null)
                }}
              >
                Clear
              </Button>
            </div>

          </DialogWrapper>
          <DialogWrapper
            title='Rack'
            value={entry?.benchRackHeight || ''}
          >
            <DialogHeader>
              <DialogTitle>Bench Rack Height</DialogTitle>
              <DialogDescription>
                Enter your Bench Rack Height,(safety is optional). e.g. 8/4, or just 8 if you don't want the safety
              </DialogDescription>
              <DialogDescription></DialogDescription>
            </DialogHeader>

            <div className='flex justify-center '>
              <Input
                placeholder='eg. 8/4 or 8'
                value={benchRackHeight ?? ''}
                onChange={(e) => {
                  setBenchRackHeight(e.target.value)
                }}
              />
            </div>
            <div className='flex  w-full items-center justify-around'>
              <DialogClose asChild>
                <div className='flex  w-full items-center justify-around'>
                  <Button
                    variant='default'
                    size='lg'
                    onClick={(e) => {
                      updateBenchRackHeight({
                        id: entry.id,
                        benchRackHeight: benchRackHeight?.toString() || '',
                        userId: entry.user?.id || 0,
                        userName: entry.user?.name || '',
                      })
                    }}
                  >
                    Save
                  </Button>
                </div>
              </DialogClose>
              <Button
                variant='secondary'
                size='lg'
                onClick={() => {
                  setBenchRackHeight(null)
                }}
              >
                Clear
              </Button>
            </div>

          </DialogWrapper>
          <DialogWrapper
            title='PB'
            value={entry?.benchPB || ''}
          >
            <DialogHeader>
              <DialogTitle>Personal Best</DialogTitle>
              <DialogDescription>Enter your PB</DialogDescription>
            </DialogHeader>

            <div className='flex justify-center '>
              <NumberInput
                value={benchPB}
                setValue={setBenchPB}
                fixed={1}
                scale={0.1}
                postfix='kg'
              />
            </div>
            <div className='flex  w-full items-center justify-around'>
              <DialogClose asChild>
                <div className='flex  w-full items-center justify-around'>
                  <Button
                    variant='default'
                    size='lg'
                    onClick={(e) => {
                      updateBenchPB({
                        id: entry.id,
                        benchPB: benchPB?.toString() || '',
                        userId: entry.user?.id || 0,
                        userName: entry.user?.name || '',
                      })
                    }}
                  >
                    Save
                  </Button>
                </div>
              </DialogClose>
              <Button
                variant='secondary'
                size='lg'
                onClick={() => {
                  setBenchPB(null)
                }}
              >
                Clear
              </Button>
            </div>
          </DialogWrapper>
        </div>
      </div>

      <div className='flex flex-col gap-3 p-2 border border-border rounded-xl'>
        <div className='flex gap-4 w-full justify-around font-bold'>
          Deadlift
        </div>
        <div className='grid grid-cols-2 gap-4 w-full justify-around'>
          <DialogWrapper
            title='Opener'
            value={entry?.deadliftOpener || ''}
          >
            <DialogHeader>
              <DialogTitle>Deadlift Opener</DialogTitle>
              <DialogDescription>Enter your Deadlift Opener</DialogDescription>
            </DialogHeader>

            <div className='flex justify-center '>
              <NumberInput
                value={deadliftOpener}
                setValue={setDeadliftOpener}
                fixed={1}
                scale={0.1}
                postfix='kg'
              />
            </div>
            <div className='flex  w-full items-center justify-around'>
              <DialogClose asChild>
                <div className='flex  w-full items-center justify-around'>
                  <Button
                    variant='default'
                    size='lg'
                    onClick={(e) => {
                      if (Number(deadliftOpener) % 0.25 !== 0) {
                        e.preventDefault()
                        toast.error(
                          'Please enter a number in 0.25kg increments',
                        )
                        return
                      }
                      updateDeadliftOpener({
                        id: entry.id,
                        deadliftOpener: deadliftOpener?.toString() || '',
                        userId: entry.user?.id || 0,
                        userName: entry.user?.name || '',
                      })
                    }}
                  >
                    Save
                  </Button>
                </div>
              </DialogClose>
              <Button
                variant='secondary'
                size='lg'
                onClick={() => {
                  setDeadliftOpener(null)
                }}
              >
                Clear
              </Button>
            </div>
          </DialogWrapper>
          <DialogWrapper
            title='PB'
            value={entry?.deadliftPB || ''}
          >
            <DialogHeader>
              <DialogTitle>Personal Best</DialogTitle>
              <DialogDescription>Enter your PB</DialogDescription>
            </DialogHeader>

            <div className='flex justify-center '>
              <NumberInput
                value={deadliftPB}
                setValue={setDeadliftPB}
                fixed={1}
                scale={0.1}
                postfix='kg'
              />
            </div>
            <div className='flex  w-full items-center justify-around'>
              <DialogClose asChild>
                <div className='flex  w-full items-center justify-around'>
                  <Button
                    variant='default'
                    size='lg'
                    onClick={(e) => {
                      updateDeadliftPB({
                        id: entry.id,
                        deadliftPB: deadliftPB?.toString() || '',
                        userId: entry.user?.id || 0,
                        userName: entry.user?.name || '',
                      })
                    }}
                  >
                    Save
                  </Button>
                </div>
              </DialogClose>
              <Button
                variant='secondary'
                size='lg'
                onClick={() => {
                  setDeadliftPB(null)
                }}
              >
                Clear
              </Button>
            </div>

          </DialogWrapper>
        </div>
      </div>
    </div>
  )
}
export { EntryForm }
