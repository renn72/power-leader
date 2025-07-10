'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '~/components/ui/button'

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
    <section className='flex h-[100svh] w-[100vw] flex-col items-center justify-between gap-8 overflow-hidden bg-black from-black to-yellow-500 px-4 py-6 text-white relative'>
      <div className='absolute z-[5] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50 pb-40'>
      <Image
        src='/atlas.png'
        alt='board'
        width={550}
        height={1940}
        style={{
          objectFit: 'cover',
          height: 'lg:50vh',
        }}
      />
      </div>
      <div className='flex flex-col items-center justify-between gap-4 h-[30vh] z-[10] mt-[50vh]'>
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
          <Button className='bg-black text-slate-200 border-slate-200/20 border hover:text-black'>
            Admin
          </Button>
        </Link>
      </div>
    </section>
  )
}
