'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { useState } from 'react'
import { api } from '~/trpc/react'
import { useSearchParams } from 'next/navigation'
import LeaderBoard from '~/app/_components/board/leader-board'

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

  const g = gender ? gender : null
  const comp = 'Atlas-Classic-7-12-2024'
  const ctx = api.useUtils()
  const { data } = api.competition.getCompetitionByUuid.useQuery(comp, {
    refetchInterval: 60000,
  })
  console.log(new Date().getMinutes())

  if (!data) return null

  return (
    <div className='w-full'>
      <div className='mx-2 my-2 flex items-center gap-2 '>
        <Select
          value={table}
          onValueChange={(value) => {
            setTable(value)
          }}
        >
          <SelectTrigger className='w-[180px]'>
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
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Gender' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All</SelectItem>
            <SelectItem value='male'>Male</SelectItem>
            <SelectItem value='female'>Female</SelectItem>
          </SelectContent>
        </Select>
      </div>
        <LeaderBoard
          competition={data}
          table={table}
          gender={g}
        />
    </div>
  )
}

export default Board
