import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDate(date: string | null | Date) {
  if (!date) return ''
  const d = new Date(+date)
  return d.toLocaleDateString('en-AU', {
    weekday: 'short',
    year: 'numeric',
    day: 'numeric',
    month: 'short',
  })
}
