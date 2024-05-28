import { createTRPCRouter, publicProcedure, } from "~/server/api/trpc";
import { ageDivisions } from "~/server/db/schema";
import { insertDivisionSchema } from "~/server/db/schema";

export const divisionRouter = createTRPCRouter({

  create: publicProcedure
    .input(insertDivisionSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(ageDivisions).values(input);
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.ageDivisions.findMany({
      orderBy: (competitions, { desc }) => [desc(competitions.createdAt)],
    });
    return res;
  }),
});
