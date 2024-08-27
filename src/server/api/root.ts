import { createCallerFactory, createTRPCRouter } from '~/server/api/trpc'

import { competitionRouter } from './routers/competition'
import { divisionRouter } from './routers/division'
import { userRouter } from './routers/user'
import { compEntryRouter } from './routers/comp-entry'
import { competitionDayRouter } from './routers/comp-day'
import { liftRouter } from './routers/lift'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  competition: competitionRouter,
  competitionDay: competitionDayRouter,
  division: divisionRouter,
  user: userRouter,
  compEntry: compEntryRouter,
  lift: liftRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)
