'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '~/components/ui/button'
import { api } from '~/trpc/react'

export const dynamic = 'force-dynamic'

export default function Home() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = searchParams.get('redirect_url')

  if (pathname) {
    router.push(pathname)
    return null
  }

  return (
    <section className='flex h-[100svh] w-full flex-col items-center justify-between gap-8 overflow-hidden bg-black from-black to-yellow-500 px-4 py-6 text-white'>
      <Image
        src='/showdown.jpeg'
        alt='board'
        width={1040}
        height={1040}
        style={{
          objectFit: 'cover',
          height: '50vh',
        }}
      />
      <div className='flex flex-col items-center justify-between gap-4 h-[30vh]'>
        <div className='flex items-center justify-center gap-4'>
          <Link
            href='/scoreboard'
            className=''
          >
            <Button className='bg-white/90 text-black'>Scoreboard</Button>
          </Link>
          <Link
            href='/flights'
            className=''
          >
            <Button className='bg-white/90 text-black'>Flights</Button>
          </Link>
        </div>

        <Link
          href='/admin'
          className=''
        >
          <Button className='bg-black text-slate-200 border-slate-200/20 border'>
            Admin
          </Button>
        </Link>
      </div>
    </section>
  )
}
