'use server'

import { revalidatePath } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { requireUser } from '@/lib/auth'

export async function updateOrderStatusAction(formData: FormData) {
  const user = await requireUser()

  if (user.role !== 'farm') {
    throw new Error('Unauthorized')
  }

  const orderId = String(formData.get('orderId'))
  const status = String(formData.get('status'))

  const allowedStatuses = ['confirmed', 'shipped', 'cancelled']

  if (!allowedStatuses.includes(status)) {
    throw new Error('Invalid status')
  }

  const payload = await getPayload({ config })

  await payload.update({
    collection: 'orders',
    id: orderId,
    data: {
      status,
    },
    user,
    overrideAccess: false,
  })

  revalidatePath('/dashboard/orders')
  revalidatePath('/dashboard')
}
