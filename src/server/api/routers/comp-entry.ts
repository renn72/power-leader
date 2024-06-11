import { z } from 'zod'
import { eq } from 'drizzle-orm'

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

import { compEntry, compEntryToDivisions } from '~/server/db/schema'

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
    division: z.array(z.number()),
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

function isTuple<T>(array: T[]): array is [T, ...T[]] {
    return array.length > 0
}

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

            const ins = input.division.map((id) =>
                ctx.db.insert(compEntryToDivisions).values({
                    compEntryId: res[0]?.id || 0,
                    divisionId: id,
                }),
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
                compEntryToDivisions: {
                    with: {
                        division: true,
                    },
                },
            },
        })
        return res
    }),
})
