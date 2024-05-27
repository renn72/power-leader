'use client'
import { useState } from 'react'

import { api } from '~/trpc/react'

import Navbar from './_components/navbar'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

export const dynamic = 'force-dynamic'

export default function Home() {
  const [text, setText] = useState('')
  const context = api.useUtils()
  const { mutate: createPost } = api.post.create.useMutation({
    onSettled: () => {
      setText('')
      context.post.invalidate()
    },
  })

  const { data: post } = api.post.getLatest.useQuery()

  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-black text-white'>
      <Navbar />
      <section className='relative flex h-[80vh] w-full flex-col items-center justify-center gap-8 overflow-hidden'>
        <div className='relative z-10 max-w-3xl px-4 text-center sm:px-6 lg:px-8'>
          <h1 className='text-4xl font-bold text-white sm:text-5xl lg:text-6xl'>
            Power Board
          </h1>
        </div>
        <div className='inset-0 z-0 flex flex-col items-center justify-center gap-2'>
          <h2 className='text-2xl font-bold text-white'>
            {post && post.name ? post.name : '...'}
          </h2>
          <Input
            className='w-full max-w-md text-black'
            placeholder='text'
            type='text'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button onClick={() => createPost({ name: text })}>submit</Button>
        </div>
      </section>
    </main>
  )
}
