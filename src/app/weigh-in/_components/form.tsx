'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { api } from '~/trpc/react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray, FormProvider } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { toast } from 'sonner'

import Equipment from './_components/equipment'
import Personal from './_components/personal'
import PersonalInfo from './_components/personal-info'
import Events from './_components/events'
import Divisions from './_components/divisions'
import LiftInfo from './_components/lift-info'
import Notes from './_components/notes'
import WeighIn from './_components/weigh-in'

import { GetCompetitionEntryById, GetCompetitionById } from '~/lib/types'

export const dynamic = 'force-dynamic'

const formSchema = z.object({
  address: z.string(),
  phone: z.string(),
  instagram: z.string(),
  openlifter: z.string(),
  birthDate: z.date(),
  equipment: z.string(),
  gender: z.string(),
  predictedWeight: z.string(),
  weight: z.string(),
  events: z.array(z.string()),
  division: z.array(z.string()),
  squatOpener: z.string(),
  squarRackHeight: z.string(),
  benchOpener: z.string(),
  benchRackHeight: z.string(),
  deadliftOpener: z.string(),
  squatPB: z.string(),
  benchPB: z.string(),
  deadliftPB: z.string(),
  notes: z.string(),
})

const WeighInForm = ({
  entry,
  competition,
}: {
  entry: GetCompetitionEntryById | null
  competition: GetCompetitionById
}) => {
  const [isPending, setIsPending] = useState(false)
  const [submitText, setSubmitText] = useState('Submit')

  const [isEditPersonal, setIsEditPersonal] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: entry?.user && entry.user.address ? entry.user.address : '',
      phone: entry?.user && entry.user.phone ? entry.user.phone : '',
      instagram:
        entry?.user && entry.user.instagram ? entry.user.instagram : '',
      openlifter:
        entry?.user && entry.user.openlifter ? entry.user.openlifter : '',
      birthDate:
        entry?.user && entry.user.birthDate ? entry.user.birthDate : undefined,
      equipment: entry?.equipment ? entry.equipment : '',
      gender: entry?.gender ? entry.gender : '',
      predictedWeight: entry?.predictedWeight ? entry.predictedWeight : '',
      weight: entry?.weight ? entry.weight : '',
      events: entry?.events
        ? entry.events.map((event) => event.event?.id.toString())
        : [],
      division:
        entry?.compEntryToDivisions?.map((division) =>
          division.division?.id.toString(),
        ) || [],
      squatOpener: entry?.squatOpener ? entry.squatOpener : '',
      squarRackHeight: entry?.squarRackHeight ? entry.squarRackHeight : '',
      benchOpener: entry?.benchOpener ? entry.benchOpener : '',
      benchRackHeight: entry?.benchRackHeight ? entry.benchRackHeight : '',
      deadliftOpener: entry?.deadliftOpener ? entry.deadliftOpener : '',
      squatPB: entry?.squatPB ? entry.squatPB : '',
      benchPB: entry?.benchPB ? entry.benchPB : '',
      deadliftPB: entry?.deadliftPB ? entry.deadliftPB : '',
      notes: entry?.notes ? entry.notes : '',
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log('formData', data)
  }

  useEffect(() => {
    if (entry) {
      form.reset({
        address: entry?.user && entry.user.address ? entry.user.address : '',
        phone: entry?.user && entry.user.phone ? entry.user.phone : '',
        instagram:
          entry?.user && entry.user.instagram ? entry.user.instagram : '',
        openlifter:
          entry?.user && entry.user.openlifter ? entry.user.openlifter : '',
        birthDate: entry.birthDate ? entry.birthDate : undefined,
        equipment: entry?.equipment ? entry.equipment : '',
        gender: entry?.gender ? entry.gender : '',
        predictedWeight: entry?.predictedWeight ? entry.predictedWeight : '',
        weight: entry?.weight ? entry.weight : '',
        events: entry.events
          ? entry.events.map((event) => event.event?.id.toString())
          : [],
        division:
          entry?.compEntryToDivisions?.map((division) =>
            division.division?.id.toString(),
          ) || [],
        squatOpener: entry?.squatOpener ? entry.squatOpener : '',
        squarRackHeight: entry?.squarRackHeight ? entry.squarRackHeight : '',
        benchOpener: entry?.benchOpener ? entry.benchOpener : '',
        benchRackHeight: entry?.benchRackHeight ? entry.benchRackHeight : '',
        deadliftOpener: entry?.deadliftOpener ? entry.deadliftOpener : '',
        squatPB: entry?.squatPB ? entry.squatPB : '',
        benchPB: entry?.benchPB ? entry.benchPB : '',
        deadliftPB: entry?.deadliftPB ? entry.deadliftPB : '',
        notes: entry?.notes ? entry.notes : '',
      })
    }
    console.log('formData', form.getValues())
  }, [entry])

  if (!competition) {
    return <div>Competition not found</div>
  }

  if (!entry) return <div>Entry not found</div>

  return (
    <>
      <div className='flex w-full flex-col items-center gap-4'>
        <FormProvider {...form}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex w-full max-w-2xl flex-col items-center gap-2'
            >
              {isEditPersonal ? <Personal name={entry?.user?.name || ''} /> : <PersonalInfo entry={entry} />}
              <Equipment competition={competition} />
              <Events competition={competition} />
              <Divisions competition={competition} />
              <WeighIn />
              <LiftInfo />
              <Notes />
              <Button
                className='mt-4 w-min min-w-[170px]'
                type='submit'
              >
                {isPending && (
                  <div className='mr-3 animate-spin'>
                    <div className='h-4 w-4 rounded-full border-b-2 border-t-2 border-border' />
                  </div>
                )}
                {submitText}
              </Button>
            </form>
          </Form>
        </FormProvider>
      </div>
    </>
  )
}

export default WeighInForm
