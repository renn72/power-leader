'use client'
export const dynamic = 'force-dynamic'
import { api } from '~/trpc/react'
const Judge = ({ params }: { params: { judge: string; comp: string } }) => {
  const { comp, judge } = params
  const judgeNumber = Number(judge.split('-')[1])
  const { data: competition, isLoading: competitionLoading } =
    api.competition.getCompetitionByUuid.useQuery(comp)

  if (!competition) return null
  if (competitionLoading) return null
  if(judgeNumber !== 1 && judgeNumber !== 2 && judgeNumber !== 3) return <div>Not Found</div>

  console.log(competition)

  return (
    <div>
      <div>Judge: {params.judge}</div>
      <div>Competition: {params.comp}</div>
    </div>
  )
}

export default Judge
