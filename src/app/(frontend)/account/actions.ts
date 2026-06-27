'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('payload-token')
  cookieStore.delete('farmshop-cart')
  revalidatePath('/', 'layout')
  redirect('/login')
}
