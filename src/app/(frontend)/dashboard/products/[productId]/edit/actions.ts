'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { requireUser } from '@/lib/auth'

export async function updateProductAction(prevState: any, formData: FormData) {
  const productId = String(formData.get('productId'))

  try {
    const user = await requireUser()

    if (user.role !== 'farm') {
      return {
        success: false,
        message: 'Not allowed',
      }
    }

    const payload = await getPayload({ config })

    const file = formData.get('photo') as File | null

    const existingPhotoIds: string[] = JSON.parse(
      String(formData.get('existingPhotoIds') || '[]'),
    )

    let photoIds = existingPhotoIds

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer()

      const media = await payload.create({
        collection: 'media',
        data: {},
        file: {
          data: Buffer.from(bytes),
          mimetype: file.type,
          name: file.name,
          size: file.size,
        },
      })

      photoIds = [media.id]
    }

    await payload.update({
      collection: 'products',
      id: productId,
      data: {
        name: String(formData.get('name')),
        description: String(formData.get('description')),
        price: Number(formData.get('price')),
        unit: String(formData.get('unit')) as 'kg' | 'lb' | 'dozen' | 'bunch' | 'piece',
        productCategory: String(formData.get('productCategory')),
        stock: Number(formData.get('stock')),
        status: String(formData.get('status')) as 'in_season' | 'out_of_season' | 'sold_out',
        photos: photoIds,
      },
      overrideAccess: false,
      user,
    })

    revalidatePath('/dashboard/products')
    revalidatePath(`/dashboard/products/${productId}/edit`)
    revalidatePath('/')
  } catch (error) {
    console.error(error)

    return {
      success: false,
      message: 'Failed to update product',
    }
  }

  redirect('/dashboard/products')
}
