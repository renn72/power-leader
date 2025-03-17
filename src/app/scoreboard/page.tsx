'use client'
import Image from 'next/image'
const Board = () => {
  return (
    <div className='h-[100svh] bg-black w-full flex flex-col items-center justify-center'>
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

export default Board
