import { z } from 'zod'
import { eq } from 'drizzle-orm'

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

import { competitions, divisions, compDayInfo } from '~/server/db/schema'

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
                .update(compDayInfo)
                .set({
                    lift: input.lift,
                })
                .where(eq(compDayInfo.compId, input.id))
                .returning({ lift: compDayInfo.lift })

            await pusherServer.trigger('competition-' + input.uuid, 'update', {
                lift: input.lift,
            })

            return res
        }),
})
