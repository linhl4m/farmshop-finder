'use server'

import { revalidatePath } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { requireUser } from '@/lib/auth'

export async function toggleFavoriteFarmAction(prevState: any, formData: FormData) {
  const user = await requireUser()

  if (user.role !== 'customer') {
    return { success: false, message: 'Only customers can save farms.' }
  }

  const farmId = String(formData.get('farmId'))
  const farmSlug = String(formData.get('farmSlug'))

  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'favorites',
    where: {
      and: [{ customer: { equals: user.id } }, { farm: { equals: farmId } }],
    },
    limit: 1,
    overrideAccess: false,
    user,
  })

  if (existing.docs[0]) {
    await payload.delete({
      collection: 'favorites',
      id: existing.docs[0].id,
      overrideAccess: false,
      user,
    })

    revalidatePath(`/farms/${farmSlug}`)
    revalidatePath('/account/saved')

    return { success: true, favorited: false }
  }

  await payload.create({
    collection: 'favorites',
    data: {
      customer: user.id,
      farm: farmId,
    },
    overrideAccess: false,
    user,
  })

  revalidatePath(`/farms/${farmSlug}`)
  revalidatePath('/account/saved')

  return { success: true, favorited: true }
}
