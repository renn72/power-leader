'use client'

import { useState } from 'react'

import { useSearchParams } from 'next/navigation'

import LeaderBoard from '~/app/_components/board/leader-board'
import { wcFData, wcMData } from '~/lib/store'
import { api } from '~/trpc/react'

import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const Board = () => {
  const [table, setTable] = useState('all')
  const [gender, setGender] = useState('')
  const [wc, setWC] = useState('')

  const g = gender ? gender : null
  const ctx = api.useUtils()
  const { data } = api.competition.get.useQuery(1, {
    refetchInterval: 60000,
  })
  console.log(new Date().getMinutes())

  if (!data) return null

  return (
    <div className='w-full overflow-hidden'>
      <div className='px-2 py-1 grid grid-cols-3 max-w-[500px] items-center gap-2 bg-background top-0 left-0 z-[200] w-full'>
        <Select
          value={table}
          onValueChange={(value) => {
            setTable(value)
          }}
        >
          <SelectTrigger className='w-full h-7'>
            <SelectValue placeholder='Division' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All</SelectItem>
            <SelectItem value='open'>Open</SelectItem>
            <SelectItem value='teen'>Teen</SelectItem>
            <SelectItem value='master'>Master</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={gender}
          onValueChange={(value) => {
            setGender(value)
          }}
        >
          <SelectTrigger className='w-full h-7'>
            <SelectValue placeholder='Gender' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All</SelectItem>
            <SelectItem value='male'>Male</SelectItem>
            <SelectItem value='female'>Female</SelectItem>
          </SelectContent>
          <Select
            value={wc}
            onValueChange={(value) => {
              setWC(value)
            }}
          >
            <SelectTrigger className='w-full h-7'>
              <SelectValue placeholder='wc' />
            </SelectTrigger>
            <SelectContent>
              {wcFData.map((i) => {
                return <SelectItem value={i.toString()}>{i}</SelectItem>
              })}
            </SelectContent>
          </Select>
        </Select>
      </div>

    <div className='w-full'>
      <LeaderBoard
        competition={data}
        table={table}
        gender={g}
        wc={wc}
      />
    </div>
    </div>
  )
}

export default Board
