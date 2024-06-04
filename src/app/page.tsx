'use client'
import { api } from '~/trpc/react'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <section className='relative flex h-[80vh] w-full flex-col items-center justify-center gap-8 overflow-hidden'>
      <div className='relative z-10 max-w-3xl px-4 text-center sm:px-6 lg:px-8'>
        <h1 className='text-4xl font-bold sm:text-5xl lg:text-6xl'>
          Power Board
        </h1>
      </div>
      <div className='inset-0 z-0 flex flex-col items-center justify-center gap-2'>
        <h2 className='text-2xl font-bold'></h2>
      </div>
    </section>
  )
}
