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
}

export async function registerFarmAction(
  prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const payload = await getPayload({ config })

  const email = String(formData.get('email'))
  const password = String(formData.get('password'))
  const farmName = String(formData.get('farmName'))

  let role: string | undefined

  try {
    const user = await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        role: 'farm',
      },
    })

    await payload.create({
      collection: 'farms',
      data: {
        owner: user.id,
        name: farmName,
      },
    })

    const result = await loginUser(email, password)
    role = result.user?.role
  } catch {
    return {
      error: 'Unable to create account. Please check your details and try again.',
      email,
      farmName,
    }
  }

  redirectByRole(role)
}
