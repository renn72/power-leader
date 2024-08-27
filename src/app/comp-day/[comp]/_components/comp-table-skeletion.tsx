'use client'

import { Skeleton } from '~/components/ui/skeleton'
const CompTableSkeletion = () => {
  return (
    <div className='flex flex-col items-center justify-center gap-2'>
      <Skeleton className='h-[100px] w-[800px] rounded-full' />
      <Skeleton className='h-[100px] w-[800px] rounded-full' />
      <Skeleton className='h-[800px] w-[800px] rounded-xl' />
    </div>
  )
}

export default CompTableSkeletion
