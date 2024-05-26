'use client'
import { useState } from 'react'

import { api } from '~/trpc/server'

import Navbar from './_components/navbar'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

export const dynamic = 'force-dynamic'

export default function Home() {
  const [text, setText] = useState('')
  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-black text-white'>
      <Navbar />
      <section className='relative flex flex-col gap-8 h-[80vh] w-full items-center justify-center overflow-hidden'>
        <div className='relative z-10 max-w-3xl px-4 text-center sm:px-6 lg:px-8'>
          <h1 className='text-4xl font-bold text-white sm:text-5xl lg:text-6xl'>
            Power Board
          </h1>
        </div>
        <div className='inset-0 z-0 flex flex-col gap-2 items-center justify-center'>
          <Input
            className='w-full max-w-md text-black'
            placeholder='text'
            type='text'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button
            onClick={() => console.log('clicked', text)}
          >submit</Button>
        </div>
      </section>
    </main>
  )
}
