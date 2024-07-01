'use client'
import Link from 'next/link'
import { api } from '~/trpc/react'
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
                <h2 className='text-2xl font-bold'>
                    <Link
                        href='
                        join/6c65c43c-eb6a-44fe-8d61-7fb017d2e5f6
                        '
                    >
                        comp
                    </Link>
                </h2>
            </div>
        </section>
    )
}
