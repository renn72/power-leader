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
          setValue(m * scale + scale)
        }}
        className='absolute right-0 top-1/2 -translate-y-1/2 text-xs text-secondary-foreground flex gap-0 items-start border-l active:bg-primary/60 rounded-r-lg'
      >
        <div className='h-16 w-14 flex items-center justify-center scale-75'>
          <PlusIcon size={28} />
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
          <Minus size={28} />
        </div>
      </div>
    </div>
  )
}

const DialogWrapper = ({
  children,
  title,
  value,
  isStarted = false,
  isPrefix = true,
}: {
  children: React.ReactNode
  title: string
  value: string
  fixed?: number
  isStarted?: boolean
  isPrefix?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const isDisabled = isStarted === true
  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger disabled={isDisabled}>
        <div
          className={cn(
            'flex gap-1 items-center justify-around flex-col bg-secondary px-4 py-1 rounded-md shadow-sm',
            'active:scale-90 active:shadow-none transition-transform cursor-pointer',
            isOpen ? 'scale-90 shadow-none' : '',
            isDisabled ? 'bg-secondary/30' : '',
          )}
        >
          <div className='text-muted-foreground text-center text-base font-semibold'>
            {title}
          </div>
          {value !== '' && value !== undefined && value !== null ? (
            <div
              className={cn(
                'relative text-lg',
                isDisabled ? 'font-black' : '',
              )}
            >
              {value}
              {isPrefix ? (
                <span className='text-xs font-thin'>kg</span>
              ) : null}
            </div>
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
      )}
    >
      <div className='text-muted-foreground text-center text-base font-semibold'>
        {title}
      </div>
      <div className={cn('capitalize text-lg ')}>{value}</div>
    </div>
  )
}

const EntryForm = ({
  entry,
  isStarted,
}: {
  entry: GetCompetitionEntryById
  isStarted: boolean
}) => {
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

  const isSquat = entry.events.reduce((a, c) => {
    if (c.event?.isSquat) return true
    return a
  }, false)
  const isBench = entry.events.reduce((a, c) => {
    if (c.event?.isBench) return true
    return a
  }, false)
  const isDeadlift = entry.events.reduce((a, c) => {
    if (c.event?.isDeadlift) return true
    return a
  }, false)

  return (
    <div className='flex flex-col gap-4 px-4'>
      <div className='flex flex-col gap-0'>
        <h1 className='text-center text-3xl font-extrabold text-primary'>
          WRPF Showdown V
        </h1>
        <div className='text-xs text-center font-light'>
          (you can update this as many times as you wish)
        </div>
      </div>
      <div className='flex flex-col gap-3 p-2 border border-border rounded-xl shadow-md'>
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
      </div>
      {isSquat ? (
        <div className='flex flex-col gap-3 p-2 border border-border rounded-xl shadow-md'>
          <div className='flex gap-4 w-full justify-around font-bold'>
            Squat
          </div>
          <div className='grid grid-cols-3 gap-4 w-full justify-around'>
            <DialogWrapper
              title='Opener'
              value={entry?.squatOpener || ''}
              isStarted={isStarted}
            >
              <DialogHeader>
                <DialogTitle className='text-xl'>Squat Opener</DialogTitle>
                <DialogDescription className='text-base'>
                  Enter your Squat Opener
                </DialogDescription>
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
                  <div className=''>
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
              isPrefix={false}
            >
              <DialogHeader>
                <DialogTitle className='text-xl'>Squat Rack Height</DialogTitle>
                <DialogDescription className='text-base'>
                  Enter your Squat Rack Height, your pin height and if you want
                  the arms 'in' or 'out', <br /> eg. '12in' or '4out'
                </DialogDescription>
                <DialogDescription></DialogDescription>
              </DialogHeader>

              <div className='flex justify-center '>
                <Input
                  placeholder='eg. 12in or 4out'
                  className='text-lg'
                  value={squatRackHeight ?? ''}
                  onChange={(e) => {
                    setSquatRackHeight(e.target.value)
                  }}
                />
              </div>
              <div className='flex  w-full items-center justify-around'>
                <DialogClose asChild>
                  <div className=''>
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
                <DialogTitle className='text-xl'>Personal Best</DialogTitle>

                <DialogDescription className='text-base'>
                  Enter your PB
                </DialogDescription>
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
                  <div className=''>
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
      ) : null}

      {isBench ? (
        <div className='flex flex-col gap-3 p-2 border border-border rounded-xl shadow-md'>
          <div className='flex gap-4 w-full justify-around font-bold'>
            Bench
          </div>
          <div className='grid grid-cols-3 gap-4 w-full justify-around'>
            <DialogWrapper
              title='Opener'
              value={entry?.benchOpener || ''}
              isStarted={isStarted}
            >
              <DialogHeader>
                <DialogTitle className='text-xl'>Bench Opener</DialogTitle>
                <DialogDescription className='text-base'>
                  Enter your Bench Opener
                </DialogDescription>
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
                  <div className=''>
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
              isPrefix={false}
            >
              <DialogHeader>
                <DialogTitle className='text-xl'>Bench Rack Height</DialogTitle>

                <DialogDescription className='text-base'>
                  Enter your Bench Rack Height,(safety is optional). e.g. 8/4,
                  or just 8 if you don't want the safety
                </DialogDescription>
                <DialogDescription></DialogDescription>
              </DialogHeader>

              <div className='flex justify-center '>
                <Input
                  placeholder='eg. 8/4 or 8'
                  className='text-lg'
                  value={benchRackHeight ?? ''}
                  onChange={(e) => {
                    setBenchRackHeight(e.target.value)
                  }}
                />
              </div>
              <div className='flex  w-full items-center justify-around'>
                <DialogClose asChild>
                  <div className=''>
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
                <DialogTitle className='text-xl'>Personal Best</DialogTitle>
                <DialogDescription className='text-base'>
                  Enter your PB
                </DialogDescription>
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
                  <div className=''>
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
      ) : null}

      {isDeadlift ? (
        <div className='flex flex-col gap-3 p-2 border border-border rounded-xl shadow-md'>
          <div className='flex gap-4 w-full justify-around font-bold'>
            Deadlift
          </div>
          <div className='grid grid-cols-2 gap-4 w-full justify-around'>
            <DialogWrapper
              title='Opener'
              value={entry?.deadliftOpener || ''}
              isStarted={isStarted}
            >
              <DialogHeader>
                <DialogTitle className='text-xl'>Deadlift Opener</DialogTitle>
                <DialogDescription className='text-base'>
                  Enter your Deadlift Opener
                </DialogDescription>
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
                  <div className=''>
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
                <DialogTitle className='text-xl'>Personal Best</DialogTitle>
                <DialogDescription className='text-base'>
                  Enter your PB
                </DialogDescription>
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
                  <div className=''>
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
      ) : null}
    </div>
  )
}
export { EntryForm }
