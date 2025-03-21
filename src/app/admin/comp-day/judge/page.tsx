'use client'

import { useState } from 'react'

import Link from 'next/link'

import { Button } from '~/components/ui/button'

const CompDay = () => {
  const [compId, setCompId] = useState('Show-Down-22-3-2025')

  return (
    <div className='flex flex-col gap-8 p-4 items-center justify-center mt-10'>
      <Link href={`comp-day/${compId}/judge-1`}>
        <Button
          size='lg'
          variant='secondary'
        >
          Judge 1
        </Button>
      </Link>
      <Link href={`comp-day/${compId}/judge-2`}>
        <Button
          size='lg'
          variant='secondary'
        >
          Judge 2
        </Button>
      </Link>
      <Link href={`comp-day/${compId}/judge-3`}>
        <Button
          size='lg'
          variant='secondary'
        >
          Judge 3
        </Button>
      </Link>
    </div>
  )
}

export default CompDay
