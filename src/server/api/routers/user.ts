import { z } from 'zod'
import { currentUser } from '@clerk/nextjs/server'

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { users } from '~/server/db/schema'

export const userRouter = createTRPCRouter({
  getCurrentUser: publicProcedure.query(async ({ ctx }) => {
    const user = await currentUser()
    if (!user) {
      return false
    }
    console.log('user', user)
    const res = await ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.clerkId, user.id),
    })
    if (!res) {
      return { clerkId: user.id, id: 0}
    }
    return res
  }),
  createUserAdmin: publicProcedure
    .mutation(async ({ ctx, }) => {
    const user = await currentUser()
    if (!user) {
      return false
    }
    const res = await ctx.db.insert(users).values({
        clerkId: user.id,
        name: user.fullName,
    })

      return res
    }),
})
