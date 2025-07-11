import { TRPCError } from '@trpc/server'
import { pusherServer } from '~/server/api/pusher'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { compDayInfo, lift } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { getCurrentUser } from './user'

export const competitionDayRouter = createTRPCRouter({
  updateScreen: publicProcedure
    .input(
      z.object({
        id: z.number(),
        uuid: z.string(),
        screen1: z.string().optional(),
        screen1Size: z.string().optional(),
        screen2: z.string().optional(),
        screen2Size: z.string().optional(),
        screen3: z.string().optional(),
        screen3Size: z.string().optional(),
        screen4: z.string().optional(),
        screen4Size: z.string().optional(),
        screen5: z.string().optional(),
        screen5Size: z.string().optional(),
        screen6: z.string().optional(),
        screen6Size: z.string().optional(),
        screen7: z.string().optional(),
        screen7Size: z.string().optional(),
        screen8: z.string().optional(),
        screen8Size: z.string().optional(),
        screen9: z.string().optional(),
        screen9Size: z.string().optional(),
        screen10: z.string().optional(),
        screen10Size: z.string().optional(),
        screen11: z.string().optional(),
        screen11Size: z.string().optional(),
        screen12: z.string().optional(),
        screen12Size: z.string().optional(),
        resultAge: z.string().optional(),
        resultGender: z.string().optional(),
        resultWC: z.string().optional(),
        resultDiv: z.string().optional(),
        resultsReveal: z.string().optional(),
        resultsLift: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await getCurrentUser()
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to access this resource.',
        })
      }

      console.log('input', input)

      const res = await ctx.db
        .update(compDayInfo)
        .set({
          screen1: input.screen1,
          screen1Size: input.screen1Size,
          screen2: input.screen2,
          screen2Size: input.screen2Size,
          screen3: input.screen3,
          screen3Size: input.screen3Size,
          screen4: input.screen4,
          screen4Size: input.screen4Size,
          screen5: input.screen5,
          screen5Size: input.screen5Size,
          screen6: input.screen6,
          screen6Size: input.screen6Size,
          screen7: input.screen7,
          screen7Size: input.screen7Size,
          screen8: input.screen8,
          screen8Size: input.screen8Size,
          screen9: input.screen9,
          screen9Size: input.screen9Size,
          screen10: input.screen10,
          screen10Size: input.screen10Size,
          screen11: input.screen11,
          screen11Size: input.screen11Size,
          screen12: input.screen12,
          screen12Size: input.screen12Size,
          resultAge: input.resultAge,
          resultGender: input.resultGender,
          resultWC: input.resultWC,
          resultDiv: input.resultDiv,
          resultsReveal: input.resultsReveal,
          resultsLift: input.resultsLift,
        })
        .where(eq(compDayInfo.compId, input.id))
        .returning({
          lift: compDayInfo.lift,
          round: compDayInfo.round,
          bracket: compDayInfo.bracket,
          index: compDayInfo.index,
          nextIndex: compDayInfo.nextIndex,
        })

      const info = res?.[0]

      if (info) {
        await pusherServer.trigger('competition-' + input.uuid, 'update', {
          lift: info.lift,
          round: info.round,
          bracket: info.bracket,
          index: info.index,
          nextIndex: info.nextIndex,
        })
      }

      return res
    }),
  updateLift: publicProcedure
    .input(
      z.object({
        id: z.number(),
        uuid: z.string(),
        lift: z.string(),
        round: z.number(),
        bracket: z.number(),
        index: z.number(),
        nextIndex: z.number().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await getCurrentUser()
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to access this resource.',
        })
      }

      const res = await ctx.db
        .update(compDayInfo)
        .set({
          lift: input.lift,
          round: input.round,
          bracket: input.bracket,
          index: input.index,
          nextIndex: input.nextIndex,
          updatedAt: Date.now().toString(),
        })
        .where(eq(compDayInfo.compId, input.id))
        .returning({
          lift: compDayInfo.lift,
          round: compDayInfo.round,
          bracket: compDayInfo.bracket,
          index: compDayInfo.index,
          nextIndex: compDayInfo.nextIndex,
        })

      console.log('res', res)

      await pusherServer.trigger('competition-' + input.uuid, 'update', {
        lift: input.lift,
        round: input.round,
        bracket: input.bracket,
        index: input.index,
        nextIndex: input.nextIndex,
      })

      return res
    }),
  startTimer: publicProcedure
    .input(
      z.object({
        id: z.number(),
        uuid: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await getCurrentUser()
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to access this resource.',
        })
      }

      console.log('input', input)

      await pusherServer.trigger('competition-' + input.uuid, 'update', {
        timerStarted: true,
        timerReset: false,
        timerStopped: false,
      })

      return true
    }),
  stopTimer: publicProcedure
    .input(
      z.object({
        id: z.number(),
        uuid: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await getCurrentUser()
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to access this resource.',
        })
      }

      console.log('input', input)

      await pusherServer.trigger('competition-' + input.uuid, 'update', {
        timerStarted: false,
        timerReset: false,
        timerStopped: true,
      })

      return true
    }),
  resetTimer: publicProcedure
    .input(
      z.object({
        id: z.number(),
        uuid: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await getCurrentUser()
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to access this resource.',
        })
      }

      console.log('input', input)

      await pusherServer.trigger('competition-' + input.uuid, 'update', {
        timerStarted: false,
        timerReset: true,
        timerStopped: false,
      })

      return true
    }),
  headJudgeClearLift: publicProcedure
    .input(
      z.object({
        id: z.number(),
        entryId: z.number(),
        uuid: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await getCurrentUser()
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to access this resource.',
        })
      }

      let state = 'judged'

      const res = await ctx.db
        .update(lift)
        .set({
          isGoodOne: null,
          isGoodTwo: null,
          isGoodThree: null,
          updatedAt: Date.now().toString(),
          state: state,
        })
        .where(eq(lift.id, input.id))
        .returning({
          isGoodOne: lift.isGoodOne,
        })

      await pusherServer.trigger('competition-' + input.uuid, 'judge', {
        id: input.id,
        entryId: input.entryId,
        judge: 1,
        isGood: null,
      })
      await pusherServer.trigger('competition-' + input.uuid, 'judge', {
        id: input.id,
        entryId: input.entryId,
        judge: 2,
        isGood: null,
      })
      await pusherServer.trigger('competition-' + input.uuid, 'judge', {
        id: input.id,
        entryId: input.entryId,
        judge: 3,
        isGood: null,
      })
      return res
    }),
  headJudgePassLift: publicProcedure
    .input(
      z.object({
        id: z.number(),
        entryId: z.number(),
        uuid: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await getCurrentUser()
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to access this resource.',
        })
      }

      console.log('input', input)
      let state = 'judged'

      const res = await ctx.db
        .update(lift)
        .set({
          isGoodOne: true,
          isGoodTwo: true,
          isGoodThree: true,
          updatedAt: Date.now().toString(),
          state: state,
        })
        .where(eq(lift.id, input.id))
        .returning({
          isGoodOne: lift.isGoodOne,
        })

      await pusherServer.trigger('competition-' + input.uuid, 'judge', {
        id: input.id,
        entryId: input.entryId,
        judge: 1,
        isGood: true,
      })
      await pusherServer.trigger('competition-' + input.uuid, 'judge', {
        id: input.id,
        entryId: input.entryId,
        judge: 2,
        isGood: true,
      })
      await pusherServer.trigger('competition-' + input.uuid, 'judge', {
        id: input.id,
        entryId: input.entryId,
        judge: 3,
        isGood: true,
      })
      return res
    }),
  headJudgeFailLift: publicProcedure
    .input(
      z.object({
        id: z.number(),
        entryId: z.number(),
        uuid: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await getCurrentUser()
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to access this resource.',
        })
      }

      console.log('input', input)
      let state = 'judged'

      const res = await ctx.db
        .update(lift)
        .set({
          isGoodOne: false,
          isGoodTwo: false,
          isGoodThree: false,
          updatedAt: Date.now().toString(),
          state: state,
        })
        .where(eq(lift.id, input.id))
        .returning({
          isGoodOne: lift.isGoodOne,
        })

      await pusherServer.trigger('competition-' + input.uuid, 'judge', {
        id: input.id,
        entryId: input.entryId,
        judge: 1,
        isGood: false,
      })
      await pusherServer.trigger('competition-' + input.uuid, 'judge', {
        id: input.id,
        entryId: input.entryId,
        judge: 2,
        isGood: false,
      })
      await pusherServer.trigger('competition-' + input.uuid, 'judge', {
        id: input.id,
        entryId: input.entryId,
        judge: 3,
        isGood: false,
      })
      return res
    }),
  updateIsLiftGood: publicProcedure
    .input(
      z.object({
        id: z.number(),
        entryId: z.number(),
        uuid: z.string(),
        isGoodOne: z.boolean().optional().nullable(),
        isGoodTwo: z.boolean().optional().nullable(),
        isGoodThree: z.boolean().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await getCurrentUser()
      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to access this resource.',
        })
      }

      console.log('input', input)
      let state = 'judged'

      if (input.isGoodOne !== undefined) {
        if (input.isGoodOne === null) state = 'created'
        const res = await ctx.db
          .update(lift)
          .set({
            isGoodOne: input.isGoodOne,
            updatedAt: Date.now().toString(),
            state: state,
          })
          .where(eq(lift.id, input.id))
          .returning({
            isGoodOne: lift.isGoodOne,
          })

        await pusherServer.trigger('competition-' + input.uuid, 'judge', {
          id: input.id,
          entryId: input.entryId,
          judge: 1,
          isGood: input.isGoodOne,
        })
        return res
      }

      if (input.isGoodTwo !== undefined) {
        if (input.isGoodTwo === null) state = 'created'
        const res = await ctx.db
          .update(lift)
          .set({
            isGoodTwo: input.isGoodTwo,
            updatedAt: Date.now().toString(),
            state: state,
          })
          .where(eq(lift.id, input.id))
          .returning({
            isGoodTwo: lift.isGoodTwo,
          })

        await pusherServer.trigger('competition-' + input.uuid, 'judge', {
          id: input.id,
          entryId: input.entryId,
          judge: 2,
          isGood: input.isGoodTwo,
        })
        return res
      }

      if (input.isGoodThree !== undefined) {
        if (input.isGoodThree === null) state = 'created'
        const res = await ctx.db
          .update(lift)
          .set({
            isGoodThree: input.isGoodThree,
            updatedAt: Date.now().toString(),
            state: state,
          })
          .where(eq(lift.id, input.id))
          .returning({
            isGoodThree: lift.isGoodThree,
          })

        await pusherServer.trigger('competition-' + input.uuid, 'judge', {
          id: input.id,
          entryId: input.entryId,
          judge: 3,
          isGood: input.isGoodThree,
        })
        return res
      }
    }),
})
