import { z } from 'zod'

export const ageDivisionsData = [
  { name: 'Open', minAge: '', maxAge: '', info: 'Open' },
  { name: 'Teen', minAge: 13, maxAge: 19, info: 'Teen' },
  { name: 'Master', minAge: 50, maxAge: '', info: 'Masters' },
  { name: 'First Timers', minAge: '', maxAge: '', info: 'First powerlifting event' },
  { name: 'Novice', minAge: '', maxAge: '', info: 'Second powerlifting event' },
]

export const eventsData = [
  'Squat, Bench, Deadlift',
  'Squat only',
  'Bench only',
  'Deadlift only',
  'Push Pull',
  'Squat, Bench',
  'Squat, Deadlift',
  'Team Battle',
]
