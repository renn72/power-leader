'use client'

import type { GetCompetitionById } from '~/lib/types'
import { api } from '~/trpc/react'
import { CircleMinus, CirclePlus } from 'lucide-react'

import Bracket from './bracket'

const CompBracket = ({
  competition,
  isAdmin = true,
}: {
  competition: GetCompetitionById
  isAdmin?: boolean
}) => {
  const ctx = api.useUtils()
  const { mutate: updateSquatBrackets } =
    api.competition.updateSquatBrackets.useMutation({
      onMutate: async (newData) => {
        await ctx.competition.getMyCompetitions.cancel()

        const oldData = ctx.competition.getMyCompetitions.getData()

        if (!oldData) return
        const bracket = newData.squatBrackets.toString()

        ctx.competition.getMyCompetitions.setData(undefined, [
          ...oldData.map((c) => {
            if (c.id === newData.id) {
              return {
                ...c,
                squatBrackets: bracket,
              }
            }
            return c
          }),
        ])
        return { oldData }
      },
      onError: (err, newData, context) => {
        if (!context?.oldData) return
        ctx.competition.getMyCompetitions.setData(undefined, context.oldData)
      },
      onSuccess: () => {
        ctx.competition.getMyCompetitions.refetch()
      },
    })

  const { mutate: updateBenchPressBrackets } =
    api.competition.updateBenchPressBrackets.useMutation({
      onMutate: async (newData) => {
        await ctx.competition.getMyCompetitions.cancel()

        const oldData = ctx.competition.getMyCompetitions.getData()

        if (!oldData) return
        const bracket = newData.benchPressBrackets.toString()

        ctx.competition.getMyCompetitions.setData(undefined, [
          ...oldData.map((c) => {
            if (c.id === newData.id) {
              return {
                ...c,
                benchPressBrackets: bracket,
              }
            }
            return c
          }),
        ])
        return { oldData }
      },
      onError: (err, newData, context) => {
        if (!context?.oldData) return
        ctx.competition.getMyCompetitions.setData(undefined, context.oldData)
      },
      onSuccess: () => {
        ctx.competition.getMyCompetitions.refetch()
      },
    })

  const { mutate: updateDeadliftBrackets } =
    api.competition.updateDeadliftBrackets.useMutation({
      onMutate: async (newData) => {
        await ctx.competition.getMyCompetitions.cancel()

        const oldData = ctx.competition.getMyCompetitions.getData()

        if (!oldData) return
        const bracket = newData.deadliftBrackets.toString()

        ctx.competition.getMyCompetitions.setData(undefined, [
          ...oldData.map((c) => {
            if (c.id === newData.id) {
              return {
                ...c,
                deadliftBrackets: bracket,
              }
            }
            return c
          }),
        ])
        return { oldData }
      },
      onError: (err, newData, context) => {
        if (!context?.oldData) return
        ctx.competition.getMyCompetitions.setData(undefined, context.oldData)
      },
      onSuccess: () => {
        ctx.competition.getMyCompetitions.refetch()
      },
    })

  const squatBrackets = Number(competition.squatBrackets)
  const benchPressBrackets = Number(competition.benchPressBrackets)
  const deadliftBrackets = Number(competition.deadliftBrackets)

  return (
    <div className='flex lg:w-full flex-col lg:items-center gap-8'>
      {isAdmin ? (
        <div className='flex w-full items-center justify-around text-3xl'>
          <div className='flex items-center gap-16'>
            <div>Squat Flights</div>
            <div className='flex items-center gap-4'>
              <CircleMinus
                className='cursor-pointer hover:scale-110 hover:text-muted-foreground active:scale-90'
                onClick={() => {
                  if (squatBrackets === 1) return
                  updateSquatBrackets({
                    id: competition.id,
                    squatBrackets: (squatBrackets - 1).toString(),
                  })
                }}
              />
              <div>{squatBrackets}</div>
              <CirclePlus
                className='cursor-pointer hover:scale-110 hover:text-muted-foreground active:scale-90'
                onClick={() => {
                  updateSquatBrackets({
                    id: competition.id,
                    squatBrackets: (squatBrackets + 1).toString(),
                  })
                }}
              />
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <div>Bench Press Flights</div>
            <div className='flex items-center gap-4'>
              <CircleMinus
                className='cursor-pointer hover:scale-110 hover:text-muted-foreground active:scale-90'
                onClick={() => {
                  if (benchPressBrackets === 1) return
                  updateBenchPressBrackets({
                    id: competition.id,
                    benchPressBrackets: (benchPressBrackets - 1).toString(),
                  })
                }}
              />
              <div>{benchPressBrackets}</div>
              <CirclePlus
                className='cursor-pointer hover:scale-110 hover:text-muted-foreground active:scale-90'
                onClick={() => {
                  updateBenchPressBrackets({
                    id: competition.id,
                    benchPressBrackets: (benchPressBrackets + 1).toString(),
                  })
                }}
              />
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <div>Deadlift Flights</div>
            <div className='flex items-center gap-4'>
              <CircleMinus
                className='cursor-pointer hover:scale-110 hover:text-muted-foreground active:scale-90'
                onClick={() => {
                  if (deadliftBrackets === 1) return
                  updateDeadliftBrackets({
                    id: competition.id,
                    deadliftBrackets: (deadliftBrackets - 1).toString(),
                  })
                }}
              />
              <div>{deadliftBrackets}</div>
              <CirclePlus
                className='cursor-pointer hover:scale-110 hover:text-muted-foreground active:scale-90'
                onClick={() => {
                  updateDeadliftBrackets({
                    id: competition.id,
                    deadliftBrackets: (deadliftBrackets + 1).toString(),
                  })
                }}
              />
            </div>
          </div>
        </div>
      ) : null}

      <div className='flex w-full lg:justify-between gap-4'>
        {Array.from(Array(squatBrackets).keys()).map((b) => (
          <Bracket
            entries={competition.entries.filter((e) => {
              const isSquat = e.events.reduce((a, c) => {
                if (c.event?.isSquat) return true
                return a
              }, false)
              return isSquat
            })}
            competition={competition}
            lift='squat'
            title={`Squat ${b + 1}`}
            bracket={b + 1}
            key={b}
            isAdmin={isAdmin}
          />
        ))}
      </div>
      <div className='flex w-full lg:justify-between gap-4'>
        {Array.from(Array(benchPressBrackets).keys()).map((b) => (
          <Bracket
            entries={competition.entries.filter((e) => {
              const isBench = e.events.reduce((a, c) => {
                if (c.event?.isBench) return true
                return a
              }, false)
              return isBench
            })}
            competition={competition}
            lift='bench'
            title={`Bench ${b + 1}`}
            bracket={b + 1}
            key={b}
            isAdmin={isAdmin}
          />
        ))}
      </div>
      <div className='flex w-full lg:justify-between gap-4'>
        {Array.from(Array(deadliftBrackets).keys()).map((b) => (
          <Bracket
            entries={competition.entries.filter((e) => {
              const isDeadlift = e.events.reduce((a, c) => {
                if (c.event?.isDeadlift) return true
                return a
              }, false)
              return isDeadlift
            })}
            competition={competition}
            lift='deadlift'
            title={`Deadlift ${b + 1}`}
            bracket={b + 1}
            key={b}
            isAdmin={isAdmin}
          />
        ))}
      </div>
    </div>
  )
}

export default CompBracket
