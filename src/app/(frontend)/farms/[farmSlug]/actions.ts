'use server'

import { revalidatePath } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { requireUser } from '@/lib/auth'

export async function createReviewAction(prevState: any, formData: FormData) {
  try {
    const user = await requireUser()

    const payload = await getPayload({ config })

    const productId = formData.get('productId')

    await payload.create({
      collection: 'reviews',
      data: {
        customer: user.id,
        farm: String(formData.get('farmId')),
        product: productId ? String(productId) : undefined,
        rating: Number(formData.get('rating')),
        title: String(formData.get('title')),
        comment: String(formData.get('comment')),
      },
      overrideAccess: false,
      user,
    })

    revalidatePath(`/farms/${formData.get('farmSlug')}`)

    return {
      success: true,
      message: 'Review submitted successfully',
    }
  } catch (error) {
    console.error(error)

    return {
      success: false,
      message: 'Failed to submit review',
    }
  }
}
