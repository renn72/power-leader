
import { z } from 'zod'
import { eq, } from 'drizzle-orm'

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

import {
  lift,
} from '~/server/db/schema'

import { getCurrentUser } from './user'
import { TRPCError } from '@trpc/server'

export const liftRouter = createTRPCRouter({
  update: publicProcedure
    .input(z.object({ id: z.number(), value: z.string() }))
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
})
