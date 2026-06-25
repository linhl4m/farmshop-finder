'use server'

import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { requireUser } from '@/lib/auth'

export async function createProductAction(prevState: any, formData: FormData) {
  try {
    const user = await requireUser()

    if (user.role !== 'farm') {
      redirect('/account')
    }

    const payload = await getPayload({ config })

    const file = formData.get('photo') as File | null

    let photoId: string | undefined

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

      photoId = media.id
    }

    await payload.create({
      collection: 'products',
      data: {
        name: String(formData.get('name')),
        description: String(formData.get('description')),
        price: Number(formData.get('price')),
        unit: String(formData.get('unit')),
        productCategory: String(formData.get('productCategory')),
        stock: Number(formData.get('stock')),
        status: String(formData.get('status')),
        photos: photoId ? [photoId] : [],
      },
      overrideAccess: false,
      user,
    })
  } catch (error) {
    console.error(error)

    return {
      success: false,
      message: 'Failed to create product',
    }
  }

  redirect('/dashboard/products')
}
