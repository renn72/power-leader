'use client'

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import type { GetCompetitionByUuid } from '~/lib/types'

const WC_Field = ({
  competition,
  weight_class,
}: {
  competition: GetCompetitionByUuid
  weight_class: string
}) => {
  const wc =
    weight_class === 'wc_male'
      ? competition.wc_male?.split('/')
      : weight_class === 'wc_female'
        ? competition.wc_female?.split('/')
        : competition.wc_mix?.split('/')

  if (!wc) return null

  return (
    <Card className='w-full'>
      <CardHeader className='mb-4'>
        <CardTitle>
         {weight_class === 'wc_male' ? 'Male' : 'Female'} Weight Class
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex w-full flex-wrap items-center gap-4'>
          {wc.map((e: string) => (
            <Badge
              key={e}
              className='w-14 items-center justify-center'
            >
              {e}kg
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default WC_Field
