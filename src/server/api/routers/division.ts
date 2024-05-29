import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { divisions } from '~/server/db/schema'
import { insertDivisionSchema } from '~/server/db/schema'
import { z } from 'zod'
import { eq } from 'drizzle-orm'

export const divisionRouter = createTRPCRouter({
  create: publicProcedure
    .input(insertDivisionSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(divisions).values(input)
    }),

  generate: publicProcedure
    .input(z.array(insertDivisionSchema))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(divisions).values(input)
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.divisions.findMany()
    return res
  }),

  delete: publicProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    const res = await ctx.db
      .delete(divisions)
      .where(eq(divisions.id, input))
      .returning()
    return res
  }),

  deleteAll: publicProcedure.mutation(async ({ ctx }) => {
    const res = await ctx.db.delete(divisions).returning()
    return res
  }),
})
