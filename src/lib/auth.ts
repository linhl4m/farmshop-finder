import 'server-only'
import { cache } from 'react'
import config from '@payload-config'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'
import { cookies } from 'next/headers'

export async function loginUser(email: string, password: string) {
  const payload = await getPayload({ config })

  const result = await payload.login({
    collection: 'users',
    data: {
      email,
      password,
    },
  })

  const cookieStore = await cookies()

  cookieStore.set('payload-token', result.token ?? '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  return result
}

export const getCurrentUser = cache(async function getCurrentUser() {
  const payload = await getPayload({ config })
  const headers = await getHeaders()

  const { user } = await payload.auth({ headers })

  return user
})

export async function requireUser() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return user
}

export function redirectByRole(role?: string) {
  if (role === 'farm') {
    redirect('/dashboard')
  }

  if (role === 'admin') {
    redirect('/account/admin')
  }

  redirect('/')
}
