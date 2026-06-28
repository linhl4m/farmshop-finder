'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { loginUser, redirectByRole } from '@/lib/auth'

export type RegisterState = {
  error?: string
  email?: string
  farmName?: string
}

export async function registerCustomerAction(
  prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const payload = await getPayload({ config })

  const email = String(formData.get('email'))
  const password = String(formData.get('password'))

  let role: string | undefined

  try {
    await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        role: 'customer',
      },
    })

    const result = await loginUser(email, password)
    role = result.user?.role
  } catch {
    return {
      error: 'Unable to create account. Please check your details and try again.',
      email,
    }
  }

  redirectByRole(role)
  return {}
}

export async function registerFarmAction(
  prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const payload = await getPayload({ config })

  const email = String(formData.get('email'))
  const password = String(formData.get('password'))
  const farmName = String(formData.get('farmName'))

  let userId: string | undefined
  let role: string | undefined

  try {
    const existing = await payload.find({
      collection: 'farms',
      overrideAccess: true,
      where: { name: { equals: farmName } },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      return {
        error: 'A farm with this name already exists. Please choose a different name.',
        email,
        farmName,
      }
    }

    const user = await payload.create({
      collection: 'users',
      data: { email, password, role: 'farm' },
    })
    userId = user.id

    await payload.create({
      collection: 'farms',
      overrideAccess: true,
      draft: false,
      data: { owner: user.id, name: farmName } as any,
    })

    const result = await loginUser(email, password)
    role = result.user?.role
  } catch (err: any) {
    if (userId) {
      await payload.delete({ collection: 'users', id: userId, overrideAccess: true }).catch(() => {})
    }
    const isDuplicateName =
      err?.code === 11000 || JSON.stringify(err).includes('"name"')
    return {
      error: isDuplicateName
        ? 'A farm with this name already exists. Please choose a different name.'
        : 'Unable to create account. Please check your details and try again.',
      email,
      farmName,
    }
  }

  redirectByRole(role)
  return {}
}
