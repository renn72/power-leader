import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'

import { competitions, divisions } from '~/server/db/schema'

import { getCurrentUser } from './user'

function isTuple<T>(array: T[]): array is [T, ...T[]] {
  return array.length > 0
}

const createSchema = z.object({
  name: z.string().min(2),
  creatorId: z.number(),
  federation: z.string(),
  country: z.string(),
  state: z.string(),
  city: z.string(),
  date: z.date(),
  daysOfCompetition: z.number().nonnegative().int().min(1),
  platforms: z.number().nonnegative().int().min(1),
  rules: z.string(),
  notes: z.string(),
  events: z.string(),
  equipment: z.string(),
  formular: z.string(),
  wc_male: z.string(),
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
  wc_female: z.string(),
  wc_mix: z.string(),
})

export const competitionRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      }
    }),

  create: publicProcedure
    .input(createSchema)
    .mutation(async ({ ctx, input }) => {
      console.log('input', input)

      const resComp = await ctx.db
        .insert(competitions)
        .values({
          ...input,
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
            minAge: Number(division.minAge),
            maxAge: Number(division.maxAge),
            info: division.info || '',
            compId: resComp[0]?.id || 0,
          }),
      )

      if (isTuple(ins)) {
        await ctx.db.batch(ins)
      }
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.competitions.findMany({
      orderBy: (competitions, { desc }) => [desc(competitions.createdAt)],
    })
    return res
  }),
  getMyCompetitions: publicProcedure.query(async ({ ctx }) => {
    const user = await getCurrentUser()
    return user
  }),
})
