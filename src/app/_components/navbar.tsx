import Link from 'next/link'

import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { ModeToggle } from './mode-toggle'

const Navbar = () => {
  return (
    <nav className='left-0 top-0 z-50 flex w-full items-center justify-between border-b border-gray-800 px-4 py-2'>
      <ul className='flex gap-4'>
        <li>
          <Link href='/'>Home</Link>
        </li>
        <li>
          <SignedIn>
            <Link href='/dashboard'>Dashboard</Link>
          </SignedIn>
        </li>
      </ul>
      <div className='flex items-center gap-4'>
          <SignedIn>
            <Link href='/admin'>Admin</Link>
          </SignedIn>
        <ModeToggle />
        <div className='w-8 flex items-center'>
        <SignedOut>
          <SignInButton mode='modal' />
        </SignedOut>
        <SignedIn>
            <UserButton />
        </SignedIn>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
