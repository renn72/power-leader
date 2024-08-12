'use client'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import type { GetCompetitionByUuid } from '~/lib/types'
import WC_Field from './wc_field'
const CompInfo = ({ competition }: { competition: GetCompetitionByUuid }) => {
  return (
    <div className='flex w-full flex-col items-center'>
      <div className='flex w-full max-w-2xl flex-col items-center gap-2 text-lg font-medium'>
        <Card className='w-full'>
          <CardHeader></CardHeader>
          <CardContent className='flex flex-col gap-2'>
            <div className='flex w-full items-end gap-4'>
              <div>Name: {competition.name}</div>
              <div>Date: {competition.date?.toLocaleDateString()}</div>
            </div>

            <div className='flex w-full items-end gap-4'>
              <div>City: {competition.city}</div>
              <div>State: {competition.state}</div>
            </div>
            <div className='flex w-full items-end gap-4'>
              <div>Country: {competition.country}</div>
              <div>Federation: {competition.federation}</div>
            </div>

            <div className='flex w-full items-end gap-4'>
              <div>Notes: {competition.notes}</div>
            </div>
          </CardContent>
        </Card>

        <Card className='w-full'>
          <CardContent>
            <CardHeader></CardHeader>
            <div className='flex w-full items-center gap-4'>
              <div>Days: {competition.daysOfCompetition}</div>
              <div>Platforms: {competition.platforms}</div>
            </div>
          </CardContent>
        </Card>

        <Card className='w-full'>
          <CardHeader></CardHeader>
          <CardContent>
            <div className='flex w-full items-center gap-4'>
              <div>
                Events: {competition.events.map((e) => e.name).join(' * ')}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='w-full'>
          <CardHeader></CardHeader>
          <CardContent>
            <div className='flex w-full items-center gap-4'>
              <div>Equipment: {competition.equipment}</div>
            </div>
          </CardContent>
        </Card>

        <Card className='w-full'>
          <CardHeader></CardHeader>
          <CardContent>
            <div className='flex w-full flex-col items-start gap-4'>
              <div className='grid w-full grid-cols-4 gap-2'>
                <div>Division</div>
                <div>Min Age</div>
                <div>Max Age</div>
                <div>Info</div>
              </div>

              {competition.divisions.map((e) => (
                <div
                  key={e.id}
                  className='grid w-full grid-cols-4 gap-2'
                >
                  <div>{e.name}</div>
                  <div>{e.minAge}</div>
                  <div>{e.maxAge}</div>
                  <div>{e.info}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <WC_Field
          competition={competition}
          weight_class='wc_male'
        />

        <WC_Field
          competition={competition}
          weight_class='wc_female'
        />

        <Card className='w-full'>
          <CardHeader></CardHeader>
          <CardContent>
            <div className='flex w-full items-center gap-4'>
              <div>Formula: {competition.formular}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CompInfo
