import { z } from 'zod'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '~/server/db'

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { users } from '~/server/db/schema'

import { eq } from 'drizzle-orm'

function isTuple<T>(array: T[]): array is [T, ...T[]] {
    return array.length > 0
}

const fakeUsers = [
    {
        name: 'Joe Howard',
        birthDate: new Date(1980, 0, 1),
        isFake: true,
        address: '123 Main St',
        phone: '0408123456',
        instagram: 'joehoward',
        openlifter: 'joehoward',
        notes: '',
    },
    {
        name: 'John Doe',
        birthDate: new Date(1980, 0, 1),
        isFake: true,
        address: '543 Green St',
        phone: '0423876543',
        instagram: 'johndoe',
        openlifter: 'johndoe',
        notes: '',
    },
    {
        name: 'Jane Doe',
        birthDate: new Date(1997, 5, 3),
        isFake: true,
        address: '978 Oak St',
        phone: '0419432109',
        instagram: 'janedoe',
        openlifter: 'janedoe',
        notes: '',
    },
    {
        name: 'Jack Doe',
        birthDate: new Date(2001, 4, 1),
        isFake: true,
        address: '8 Maple Rd',
        phone: '0412345678',
        instagram: 'jackdoe',
        openlifter: 'jackdoe',
        notes: '',
    },
    {
        name: 'Jill Doe',
        birthDate: new Date(1990, 0, 1),
        isFake: true,
        address: '87 Jackson St',
        phone: '0409678901',
        instagram: 'jilldoe',
        openlifter: 'jilldoe',
        notes: '',
    },
    {
        name: 'Nick Barrett',
        birthDate: new Date(1995, 4, 9),
        isFake: true,
        address: '32 Oak St',
        phone: '0409876543',
        instagram: 'nickbarrett',
        openlifter: 'nickbarrett',
        notes: '',
    },
    {
        name: 'Bob Smith',
        birthDate: new Date(1985, 0, 1),
        isFake: true,
        address: '123 Oak St',
        phone: '0409876543',
        instagram: 'bobsmith',
        openlifter: 'bobsmith',
        notes: '',
    },
    {
        name: 'Samantha Johnson',
        birthDate: new Date(1990, 0, 1),
        isFake: true,
        address: '123 Oak St',
        phone: '0409876543',
        instagram: 'samanthajohnson',
        openlifter: 'samanthajohnson',
        notes: '',
    },
    {
        name: 'Emily Lee',
        birthDate: new Date(1980, 0, 1),
        isFake: true,
        address: '123 Oak St',
        phone: '0409876543',
        instagram: 'emilylee',
        openlifter: 'emilylee',
        notes: '',
    },
]

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
            const newUser = db.insert(users).values({
                clerkId: user.id,
                name: user.fullName,
            })
            return newUser
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
    generateFakeUsers: publicProcedure.mutation(async ({ ctx }) => {
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
