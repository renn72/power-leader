'use client'
import { useFormContext } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '~/components/ui/form'
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group'
import { Card, CardContent, CardTitle, CardHeader } from '~/components/ui/card'
import type { GetCompetitionByUuid } from '~/lib/types'

const Divisions = ({ competition }: { competition: GetCompetitionByUuid }) => {
  const form = useFormContext()
  return (
    <Card className='w-full sm:max-w-2xl flex flex-col lg:flex-row items-baseline'>
      <CardHeader>
        <CardTitle>Divisions</CardTitle>
      </CardHeader>
      <CardContent className='mt-4 flex flex-col gap-2 px-0 lg:px-6'>
        <FormField
          control={form.control}
          name='division'
          rules={{ required: true }}
          render={({ field }) => (
            <FormItem>
              <ToggleGroup
                type='multiple'
                orientation='horizontal'
                defaultValue={form.getValues('division') || []}
                onValueChange={(value) => {
                  field.onChange(value)
                }}
              >
                <div className='flex w-full gap-2 px-2 lg:px-6'>
                  {competition.divisions.map((item) => (
                    <FormField
                      key={item.name}
                      control={form.control}
                      name='division'
                      render={() => {
                        return (
                          <FormItem key={item.id}>
                            <FormControl>
                              <ToggleGroupItem
                                variant='secondary'
                                className='h-8 w-rounded-md border border-input tracking-tight'
                                value={item.id.toString()}
                              >
                                {item.name}
                              </ToggleGroupItem>
                            </FormControl>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
              </ToggleGroup>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
export default Divisions
