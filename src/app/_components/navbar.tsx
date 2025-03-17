'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { Button } from '~/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '~/components/ui/navigation-menu'
import { api } from '~/trpc/react'
import { toast } from 'sonner'

import { ModeToggle } from './mode-toggle'

function sleep(ms : number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const Navbar = () => {
  const pathname = usePathname()
  const ctx = api.useUtils()
  const { mutate: sync } = api.user.sync.useMutation({
    onSuccess: () => {
      ctx.invalidate()
    },
  })
  const { data: competition } = api.competition.get.useQuery(1)

  const { mutate: email } = api.competition.email.useMutation({
    onSuccess: () => {
      toast.success('Email sent!')
    },
  })

  const onSendEmail = async () => {
    if (!competition) return
    for (const entry of competition.entries.filter((e) => e.user?.email !== 'anthonyx@harpersbathroom.com.au' && e.user?.email !== 'akcornish2@gmail.com')) {
      if (!entry.user?.email) continue
      if (!entry.user?.clerkId) continue
      if (!entry.user?.name) continue
      email({
        email: entry.user?.email,
        link: entry.user?.clerkId,
        name: entry.user?.name,
      })
      await sleep(1100)
    }

  }

  const { data: isAdmin } = api.user.isAdmin.useQuery()

  if (pathname.includes('comp-day/screen/')) return null
  if (pathname.includes('judge')) return null
  if (pathname.includes('loading')) return null
  if (pathname.includes('board')) return null

  return (
    <div className='left-0 top-0 z-50 flex w-full items-center justify-between border-b border-gray-800 px-4 py-1'>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem className='hidden'>
            <Link
              href='/admin'
              legacyBehavior
              passHref
            >
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className='hidden'>
            <Link
              href='/admin/create'
              legacyBehavior
              passHref
            >
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Create
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          {isAdmin ? (
            <NavigationMenuItem>
              <Link
                href='/admin/comp-admin/Show-Down-22-3-2025'
                legacyBehavior
                passHref
              >
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Comp Admin
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ) : null}

          <NavigationMenuItem>
            <Link
              href='/admin/weigh-in'
              legacyBehavior
              passHref
            >
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Weigh In
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          {isAdmin ? (
            <NavigationMenuItem>
              <Link
                href='/admin/bracket'
                legacyBehavior
                passHref
              >
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Flights
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ) : null}

          {isAdmin ? (
            <NavigationMenuItem>
              <Link
                href='/admin/comp-day'
                legacyBehavior
                passHref
              >
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Comp Day
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ) : null}

        </NavigationMenuList>
      </NavigationMenu>
      <div className='flex items-center gap-4'>
        {isAdmin ? (
          <Button
            onClick={() => sync()}
            size='sm'
            className=''
            variant='ghost'
          >
            Sync
          </Button>
        ) : null}
        <ModeToggle />
        <div className='flex w-8 items-center'>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </div>
  )
}

export default Navbar
