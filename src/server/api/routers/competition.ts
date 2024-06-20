import { z } from 'zod'
import { eq } from 'drizzle-orm'

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

import { competitions, divisions, compDayInfo } from '~/server/db/schema'

import { getCurrentUser } from './user'
import { TRPCError } from '@trpc/server'
import { getDateFromDate } from '~/lib/utils'

function isTuple<T>(array: T[]): array is [T, ...T[]] {
    return array.length > 0
}

const createSchema = z.object({
    name: z.string().min(2),
    creatorId: z.number(),
    federation: z.string(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    date: z.date(),
    daysOfCompetition: z.number().nonnegative().int().min(1),
    platforms: z.number().nonnegative().int().min(1),
    rules: z.string().optional(),
    notes: z.string(),
    events: z.string(),
    equipment: z.string(),
    formular: z.string(),
    wc_male: z.string().optional(),
    currentState: z.string(),
    competitorLimit: z.number().nonnegative().int().optional(),
    venue: z.string().optional(),
    divisions: z
        .array(
            z.object({
                name: z.string(),
                minAge: z.number().positive().or(z.string()),
                maxAge: z.number().positive().or(z.string()),
                info: z.string(),
            }),
        )
        .nonempty(),
    wc_female: z.string().optional(),
    wc_mix: z.string().optional(),
})

const updateDaysOfCompetitionSchema = z.object({
    id: z.number(),
    daysOfCompetition: z.number().nonnegative().int().min(1),
})

const updatePlatformsSchema = z.object({
    id: z.number(),
    platforms: z.number().nonnegative().int().min(1),
})

export const competitionRouter = createTRPCRouter({
    create: publicProcedure
        .input(createSchema)
        .mutation(async ({ ctx, input }) => {
            console.log('input', input)

            let comp_id =
                input.name.trim().replaceAll(/\s/g, '-') +
                '-' +
                getDateFromDate(input.date)
            const idCheck = await ctx.db.query.competitions.findFirst({
                where: (competitions, { eq }) =>
                    eq(competitions.name, input.name) &&
                    eq(competitions.date, input.date),
            })
            if (idCheck) {
                comp_id =
                    comp_id + '-' + Math.random().toString(36).substring(2, 8)
            }

            const resComp = await ctx.db
                .insert(competitions)
                .values({
                    ...input,
                    uuid: comp_id,
                })
                .returning({ id: competitions.id })

            const ins = input.divisions.map(
                (division: {
                    name: string
                    minAge: string | number
                    maxAge: string | number
                    info: string | null
                }) =>
                    ctx.db.insert(divisions).values({
                        name: division.name,
                        compName: input.name,
                        minAge:
                            division.minAge === ''
                                ? null
                                : Number(division.minAge),
                        maxAge:
                            division.maxAge === ''
                                ? null
                                : Number(division.maxAge),
                        info: division.info || '',
                        compId: resComp[0]?.id || 0,
                    }),
            )

            if (isTuple(ins)) {
                await ctx.db.batch(ins)
            }
            await ctx.db.insert(compDayInfo).values({
                compId: resComp[0]?.id || 0,
                day: 0,
                lift: 'squat',
                bracket: 0,
                index: 0,
            })
        }),

    updateDaysOfCompetition: publicProcedure
        .input(updateDaysOfCompetitionSchema)
        .mutation(async ({ ctx, input }) => {
            const user = await getCurrentUser()
            if (!user) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'You are not authorized to access this resource.',
                })
            }

            const res = await ctx.db
                .update(competitions)
                .set({
                    daysOfCompetition: input.daysOfCompetition,
                })
                .where(eq(competitions.id, input.id))

            return res
        }),

    updatePlatforms: publicProcedure
        .input(updatePlatformsSchema)
        .mutation(async ({ ctx, input }) => {
            const user = await getCurrentUser()
            if (!user) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'You are not authorized to access this resource.',
                })
            }

            const res = await ctx.db
                .update(competitions)
                .set({
                    platforms: input.platforms,
                })
                .where(eq(competitions.id, input.id))

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
    getAllOpen: publicProcedure.query(async ({ ctx }) => {
        const res = await ctx.db.query.competitions.findMany({
            where: (competitions, { eq }) =>
                eq(competitions.currentState, 'open'),
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
                compDayInfo: true,
                entries: {
                    with: {
                        user: true,
                        competition: true,
                        compEntryToDivisions: {
                            with: {
                                division: true,
                            },
                        },
                    },
                },
            },
        })
        return res
    }),
    get: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
        const res = await ctx.db.query.competitions.findFirst({
            where: (competitions, { eq }) => eq(competitions.id, input),
            with: {
                divisions: true,
                compDayInfo: true,
                entries: {
                    with: {
                        lift: true,
                        user: true,
                        competition: true,
                        compEntryToDivisions: {
                            with: {
                                division: true,
                            },
                        },
                    },
                },
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
    getCompetitionByUuid: publicProcedure
        .input(z.string())
        .query(async ({ ctx, input }) => {
            const res = await ctx.db.query.competitions.findFirst({
                where: (competitions, { eq }) => eq(competitions.uuid, input),
                with: {
                    divisions: true,
                    compDayInfo: true,
                    entries: {
                        with: {
                            user: true,
                            competition: true,
                            compEntryToDivisions: {
                                with: {
                                    division: true,
                                },
                            },
                        },
                    },
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
    openCompetition: publicProcedure
        .input(z.number())
        .mutation(async ({ ctx, input }) => {
            const user = await getCurrentUser()
            if (!user) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'You are not authorized to access this resource.',
                })
            }

            const comp = await ctx.db.query.competitions.findFirst({
                where: (competitions, { eq }) => eq(competitions.id, input),
                with: {
                    creator: true,
                },
            })

            if (!comp) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Competition not found.',
                })
            }
            if (comp.creator.id !== user.id) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'Unauthorized.',
                })
            }

            await ctx.db
                .update(competitions)
                .set({
                    currentState: 'open',
                })
                .where(eq(competitions.id, input))

            return true
        }),
    closeCompetition: publicProcedure
        .input(z.number())
        .mutation(async ({ ctx, input }) => {
            const user = await getCurrentUser()
            if (!user) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'You are not authorized to access this resource.',
                })
            }

            const comp = await ctx.db.query.competitions.findFirst({
                where: (competitions, { eq }) => eq(competitions.id, input),
                with: {
                    creator: true,
                },
            })

            if (!comp) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Competition not found.',
                })
            }
            if (comp.creator.id !== user.id) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'Unauthorized.',
                })
            }

            await ctx.db
                .update(competitions)
                .set({
                    currentState: 'closed',
                })
                .where(eq(competitions.id, input))

            return true
        }),
    startCompetition: publicProcedure
        .input(z.number())
        .mutation(async ({ ctx, input }) => {
            const user = await getCurrentUser()
            if (!user) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'You are not authorized to access this resource.',
                })
            }

            const comp = await ctx.db.query.competitions.findFirst({
                where: (competitions, { eq }) => eq(competitions.id, input),
                with: {
                    creator: true,
                },
            })

            if (!comp) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Competition not found.',
                })
            }
            if (comp.creator.id !== user.id) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'Unauthorized.',
                })
            }

            await ctx.db
                .update(competitions)
                .set({
                    currentState: 'started',
                })
                .where(eq(competitions.id, input))

            return true
        }),
    pauseCompetition: publicProcedure
        .input(z.number())
        .mutation(async ({ ctx, input }) => {
            const user = await getCurrentUser()
            if (!user) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'You are not authorized to access this resource.',
                })
            }

            const comp = await ctx.db.query.competitions.findFirst({
                where: (competitions, { eq }) => eq(competitions.id, input),
                with: {
                    creator: true,
                },
            })

            if (!comp) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Competition not found.',
                })
            }
            if (comp.creator.id !== user.id) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'Unauthorized.',
                })
            }

            await ctx.db
                .update(competitions)
                .set({
                    currentState: 'paused',
                })
                .where(eq(competitions.id, input))

            return true
        }),
    deleteCompetition: publicProcedure
        .input(z.number())
        .mutation(async ({ ctx, input }) => {
            const user = await getCurrentUser()
            if (!user) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'You are not authorized to access this resource.',
                })
            }

            const comp = await ctx.db.query.competitions.findFirst({
                where: (competitions, { eq }) => eq(competitions.id, input),
                with: {
                    creator: true,
                },
            })

            if (!comp) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Competition not found.',
                })
            }
            if (comp.creator.id !== user.id) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'Unauthorized.',
                })
            }

            await ctx.db.delete(competitions).where(eq(competitions.id, input))

            return true
        }),
})
