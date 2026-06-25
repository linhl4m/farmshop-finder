'use server'

import { revalidatePath } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { requireUser } from '@/lib/auth'

export async function deleteProductAction(formData: FormData) {
  const user = await requireUser()

  const productId = String(formData.get('productId'))

  const payload = await getPayload({ config })

  await payload.delete({
    collection: 'products',
    id: productId,
    overrideAccess: false,
    user,
  })

  revalidatePath('/dashboard/products')
}
