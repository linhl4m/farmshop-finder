'use client'

import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { updateProductAction } from '@/app/(frontend)/dashboard/products/[productId]/edit/actions'

type Props = {
  children: React.ReactNode
}

export function EditProductSubmit({ children }: Props) {
  const [state, formAction] = useActionState(updateProductAction, null)

  useEffect(() => {
    if (!state) return

    if (state.success) {
      toast.success(state.message)
    } else {
      toast.error(state.message)
    }
  }, [state])

  return (
    <form action={formAction} className="space-y-6 p-6">
      {children}

      <button className="rounded-xl bg-primary px-6 py-3 font-bold text-white">Save Changes</button>
    </form>
  )
}
