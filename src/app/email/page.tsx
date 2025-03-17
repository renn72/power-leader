'use client'

import Image from 'next/image'
import { ShowdownEmail } from '~/components/email-templates/update-email'

export default function Home() {
  return (
    <section className='flex w-full flex-col items-center justify-center gap-8'>

        <ShowdownEmail username="John"  />
    </section>
  )
}


