'use client'
import Image from 'next/image'
const Page = () => {
  return (
    <div className='flex h-screen w-full flex-col items-center justify-center'>
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
  )
}

export default Page
