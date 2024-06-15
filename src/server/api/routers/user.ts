import { z } from 'zod'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '~/server/db'

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { users } from '~/server/db/schema'

import { eq } from 'drizzle-orm'

import { generateFullName, generateName } from '~/lib/utils'

function isTuple<T>(array: T[]): array is [T, ...T[]] {
    return array.length > 0
}

export const userRouter = createTRPCRouter({
    getCurrentUser: publicProcedure.query(async ({ ctx }) => {
        const user = await currentUser()
        if (!user) {
            return false
        }
        const res = await ctx.db.query.users.findFirst({
            where: (users, { eq }) => eq(users.clerkId, user.id),
        })
        if (!res) {
            const newUser = await db
                .insert(users)
                .values({
                    clerkId: user.id,
                    name: user.fullName,
                })
                .returning({ id: users.id })
            const id = newUser[0]?.id || 0
            const newRes = await ctx.db.query.users.findFirst({
                where: (users, { eq }) => eq(users.id, id),
            })
            return newRes
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
    isAdmin: publicProcedure.query(async ({ ctx }) => {
        const user = await currentUser()
        if (!user) {
            return false
        }
        console.log(user)
        if (user.privateMetadata?.admin == 'true') {
            console.log('true')
            return true
        }
        return false
    }),
    generateFakeUsers: publicProcedure.mutation(async ({ ctx }) => {
        const fakeUsers = [...Array(10).keys()].map(() => {
            const name = generateFullName()
            return {
                name: name,
                // generate a random birth date
                birthDate: new Date(
                    Math.floor(Math.random() * 100) + 1980,
                    Math.floor(Math.random() * 12),
                    Math.floor(Math.random() * 26),
                ),
                isFake: true,
                address: `${Math.floor(Math.random() * 100)} ${generateName()} St`,
                // generate a random phone number
                phone: `04${Math.floor(Math.random() * 100)
                    .toString()
                    .padStart(3, '0')}${Math.floor(Math.random() * 100)
                    .toString()
                    .padStart(4, '0')}`,
                instagram: '@' + name.replace(' ', '').toLowerCase(),
                openlifter:
                    'www.openpowerlifting.org/' +
                    name.replace(' ', '').toLowerCase(),
                notes: '',
            }
        })
        const usersGen = fakeUsers.map((name) =>
            db.insert(users).values({
                name: name.name,
                birthDate: name.birthDate,
                address: name.address,
                phone: name.phone,
                instagram: name.instagram,
                openlifter: name.openlifter,
                notes: name.notes,
                isFake: true,
            }),
        )
        if (isTuple(usersGen)) {
            await ctx.db.batch(usersGen)
        }
        return true
    }),
    getFakeUsers: publicProcedure.query(async ({ ctx }) => {
        const res = await db.query.users.findMany({
            where: (users, { eq }) => eq(users.isFake, true),
        })
        return res
    }),
    deleteFakeUsers: publicProcedure.mutation(async ({ ctx }) => {
        const res = await db.delete(users).where(eq(users.isFake, true))
        return res
    }),
})

export const getCurrentUser = async () => {
    const u = await currentUser()
    return await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.clerkId, u?.id || ''),
    })
}
