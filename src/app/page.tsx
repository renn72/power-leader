import { api } from '~/trpc/server'
import Navbar from './_components/navbar'

export const dynamic = 'force-dynamic'

export default async function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-black text-white'>
      <Navbar />
      <div className='container flex h-screen flex-col items-center justify-center gap-12 px-4 py-16 '>
        <h1 className='text-5xl font-extrabold tracking-tight sm:text-[5rem]'>
          Create <span className='text-[hsl(280,100%,70%)]'>T3</span> App
        </h1>
      </div>
      <div className='h-16'></div>
    </main>
  )
}
