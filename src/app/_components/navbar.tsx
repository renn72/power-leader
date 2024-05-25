import Link from 'next/link'

import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

const Navbar = () => {
  return (
    <nav className='fixed left-0 top-0 z-50 flex w-full items-center justify-between border-b border-gray-800 bg-black px-4 py-2 text-white shadow-md'>
      <ul className='flex gap-4'>
        <li>
          <Link href='/'>Home</Link>
        </li>
      </ul>
      <div className='flex items-center'>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  )
}

export default Navbar
