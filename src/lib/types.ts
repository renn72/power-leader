import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

import { appRouter } from '~/server/api/root'

type RouterInputs = inferRouterInputs<typeof appRouter>
type RouterOutputs = inferRouterOutputs<typeof appRouter>

export type GetCompetitionByUuid = RouterOutputs['competition']['getCompetitionByUuid']
export type GetCompetitionById = RouterOutputs['competition']['get']

export type GetCompetitionEntryById = RouterOutputs['compEntry']['get']
