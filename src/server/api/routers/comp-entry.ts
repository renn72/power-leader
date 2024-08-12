import { z } from 'zod'
import { eq, and } from 'drizzle-orm'

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

import {
  compEntry,
  compEntryToDivisions,
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
  eventuiuius: z.array(z.string()),
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
  userId: z.number().optional(),
})

const updateAndLockSchema = z.object({
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
  wc: z.string().optional(),
  event: z.string(),
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
  userId: z.number().optional(),
})

const updateOrderSchema = z.object({
  id: z.number(),
  squatOrder: z.number().optional(),
  benchOrder: z.number().optional(),
  deadliftOrder: z.number().optional(),
  squatBracket: z.number().optional(),
  benchBracket: z.number().optional(),
  deadliftBracket: z.number().optional(),
})

const updateOrderBulkSchema = z.array(
  z.object({
    id: z.number(),
    squatOrder: z.number().optional(),
    benchOrder: z.number().optional(),
    deadliftOrder: z.number().optional(),
    squatBracket: z.number().optional(),
    benchBracket: z.number().optional(),
    deadliftBracket: z.number().optional(),
  }),
)

const createEntrySchema = z.object({
  name: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  birthDate: z.date().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  equipment: z.string().optional(),
  events: z.string().optional(),
  notes: z.string().optional(),
  divisions: z.string().optional(),
  squatOpener: z.string().optional(),
  benchOpener: z.string().optional(),
  deadliftOpener: z.string().optional(),
  squatRackHeight: z.string().optional(),
  benchRackHeight: z.string().optional(),
  compId: z.number(),
})

function isTuple<T>(array: T[]): array is [T, ...T[]] {
  return array.length > 0
}

export const compEntryRouter = createTRPCRouter({
  createEntry: publicProcedure
    .input(createEntrySchema)
    .mutation(async ({ ctx, input }) => {
      console.log('input', input)

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

      const userId = user[0]?.id

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
          squatOpener: input.squatOpener,
          benchOpener: input.benchOpener,
          deadliftOpener: input.deadliftOpener,
          squarRackHeight: input.squatRackHeight,
          benchRackHeight: input.benchRackHeight,
          compId: input.compId,
          userId: userId,
        })
        .returning({ id: compEntry.id })

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

      const res = await ctx.db
        .insert(compEntry)
        .values({
          ...input,
          userId: user.id,
        })
        .returning({ id: compEntry.id })

      const ins = input.division.map((id) =>
        ctx.db.insert(compEntryToDivisions).values({
          compEntryId: res[0]?.id || 0,
          divisionId: Number(id),
        }),
      )

      if (isTuple(ins)) {
        await ctx.db.batch(ins)
      }

      return true
    }),
  updateAndLock: publicProcedure
    .input(updateAndLockSchema)
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
          isLocked: true,
        })
        .where(eq(compEntry.id, input.id))

      await ctx.db
        .delete(lift)
        .where(and(eq(lift.compEntryId, input.id), eq(lift.liftNumber, 1)))

      await ctx.db.insert(lift).values({
        compEntryId: input.id,
        liftNumber: 1,
        state: 'created',
        lift: 'squat',
        weight: input.squatOpener,
      })
      await ctx.db.insert(lift).values({
        compEntryId: input.id,
        liftNumber: 1,
        state: 'created',
        lift: 'bench',
        weight: input.benchOpener,
      })
      await ctx.db.insert(lift).values({
        compEntryId: input.id,
        liftNumber: 1,
        state: 'created',
        lift: 'deadlift',
        weight: input.deadliftOpener,
      })

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

      const res = await ctx.db
        .insert(compEntry)
        .values({
          ...input,
          userId: input.userId || 0,
        })
        .returning({ id: compEntry.id })

      const ins = input.division.map((id) =>
        ctx.db.insert(compEntryToDivisions).values({
          compEntryId: res[0]?.id || 0,
          divisionId: Number(id),
        }),
      )

      if (isTuple(ins)) {
        await ctx.db.batch(ins)
      }

      return true
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

      const ins = input.map((item) =>
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
      },
    })
    return res
  }),
  get: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const res = await ctx.db.query.compEntry.findFirst({
      where: (compEntry, { eq }) => eq(compEntry.id, input),
      with: {
        competition: true,
        compEntryToDivisions: {
          with: {
            division: true,
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
})
