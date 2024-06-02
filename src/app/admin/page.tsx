'use client'
import { api } from '~/trpc/react'

import { Button } from '~/components/ui/button'

export const dynamic = 'force-dynamic'

export default function Admin() {

  const { mutate: createUsers } = api.user.createUserAdmin.useMutation()

  return (
    <section className='mt-8 flex h-full grow flex-col'>
      <div>
        <Button
          onClick={() => {
            createUsers()
          }}
        >Create Users</Button>
      </div>
    </section>
  )
}
