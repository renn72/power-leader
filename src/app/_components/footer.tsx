'use client'
import { usePathname } from 'next/navigation'

const Footer = () => {
    const pathname = usePathname()
    if (pathname.includes('comp-day/')) {
        return null
    }

    return (
        <footer className=''>
        </footer>
    )
}

export default Footer
