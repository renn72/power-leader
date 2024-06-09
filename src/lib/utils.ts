import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDateFromString(date: string ) {
  const d = new Date(Date.parse(date))
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`
}

export function getFormattedDate(date: Date) {
  const d = new Date(date)
  return d.toLocaleDateString(
        'en-AU',
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        },
    )
}

export function getDateFromDate(date: Date ) {
  const d = new Date(date)
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`
}

