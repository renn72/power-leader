import { Dot } from 'lucide-react'

const Red = () => (
  <div className='flex h-48 w-14 items-center justify-center rounded-full bg-red-600 '>
    25
  </div>
)

const Blue = () => (
  <div className='flex h-48 w-14 items-center justify-center rounded-full bg-blue-500 '>
    20
  </div>
)

const Yellow = () => (
  <div className='flex h-40 w-12 items-center justify-center rounded-full bg-yellow-500 '>
    15
  </div>
)

const Green = () => (
  <div className='flex h-32 w-10 items-center justify-center rounded-full bg-green-500 '>
    10
  </div>
)

const White = () => (
  <div className='flex h-24 w-8 items-center justify-center rounded-full bg-white '>
    5
  </div>
)

const Black = () => (
  <div className='flex h-20 w-6 flex-col items-center justify-center rounded-full bg-gray-600 leading-[0.9rem] '>
    <div>2</div>
    <Dot
      size={24}
      className='my-[-0.4rem]'
    />
    <div>5</div>
  </div>
)

const Gray = () => (
  <div className='flex h-16 w-6 flex-col items-center justify-center rounded-full bg-gray-200 leading-[1rem] '>
    <div>1</div>
    <Dot
      size={24}
      className='my-[-0.6rem]'
    />
    <div>2</div>
    <div>5</div>
  </div>
)

const Loading = ({
  name,
  weight,
  rack,
  lift,
  isLifting = false,
}: {
  name: string
  weight: number
  rack: string
  lift: string
  isLifting?: boolean
}) => {
  const bar = lift == 'squat' ? 30 : 25

  let i = weight - bar

  let red = Math.floor(i / 50)
  i = i % 50
  let blue = Math.floor(i / 40)
  i = i % 40
  let yellow = Math.floor(i / 30)
  i = i % 30
  let green = Math.floor(i / 20)
  i = i % 20
  let white = Math.floor(i / 10)
  i = i % 10
  let black = Math.floor(i / 5)
  i = i % 5
  let gray = Math.floor(i / 2.5)

  console.log(red, blue, yellow, green, white, black, gray)

  return (
    <div className='ml-4 flex flex-col items-center justify-center gap-1 text-xl'>
      {isLifting ? (
        <div className='uppercase'>Lifting: {name}</div>
      ) : (
        <div className='uppercase'>Up Next: {name}</div>
      )}
      <div>{weight}kg</div>
      <div className='flex w-full items-center gap-4'>
        <div className='flex items-center justify-center gap-1 text-xl font-black tracking-tighter text-black'>
          <Red />
          <Blue />
          <Yellow />
          <Green />
          <White />
          <Black />
          <Gray />
        </div>
        {rack !== '' && <div>{rack}</div>}
      </div>
    </div>
  )
}

export default Loading

// {Array.from({ length: red }).map((_, i) => (
//   <Red key={i} />
// ))}
// {Array.from({ length: blue }).map((_, i) => (
//   <Blue key={i} />
// ))}
// {Array.from({ length: yellow }).map((_, i) => (
//   <Yellow key={i} />
// ))}
// {Array.from({ length: green }).map((_, i) => (
//   <Green key={i} />
// ))}
// {Array.from({ length: white }).map((_, i) => (
//   <White key={i} />
// ))}
// {Array.from({ length: black }).map((_, i) => (
//   <Black key={i} />
// ))}
// {Array.from({ length: gray }).map((_, i) => (
//   <Gray key={i} />
// ))}
