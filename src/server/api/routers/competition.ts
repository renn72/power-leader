import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { competitions, insertCompetitionSchema } from "~/server/db/schema";

export const competitionRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(insertCompetitionSchema)
    .mutation(async ({ ctx, input }) => {
      console.log("input", input);

      return true
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.competitions.findMany({
      orderBy: (competitions, { desc }) => [desc(competitions.createdAt)],
    });
    return res;
  }),
});
