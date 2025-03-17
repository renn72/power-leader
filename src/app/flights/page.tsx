'use client'

import Image from 'next/image'

import { api } from '~/trpc/react'

import CompBracket from '../admin/bracket/_components/comp-bracket'

const Page = () => {
  const { data: competition, isLoading: competitionsLoading } =
    api.competition.get.useQuery(1)

  const isAdmin = false

  if (competitionsLoading) return null
  if (!competition) return null

  return (
    <>
      {isAdmin ? (
        <div className='p-2'>
        <CompBracket
          competition={competition}
          isAdmin={false}
        />
        </div>
      ) : (
        <div className='flex h-[100svh] w-full flex-col items-center justify-center bg-black'>
          <Image
            src='/showdown.jpeg'
            alt='board'
            width={1440}
            height={1440}
            style={{
              objectFit: 'cover',
            }}
          />
        </div>
      )}
    </>
  )
}

export default Page
