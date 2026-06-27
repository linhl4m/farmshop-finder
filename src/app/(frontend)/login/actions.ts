'use server'

import { redirectByRole, loginUser } from '@/lib/auth'

type LoginState = {
  error?: string
  email?: string
}

export async function loginAction(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))

  let role: string | undefined

  try {
    const result = await loginUser(email, password)
    role = result.user?.role
  } catch {
    return {
      error: 'Email or password is incorrect.',
      email,
    }
  }
  redirectByRole(role)
  return {}
}
