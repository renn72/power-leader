import { z } from 'zod'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '~/server/db'

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { users } from '~/server/db/schema'

export const userRouter = createTRPCRouter({
    getCurrentUser: publicProcedure.query(async ({ ctx }) => {
        const user = await currentUser()
        if (!user) {
            return false
        }
        console.log('call user')
        const res = await ctx.db.query.users.findFirst({
            where: (users, { eq }) => eq(users.clerkId, user.id),
        })
        if (!res) {
            return {
                clerkId: user.id,
                id: 0,
                name: user.fullName,
                birthDate: null,
                address: null,
                notes: null,
                instagram: null,
                openlifter: null,
                phone: null,
                createdAt: null,
                updatedAt: null,
            }
        }
        return res
    }),
    createUserAdmin: publicProcedure.mutation(async ({ ctx }) => {
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

export const getCurrentUser = async () => {
    const u = await currentUser()
    return await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.clerkId, u?.id || ''),
    })
}
