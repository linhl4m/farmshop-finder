import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { RegisterForm } from './RegisterForm'

type Props = {
  searchParams: Promise<{
    type?: string
  }>
}

export default async function RegisterPage({ searchParams }: Props) {
  const user = await getCurrentUser()

  if (user) {
    redirect(user.role === 'farm' ? '/dashboard' : '/account')
  }

  const params = await searchParams
  const isFarm = params.type === 'farm'

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <RegisterForm isFarm={isFarm} />
    </main>
  )
}
