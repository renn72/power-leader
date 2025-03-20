import { TRPCError } from '@trpc/server'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { lift } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { getCurrentUser } from './user'

function isTuple<T>(array: T[]): array is [T, ...T[]] {
  return array.length > 0
}

export const liftRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const user = await getCurrentUser()
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to access this resource.',
        })
      }

      const res = await ctx.db.query.lift.findFirst({
        where: (lift, { eq }) => eq(lift.id, input.id),
      })

      if (!res) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Competition not found.',
        })
      }
      return res
    }),
  update: publicProcedure
    .input(z.object({ id: z.number(), value: z.string().nullable() }))
    .mutation(async ({ ctx, input }) => {
      const user = await getCurrentUser()
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to access this resource.',
        })
      }

      const res = await ctx.db
        .update(lift)
        .set({
          weight: input.value,
        })
        .where(eq(lift.id, input.id))

      return res
    }),
  createUpdate: publicProcedure
    .input(
      z.object({
        compEntryId: z.number(),
        lift: z.string(),
        bracket: z.number(),
        gender: z.string(),
        userWeight: z.string(),
        weight: z.string(),
        liftNumber: z.number(),
        state: z.string().optional(),
        name: z.string(),
        isRecord: z.boolean().optional().nullable(),
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

      const oldLift = await ctx.db.query.lift.findFirst({
        where: (lift, { eq, and }) =>
          and(
            eq(lift.compEntryId, input.compEntryId),
            eq(lift.lift, input.lift),
            eq(lift.liftNumber, input.liftNumber),
          ),
      })

      if (oldLift?.id) {
        const res = await ctx.db
          .update(lift)
          .set({
            weight: input.weight,
            isRecord: input.isRecord,
          })
          .where(eq(lift.id, oldLift.id))
        return res
      } else {
        await ctx.db
          .insert(lift)
          .values({
            compEntryId: input.compEntryId,
            liftNumber: input.liftNumber,
            state: 'created',
            lift: input.lift,
            gender: input.gender,
            userWeight: input.userWeight,
            weight: input.weight,
            name: input.name,
          })
          .returning({ id: lift.id, weight: lift.weight })
      }
    }),
  create: publicProcedure
    .input(
      z.object({
        compEntryId: z.number(),
        lift: z.string(),
        team: z.string().optional(),
        teamLift: z.string().optional(),
        bracket: z.number(),
        gender: z.string(),
        userWeight: z.string(),
        rackHeight: z.string(),
        weight: z.string(),
        liftNumber: z.number(),
        state: z.string().optional(),
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

      const res = await ctx.db
        .insert(lift)
        .values(input)
        .returning({ id: lift.id, weight: lift.weight })

      return res
    }),
  updateOrderMany: publicProcedure
    .input(
      z.array(
        z.object({
          id: z.number(),
          state: z.string(),
          bracket: z.number(),
          order: z.number().nullable(),
        }),
      ),
    )
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
          .update(lift)
          .set({
            order: item.order,
            bracket: item.bracket,
            state: item.state,
          })
          .where(eq(lift.id, item.id)),
      )

      if (isTuple(ins)) {
        await ctx.db.batch(ins)
      }

      return true
    }),
  judge: publicProcedure
    .input(
      z.object({
        id: z.number(),
        one: z.boolean().nullable(),
        two: z.boolean().nullable(),
        three: z.boolean().nullable(),
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

      let state = 'judged'

      const res = await ctx.db
        .update(lift)
        .set({
          isGoodOne: input.one,
          isGoodTwo: input.two,
          isGoodThree: input.three,
          state: state,
        })
        .where(eq(lift.id, input.id))

      return res
    }),
})
