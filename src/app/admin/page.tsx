'use client'
import { api } from '~/trpc/react'

import { Button } from '~/components/ui/button'
import { toast } from 'sonner'

import { generateFullName, generateName, generateInitals } from '~/lib/utils'
import { wcFData, wcMData } from '~/lib/store'

export const dynamic = 'force-dynamic'

export default function Admin() {
    const ctx = api.useUtils()
    const { data: user, isLoading } = api.user.getCurrentUser.useQuery()

    if (isLoading) return null

    return (
        <section className='mt-8 flex h-full grow flex-col gap-8'>
        </section>
    )
}
