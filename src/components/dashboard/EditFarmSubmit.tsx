'use client'

import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { updateFarmAction } from '@/app/(frontend)/dashboard/farm/actions'

type Props = {
  children: React.ReactNode
}

export function EditFarmSubmit({ children }: Props) {
  const [state, formAction] = useActionState(updateFarmAction, null)

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
