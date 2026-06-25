'use client'

import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { createProductAction } from '@/app/(frontend)/dashboard/products/new/actions'

type Props = {
  children: React.ReactNode
}

export function AddProductSubmit({ children }: Props) {
  const [state, formAction] = useActionState(createProductAction, null)

  useEffect(() => {
    if (!state) return
    toast.error(state.message)
  }, [state])

  return (
    <form action={formAction} className="space-y-6 p-6">
      {children}

      <button className="rounded-xl bg-primary px-6 py-3 font-bold text-white">
        Create Product
      </button>
    </form>
  )
}
