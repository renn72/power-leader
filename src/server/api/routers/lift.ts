import { z } from 'zod'
import { eq } from 'drizzle-orm'

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

import { lift } from '~/server/db/schema'

import { getCurrentUser } from './user'
import { TRPCError } from '@trpc/server'

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
  updateOrderMany: publicProcedure
    .input(
      z.array(
        z.object({
          id: z.number(),
          state: z.string(),
          bracket: z.number(),
          order: z.number(),
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

      const res = await ctx.db
        .update(lift)
        .set({
          isGoodOne: input.one,
          isGoodTwo: input.two,
          isGoodThree: input.three,
        })
        .where(eq(lift.id, input.id))

      return res
    }),
})
