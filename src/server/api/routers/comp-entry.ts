import { z } from 'zod'
import { eq, and } from 'drizzle-orm'

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

import {
  compEntry,
  compEntryToDivisions,
  compEntryToEvents,
  competitions,
  lift,
  users,
} from '~/server/db/schema'

import { getCurrentUser } from './user'
import { TRPCError } from '@trpc/server'

const createSchema = z.object({
  address: z.string(),
  phone: z.string(),
  instagram: z.string(),
  openlifter: z.string(),
  birthDate: z.date(),
  equipment: z.string(),
  gender: z.string(),
  predictedWeight: z.string(),
  events: z.array(z.string()),
  division: z.array(z.string()),
  squatOpener: z.string(),
  squarRackHeight: z.string(),
  benchOpener: z.string(),
  benchRackHeight: z.string(),
  deadliftOpener: z.string(),
  squatPB: z.string(),
  benchPB: z.string(),
  deadliftPB: z.string(),
  notes: z.string(),
  compId: z.number(),
  team: z.string().optional(),
  teamLift: z.string().optional(),
  userId: z.number().optional(),
})

const updateAndLockSchema = z.object({
  name: z.string().optional(),
  id: z.number(),
  address: z.string(),
  phone: z.string(),
  instagram: z.string(),
  openlifter: z.string(),
  birthDate: z.date(),
  equipment: z.string(),
  gender: z.string(),
  predictedWeight: z.string(),
  weight: z.string(),
  events: z.array(z.string()).optional(),
  divisions: z.array(z.string()).optional(),
  wc: z.string().optional().nullable(),
  squatOpener: z.string(),
  squarRackHeight: z.string(),
  benchOpener: z.string(),
  benchRackHeight: z.string(),
  deadliftOpener: z.string(),
  squatPB: z.string(),
  benchPB: z.string(),
  deadliftPB: z.string(),
  notes: z.string(),
  compId: z.number(),
  userId: z.number().optional(),
  isFake: z.string().optional(),
})

const updateOrderSchema = z.object({
  id: z.number(),
  squatOrderOne: z.number().optional().nullable(),
  benchOrderOne: z.number().optional().nullable(),
  deadliftOrderOne: z.number().optional().nullable(),
  squatBracket: z.number().optional(),
  benchBracket: z.number().optional(),
  deadliftBracket: z.number().optional(),
  liftId: z.number().optional().nullable(),
  rack: z.string().optional().nullable(),
})

const updateOrderBulkSchema = z.array(
  z.object({
    id: z.number(),
    squatOrderOne: z.number().optional().nullable(),
    benchOrderOne: z.number().optional().nullable(),
    deadliftOrderOne: z.number().optional().nullable(),
    squatBracket: z.number().optional().nullable(),
    benchBracket: z.number().optional().nullable(),
    deadliftBracket: z.number().optional().nullable(),
    liftId: z.number().optional().nullable(),
    rack: z.string().optional().nullable(),
  }),
)

const createEntrySchema = z.object({
  name: z.string(),
  birthDate: z.date().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  equipment: z.string().optional(),
  events: z.array(z.string()),
  divisions: z.array(z.string()),
  notes: z.string().optional(),
  squatOpener: z.string().optional(),
  benchOpener: z.string().optional(),
  deadliftOpener: z.string().optional(),
  squatRackHeight: z.string().optional(),
  benchRackHeight: z.string().optional(),
  team: z.string().optional(),
  teamLift: z.string().optional(),
  weight: z.string().optional(),
  compId: z.number(),
  userId: z.number().optional(),
})

function isTuple<T>(array: T[]): array is [T, ...T[]] {
  return array.length > 0
}

