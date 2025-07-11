'use client'

import { useState } from 'react'

import LeaderBoard from '~/app/_components/board/leader-board'
import { wcFData, wcMData } from '~/lib/store'
import { api } from '~/trpc/react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const ages =  [
  {
    name : 'teen',
    min : 14,
    max : 16,
  },
  {
    name : 'sub-junior',
    min: 17,
    max: 19,

  },
  {
    name : 'junior',
    min: 20,
    max: 23,
  },
  {
    name : 'open',
    min: 24,
    max: 39,
  },
  {
    name : 'm1',
    min: 40,
    max: 49,
  },
  {
    name : 'm2',
    min: 50,
    max: 59,
  },
  {
    name : 'm3',
    min: 60,
    max: 69,
  },
  {
    name : 'm4',
    min: 70,
    max: 79,
  },
  {
    name : 'm5',
    min: 80,
    max: 999,
  },
]
const Board = () => {
  const [table, setTable] = useState('all')
  const [gender, setGender] = useState('')
  const [wc, setWC] = useState('')
  const [age, setAge] = useState('')

  const g = gender ? gender : null
  const ctx = api.useUtils()
  const { data } = api.competition.get.useQuery(1, {
    refetchInterval: 60000,
  })

  if (!data) return null

  return (
    <div className='w-full overflow-hidden'>
      <div className='px-1 py-1 grid grid-cols-4 max-w-[500px] items-center gap-1 bg-background top-0 left-0 z-[200] w-full'>
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
              <SelectValue placeholder='WC' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value={'all'}
              >
                All
              </SelectItem>
              {wcFData.map((i) => {
                return (
                  <SelectItem
                    key={i}
                    value={i.toString()}
                  >
                    {i}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </Select>
        <Select
          value={age}
          onValueChange={(value) => {
            setAge(value)
          }}
        >
          <SelectTrigger className='w-full h-7 capitalize'>
            <SelectValue placeholder='Age' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All</SelectItem>
            {ages.map((i) => {
              return (
                <SelectItem
                  key={i.name}
                  value={i.name}
                  className='capitalize'
                >
                  {i.name}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      <div className='w-full'>
        <LeaderBoard
          competition={data}
          table={table}
          gender={g}
          wc={wc}
          age={age}
        />
      </div>
    </div>
  )
}

export default Board
