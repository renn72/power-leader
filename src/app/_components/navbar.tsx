'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
    navigationMenuTriggerStyle,
} from '~/components/ui/navigation-menu'

import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { ModeToggle } from './mode-toggle'

const Navbar = () => {
    const pathname = usePathname()
    if (pathname.includes('comp-day/screen/')) {
        return null
    }

    return (
        <div className='left-0 top-0 z-50 flex w-full items-center justify-between border-b border-gray-800 px-4 py-2'>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <Link
                            href='/'
                            legacyBehavior
                            passHref
                        >
                            <NavigationMenuLink
                                className={navigationMenuTriggerStyle()}
                            >
                                Home
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link
                            href='/my-comps'
                            legacyBehavior
                            passHref
                        >
                            <NavigationMenuLink
                                className={navigationMenuTriggerStyle()}
                            >
                                My Comps
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link
                            href='/comp-open'
                            legacyBehavior
                            passHref
                        >
                            <NavigationMenuLink
                                className={navigationMenuTriggerStyle()}
                            >
                                Open Comps
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link
                            href='/create'
                            legacyBehavior
                            passHref
                        >
                            <NavigationMenuLink
                                className={navigationMenuTriggerStyle()}
                            >
                                Create
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link
                            href='/comp-admin'
                            legacyBehavior
                            passHref
                        >
                            <NavigationMenuLink
                                className={navigationMenuTriggerStyle()}
                            >
                                Comp Admin
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link
                            href='/weigh-in'
                            legacyBehavior
                            passHref
                        >
                            <NavigationMenuLink
                                className={navigationMenuTriggerStyle()}
                            >
                                Weigh In
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link
                            href='/bracket'
                            legacyBehavior
                            passHref
                        >
                            <NavigationMenuLink
                                className={navigationMenuTriggerStyle()}
                            >
                                Bracket's
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link
                            href='/comp-day'
                            legacyBehavior
                            passHref
                        >
                            <NavigationMenuLink
                                className={navigationMenuTriggerStyle()}
                            >
                                Comp Day
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link
                            href='/admin'
                            legacyBehavior
                            passHref
                        >
                            <NavigationMenuLink
                                className={navigationMenuTriggerStyle()}
                            >
                                Admin
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <div className='flex items-center gap-4'>
                <ModeToggle />
                <div className='flex w-8 items-center'>
                    <SignedOut>
                        <SignInButton mode='modal' />
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </div>
        </div>
    )
}

export default Navbar
