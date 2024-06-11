import { z } from 'zod'
import { eq } from 'drizzle-orm'

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

import { compEntry } from '~/server/db/schema'

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
    weight: z.string(),
    events: z.string(),
    division: z.string(),
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
})

export const compEntryRouter = createTRPCRouter({
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
            return res
        }),
    getAll: publicProcedure.query(async ({ ctx }) => {
        const res = await ctx.db.query.competitions.findMany({
            orderBy: (competitions, { desc }) => [desc(competitions.createdAt)],
            with: {
                divisions: true,
            },
        })
        return res
    }),
    getMyCompetitions: publicProcedure.query(async ({ ctx }) => {
        const user = await getCurrentUser()
        if (!user) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'You are not authorized to access this resource.',
            })
        }
        const res = await ctx.db.query.competitions.findMany({
            where: (competitions, { eq }) =>
                eq(competitions.creatorId, user.id),
            orderBy: (competitions, { desc }) => [desc(competitions.createdAt)],
            with: {
                divisions: true,
            },
        })
        return res
    }),
})