export const compEntryRouter = createTRPCRouter({
  deleteAllEntries: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.db
        .delete(compEntry)
        .where(eq(compEntry.compId, input))
      return res
    }),
  deleteEntry: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const user = await getCurrentUser()
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to access this resource.',
        })
      }

      const res = await ctx.db.delete(compEntry).where(eq(compEntry.id, input))

      return res
    }),
  deleteEntryAndUser: publicProcedure
    .input(z.object({ userId: z.number(), entryId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.delete(users).where(eq(users.id, input.userId))

      const res = await ctx.db
        .delete(compEntry)
        .where(eq(compEntry.id, input.entryId))

      return res
    }),
  createEntry: publicProcedure
    .input(createEntrySchema)
    .mutation(async ({ ctx, input }) => {
      console.log('input', input)

      let userId = input.userId

      const isUser = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, input.email || ''),
      })

      if (isUser?.id) userId = isUser.id

      if (!userId) {
        const user = await ctx.db
          .insert(users)
          .values({
            name: input.name,
            email: input.email,
            birthDate: input.birthDate,
            gender: input.gender,
            address: input.address,
            phone: input.phone,
          })
          .returning({ id: users.id })

        userId = user[0]?.id
      }

      if (!userId) {
        throw new TRPCError({
          code: 'PARSE_ERROR',
          message: 'Error creating user',
        })
      }

      const entry = await ctx.db
        .insert(compEntry)
        .values({
          birthDate: input.birthDate,
          gender: input.gender,
          address: input.address,
          phone: input.phone,
          equipment: input.equipment,
          squatOpener: input.squatOpener,
          benchOpener: input.benchOpener,
          deadliftOpener: input.deadliftOpener,
          squarRackHeight: input.squatRackHeight,
          benchRackHeight: input.benchRackHeight,
          weight: input.weight,
          compId: input.compId,
          userId: userId,
        })
        .returning({ id: compEntry.id })

      const entryId = entry[0]?.id

      if (!entryId) {
        throw new TRPCError({
          code: 'PARSE_ERROR',
          message: 'Error creating entry',
        })
      }

      const divisionIds = input.divisions.map((division) => {
        return ctx.db.insert(compEntryToDivisions).values({
          compEntryId: entryId,
          divisionId: Number(division),
        })
      })

      if (isTuple(divisionIds)) {
        await ctx.db.batch(divisionIds)
      }

      const eventIds = input.events.map((event) => {
        return ctx.db.insert(compEntryToEvents).values({
          compEntryId: entryId,
          eventId: Number(event),
        })
      })

      if (isTuple(eventIds)) {
        await ctx.db.batch(eventIds)
      }

      return true
    }),
  create: publicProcedure
    .input(createSchema)
    .mutation(async ({ ctx, input }) => {
      console.log('input', input)

      const user = await getCurrentUser()
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to access this resource.',
        })
      }

      return true

      // const res = await ctx.db
      //   .insert(compEntry)
      //   .values({
      //     ...input,
      //     userId: user.id,
      //   })
      //   .returning({ id: compEntry.id })
      //
      // const ins = input.division.map((id) =>
      //   ctx.db.insert(compEntryToDivisions).values({
      //     compEntryId: res[0]?.id || 0,
      //     divisionId: Number(id),
      //   }),
      // )
      //
      // if (isTuple(ins)) {
      //   await ctx.db.batch(ins)
      // }
      //
      // return true
    }),
  updateAndLock: publicProcedure
    .input(updateAndLockSchema)
    .mutation(async ({ ctx, input }) => {
      console.log('input', input)
      const user = await getCurrentUser()
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to access this resource.',
        })
      }
      const competition = await ctx.db.query.competitions.findFirst({
        where: (competition, { eq }) => eq(competition.id, input.compId),
      })
      if (!competition) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Competition not found.',
        })
      }
      const weight = Number(input.weight)
      const wc_female = competition.wc_female
        ?.split('/')
        .map((item) => Number(item))
      const wc_male = competition.wc_male
        ?.split('/')
        .map((item) => Number(item))
      let wc = ''
      if (input?.gender?.toLowerCase() == 'female' && wc_female) {
        wc =
          wc_female
            .reduce((a, c) => (weight < c && weight > a ? c : a), 0)
            .toString() + '-f'
      } else {
        if (wc_male && input?.gender?.toLowerCase() !== 'female') {
          wc =
            wc_male
              .reduce((a, c) => (weight < c && weight > a ? c : a), 0)
              .toString() + '-m'
        }
      }

      input.wc = wc == '0-f' || wc == '0-m' ? null : wc
      const { isFake, events, divisions, ...rest } = input

      const res = true

      // const res = await ctx.db
      //   .update(compEntry)
      //   .set({
      //     ...rest,
      //     isLocked: weight == 0 ? false : true,
      //   })
      //   .where(eq(compEntry.id, input.id))
      console.log('entry updated')

      // build batch inserts and check if doing lift
      await ctx.db.delete(lift).where(eq(lift.compEntryId, input.id))
      console.log('deleted lift')

      const squat = [
        ctx.db.insert(lift).values({
          compEntryId: input.id,
          liftNumber: 1,
          state: 'created',
          lift: 'squat',
          gender: input.gender,
          userWeight: input.weight,
          rackHeight: input.squarRackHeight,
          weight: input.squatOpener,
          name: input.name,
        }),
        ctx.db.insert(lift).values({
          compEntryId: input.id,
          liftNumber: 2,
          gender: input.gender,
          userWeight: input.weight,
          state: 'created',
          lift: 'squat',
          rackHeight: input.squarRackHeight,
          weight: '',
          name: input.name,
        }),
        ctx.db.insert(lift).values({
          compEntryId: input.id,
          liftNumber: 3,
          gender: input.gender,
          userWeight: input.weight,
          state: 'created',
          lift: 'squat',
          rackHeight: input.squarRackHeight,
          weight: '',
          name: input.name,
        }),
      ]

      const bench = [
        ctx.db.insert(lift).values({
          compEntryId: input.id,
          liftNumber: 1,
          state: 'created',
          lift: 'bench',
          gender: input.gender,
          userWeight: input.weight,
          rackHeight: input.benchRackHeight,
          weight: input.benchOpener,
          name: input.name,
        }),
        ctx.db.insert(lift).values({
          compEntryId: input.id,
          liftNumber: 2,
          state: 'created',
          lift: 'bench',
          gender: input.gender,
          userWeight: input.weight,
          rackHeight: input.benchRackHeight,
          weight: '',
          name: input.name,
        }),
        ctx.db.insert(lift).values({
          compEntryId: input.id,
          liftNumber: 3,
          state: 'created',
          lift: 'bench',
          gender: input.gender,
          userWeight: input.weight,
          rackHeight: input.benchRackHeight,
          weight: '',
          name: input.name,
        }),
      ]

      const deadlift = [
        ctx.db.insert(lift).values({
          compEntryId: input.id,
          liftNumber: 1,
          state: 'created',
          lift: 'deadlift',
          gender: input.gender,
          userWeight: input.weight,
          weight: input.deadliftOpener,
          name: input.name,
        }),
        ctx.db.insert(lift).values({
          compEntryId: input.id,
          liftNumber: 2,
          state: 'created',
          lift: 'deadlift',
          gender: input.gender,
          userWeight: input.weight,
          weight: '',
          name: input.name,
        }),
        ctx.db.insert(lift).values({
          compEntryId: input.id,
          liftNumber: 3,
          state: 'created',
          lift: 'deadlift',
          gender: input.gender,
          userWeight: input.weight,
          weight: '',
          name: input.name,
        }),
      ]
      const sOpen = input.squatOpener !== '' ? true : false
      const bOpen = input.benchOpener !== '' ? true : false
      const dOpen = input.deadliftOpener !== '' ? true : false

      // if (isTuple(squat) && input.squatOpener !== '') {
      //   console.log('squat')
      //   await ctx.db.batch(squat)
      // }
      //
      // if (isTuple(bench) && input.benchOpener !== '') {
      //   console.log('bench')
      //   await ctx.db.batch(bench)
      // }
      //
      // if (isTuple(deadlift) && input.deadliftOpener !== '') {
      //   console.log('deadlift')
      //   await ctx.db.batch(deadlift)
      // }
      if (sOpen && bOpen && dOpen) {
        if (isTuple(squat) && isTuple(bench) && isTuple(deadlift)) {
          console.log('all')
          await ctx.db.batch([
            ...squat,
            ...bench,
            ...deadlift,
            ctx.db
              .update(compEntry)
              .set({
                ...rest,
                isLocked: weight == 0 ? false : true,
              })
              .where(eq(compEntry.id, input.id)),
          ])
        }
      } else {
        console.log('not fake')

        await ctx.db
          .update(compEntry)
          .set({
            ...rest,
            isLocked: weight == 0 ? false : true,
          })
          .where(eq(compEntry.id, input.id))

        if (isTuple(squat) && input.squatOpener !== '') {
          console.log('squat')
          await ctx.db.batch(squat)
        }

        if (isTuple(bench) && input.benchOpener !== '') {
          console.log('bench')
          await ctx.db.batch(bench)
        }

        if (isTuple(deadlift) && input.deadliftOpener !== '') {
          console.log('deadlift')
          await ctx.db.batch(deadlift)
        }
      }

      if (input.isFake == 'fake') return res

      await ctx.db
        .delete(compEntryToDivisions)
        .where(eq(compEntryToDivisions.compEntryId, input.id))
        .returning({ id: compEntryToDivisions.divisionId })
      await ctx.db
        .delete(compEntryToEvents)
        .where(eq(compEntryToEvents.compEntryId, input.id))

      const divisionIds = input.divisions?.map((division) => {
        return ctx.db.insert(compEntryToDivisions).values({
          compEntryId: input.id,
          divisionId: Number(division),
        })
      })

      if (divisionIds && isTuple(divisionIds)) {
        await ctx.db.batch(divisionIds)
      }

      const eventIds = input.events?.map((event) => {
        return ctx.db.insert(compEntryToEvents).values({
          compEntryId: input.id,
          eventId: Number(event),
        })
      })

      if (eventIds && isTuple(eventIds)) {
        console.log('eventIds')
        await ctx.db.batch(eventIds)
      }

      return res
    }),
  createFake: publicProcedure
    .input(createSchema)
    .mutation(async ({ ctx, input }) => {
      console.log('input', input)

      const user = await getCurrentUser()
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to access this resource.',
        })
      }
      return true

      // const res = await ctx.db
      //   .insert(compEntry)
      //   .values({
      //     ...input,
      //     userId: input.userId || 0,
      //   })
      //   .returning({ id: compEntry.id })
      //
      // const ins = input.division.map((id) =>
      //   ctx.db.insert(compEntryToDivisions).values({
      //     compEntryId: res[0]?.id || 0,
      //     divisionId: Number(id),
      //   }),
      // )
      //
      // if (isTuple(ins)) {
      //   await ctx.db.batch(ins)
      // }
      //
      // return true
    }),
  updateOrder: publicProcedure
    .input(updateOrderSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await getCurrentUser()
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to access this resource.',
        })
      }

      const res = await ctx.db
        .update(compEntry)
        .set({
          ...input,
        })
        .where(eq(compEntry.id, input.id))

      return res
    }),
  updateBracket: publicProcedure
    .input(
      z.object({
        id: z.number(),
        bracket: z.object({
          squatBracket: z.number().optional(),
          benchBracket: z.number().optional(),
          deadliftBracket: z.number().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await getCurrentUser()
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to access this resource.',
        })
      }
      console.log('input', input)

      const res = await ctx.db
        .update(compEntry)
        .set({
          ...input.bracket,
        })
        .where(eq(compEntry.id, input.id))

      return res
    }),
  updateOrderBulk: publicProcedure
    .input(updateOrderBulkSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await getCurrentUser()
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to access this resource.',
        })
      }

      const ins = input
        .map((item) => {
          const {
            liftId,
            squatBracket,
            benchBracket,
            deadliftBracket,
            ...rest
          } = item
          return rest
        })
        .map((item) =>
          ctx.db
            .update(compEntry)
            .set({
              ...item,
            })
            .where(eq(compEntry.id, item.id)),
        )

      if (isTuple(ins)) {
        await ctx.db.batch(ins)
      }

      const ins2 = input
        .filter((i) => i.liftId)
        .map((item) => {
          let bracket = 99
          if (item.squatBracket) bracket = item.squatBracket
          if (item.benchBracket) bracket = item.benchBracket
          if (item.deadliftBracket) bracket = item.deadliftBracket
          let order = 999
          if (item.squatOrderOne) order = item.squatOrderOne
          if (item.benchOrderOne) order = item.benchOrderOne
          if (item.deadliftOrderOne) order = item.deadliftOrderOne
          return {
            liftId: item.liftId,
            order: order,
            bracket: bracket,
            rack: item.rack,
          }
        })
        .map((item) =>
          ctx.db
            .update(lift)
            .set({
              order: item.order,
              bracket: item.bracket,
              rackHeight: item.rack,
            })
            .where(eq(lift.id, Number(item.liftId))),
        )

      if (isTuple(ins2)) {
        await ctx.db.batch(ins2)
      }
      return true
    }),
  getMyCompEntries: publicProcedure.query(async ({ ctx }) => {
    const user = await getCurrentUser()
    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You are not authorized to access this resource.',
      })
    }
    const res = await ctx.db.query.compEntry.findMany({
      where: (compEntry, { eq }) => eq(compEntry.userId, user.id),
      orderBy: (compEntry, { desc }) => [desc(compEntry.createdAt)],
      with: {
        competition: true,
        user: true,
        compEntryToDivisions: {
          with: {
            division: true,
          },
        },
        events: {
          with: {
            event: true,
          },
        },
      },
    })
    return res
  }),
  get: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const res = await ctx.db.query.compEntry.findFirst({
      where: (compEntry, { eq }) => eq(compEntry.id, input),
      with: {
        lift: true,
        competition: true,
        compEntryToDivisions: {
          with: {
            division: true,
          },
        },
        events: {
          with: {
            event: true,
          },
        },
        user: true,
      },
    })
    if (!res) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Competition not found.',
      })
    }
    return res
  }),
  updateField: publicProcedure
    .input(z.object({ id: z.number(), field: z.string(), value: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await getCurrentUser()
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to access this resource.',
        })
      }

      const res = await ctx.db
        .update(compEntry)
        .set({
          [input.field]: input.value,
        })
        .where(eq(compEntry.id, input.id))

      if (input.field === 'squarRackHeight') {
        await ctx.db
          .update(lift)
          .set({
            rackHeight: input.value,
          })
          .where(and(eq(lift.compEntryId, input.id), eq(lift.lift, 'squat')))
      }

      if (input.field === 'benchRackHeight') {
        await ctx.db
          .update(lift)
          .set({
            rackHeight: input.value,
          })
          .where(and(eq(lift.compEntryId, input.id), eq(lift.lift, 'bench')))
      }

      return res
    }),
})
