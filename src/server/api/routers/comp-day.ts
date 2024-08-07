import { z } from 'zod'
import { eq } from 'drizzle-orm'

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

import { lift, compDayInfo } from '~/server/db/schema'

import { pusherServer } from '~/server/api/pusher'

import { getCurrentUser } from './user'
import { TRPCError } from '@trpc/server'

export const competitionDayRouter = createTRPCRouter({
  updateLift: publicProcedure
  .input(
    z.object({
      id: z.number(),
      uuid: z.string(),
      lift: z.string(),
      round: z.number(),
      bracket: z.number(),
      index: z.number(),
      nextIndex: z.number().optional().nullable(),
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
      .update(compDayInfo)
      .set({
        lift: input.lift,
        round: input.round,
        bracket: input.bracket,
        index: input.index,
        nextIndex: input.nextIndex,
        updatedAt: Date.now().toString(),
      })
      .where(eq(compDayInfo.compId, input.id))
      .returning({
        lift: compDayInfo.lift,
        round: compDayInfo.round,
        bracket: compDayInfo.bracket,
        index: compDayInfo.index,
        nextIndex: compDayInfo.nextIndex,
      })

    console.log('res', res)

    await pusherServer.trigger('competition-' + input.uuid, 'update', {
      lift: input.lift,
      round: input.round,
      bracket: input.bracket,
      index: input.index,
      nextIndex: input.nextIndex,
    })

    return res
  }),
  updateIsLiftGood: publicProcedure
  .input(
    z.object({
      id: z.number(),
      entryId: z.number(),
      uuid: z.string(),
      isGoodOne: z.boolean().optional().nullable(),
      isGoodTwo: z.boolean().optional().nullable(),
      isGoodThree: z.boolean().optional().nullable(),
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

    if (input.isGoodOne !== undefined) {
      const res = await ctx.db
        .update(lift)
        .set({
          isGoodOne: input.isGoodOne,
          updatedAt: Date.now().toString(),
        })
        .where(eq(lift.id, input.id))
        .returning({
          isGoodOne: lift.isGoodOne,
        })

      await pusherServer.trigger(
        'competition-' + input.uuid,
        'judge',
        {
          id: input.id,
          entryId: input.entryId,
          judge: 1,
          isGood: input.isGoodOne,
        },
      )
      return res
    }

    if (input.isGoodTwo !== undefined) {
      const res = await ctx.db
        .update(lift)
        .set({
          isGoodTwo: input.isGoodTwo,
          updatedAt: Date.now().toString(),
        })
        .where(eq(lift.id, input.id))
        .returning({
          isGoodTwo: lift.isGoodTwo,
        })

      await pusherServer.trigger(
        'competition-' + input.uuid,
        'judge',
        {
          id: input.id,
          entryId: input.entryId,
          judge: 2,
          isGood: input.isGoodTwo,
        },
      )
      return res
    }

    if (input.isGoodThree !== undefined) {
      const res = await ctx.db
        .update(lift)
        .set({
          isGoodThree: input.isGoodThree,
          updatedAt: Date.now().toString(),
        })
        .where(eq(lift.id, input.id))
        .returning({
          isGoodThree: lift.isGoodThree,
        })

      await pusherServer.trigger(
        'competition-' + input.uuid,
        'judge',
        {
          id: input.id,
          entryId: input.entryId,
          judge: 3,
          isGood: input.isGoodThree,
        },
      )
      return res
    }
  }),
})
