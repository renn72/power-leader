'use client'
import { usePathname } from 'next/navigation'

const Footer = () => {
    const pathname = usePathname()
    if (pathname.includes('comp-day/')) {
        return null
    }

    return (
        <footer className='h-16 border-t border-input'>
        </footer>
    )
}

export default Footer
