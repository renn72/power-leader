'use client'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function Home() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = searchParams.get('redirect_url')

  if (pathname) {
    console.log(pathname)
    router.push(pathname)
    return null
  }

  return (
    <section className='relative flex h-[80vh] w-full flex-col items-center justify-center gap-8 overflow-hidden'>
      <div className='relative z-10 max-w-3xl px-4 text-center sm:px-6 lg:px-8'>
        <h1 className='text-4xl font-bold sm:text-5xl lg:text-6xl'>
          Power Board
        </h1>
      </div>
      <div className='inset-0 z-0 flex flex-col items-center justify-center gap-2'>
      </div>
    </section>
  )
}
