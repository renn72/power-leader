import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { competitions, } from "~/server/db/schema";

export const competitionRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(competitions).values({
        name: input.name,
        creatorId: 1,
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const res = await ctx.db.query.posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
    return res;
  }),
});
