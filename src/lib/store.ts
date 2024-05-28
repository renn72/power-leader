import { insertDivisionSchema } from '~/server/db/schema'
import { z } from 'zod'

export const ageDivisionsData = [
  {
    name: 'Teen Boys',
    age: '',
    gender: 'M',
    info: '',
  },
  {
    name: 'Teen Girls',
    age: '',
    gender: 'F',
    info: '',
  },
  {
    name: 'Open Men',
    age: '',
    gender: 'M',
    info: '',
  },
  {
    name: 'Open Women',
    age: '',
    gender: 'F',
    info: '',
  },
  {
    name: '50+ Male',
    age: '',
    gender: 'M',
    info: '',
  },
  {
    name: '50+ Women',
    age: '',
    gender: 'F',
    info: '',
  },
  {
    name: 'Team Battle',
    age: '',
    gender: '',
    info: '',
  },
  {
    name: 'Novice',
    age: '',
    gender: '',
    info: '',
  },
  {
    name: 'First Timers',
    age: '',
    gender: '',
    info: '',
  },
] as z.infer<typeof insertDivisionSchema>[]
