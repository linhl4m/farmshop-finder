'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { requireUser } from '@/lib/auth'

export async function updateFarmAction(prevState: any, formData: FormData) {
  const user = await requireUser()

  if (user.role !== 'farm') {
    redirect('/account')
  }

  const farmId = String(formData.get('farmId'))

  const payload = await getPayload({ config })

  const file = formData.get('coverImage') as File | null

  let coverImageId: string | undefined

  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const media = await payload.create({
      collection: 'media',
      data: {},
      file: {
        data: buffer,
        mimetype: file.type,
        name: file.name,
        size: file.size,
      },
    })

    coverImageId = media.id
  }

  try {
    const updateData: Record<string, unknown> = {
      name: String(formData.get('name')),
      description: String(formData.get('description')),
      type: String(formData.get('type')),
      organic: formData.get('organic') === 'on',
      region: String(formData.get('region')),
      location: {
        address: String(formData.get('address')),
        city: String(formData.get('city')),
        latitude: Number(formData.get('latitude')) || undefined,
        longitude: Number(formData.get('longitude')) || undefined,
      },
    }

    if (coverImageId) {
      updateData.coverImage = coverImageId
    }

    const farm = await payload.update({
      collection: 'farms',
      id: farmId,
      data: updateData,
      overrideAccess: false,
      user,
    })

    revalidatePath('/dashboard/farm')
    revalidatePath(`/farms/${farm.slug}`)
    revalidatePath('/')

    return {
      success: true,
      message: 'Farm updated successfully',
    }
  } catch {
    return {
      success: false,
      message: 'Failed to update farm',
    }
  }
}
