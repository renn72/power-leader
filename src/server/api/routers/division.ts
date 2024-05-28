import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { ageDivisions } from '~/server/db/schema'
import { insertDivisionSchema } from '~/server/db/schema'
import { z } from 'zod'
import { eq } from 'drizzle-orm'

export const divisionRouter = createTRPCRouter({
  create: publicProcedure
    .input(insertDivisionSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(ageDivisions).values(input)
    }),

  generate: publicProcedure
    .input(z.array(insertDivisionSchema))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(ageDivisions).values(input)
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.ageDivisions.findMany()
    return res
  }),

  delete: publicProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    const res = await ctx.db
      .delete(ageDivisions)
      .where(eq(ageDivisions.id, input))
      .returning()
    return res
  }),

  deleteAll: publicProcedure.mutation(async ({ ctx }) => {
    const res = await ctx.db.delete(ageDivisions).returning()
    return res
  }),
})
