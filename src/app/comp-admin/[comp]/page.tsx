'use client'

export const dynamic = 'force-dynamic'

const Competition = ({ params }: { params: { comp: string } }) => {
  const { comp } = params
  return (
    <>
      <div className='flex h-full min-h-[100vh] w-full flex-col'>
        <div className='flex flex-col items-center gap-12 text-6xl font-bold'>
          <div>{comp}</div>
        </div>
      </div>
    </>
  )
}

export default Competition
