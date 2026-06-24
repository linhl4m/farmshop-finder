import Link from 'next/link'
import { LoginForm } from './LoginForm'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export default async function LoginPage() {
  const user = await getCurrentUser()

  if (user) {
    redirect(user.role === 'farm' ? '/dashboard' : '/account')
  }
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Sign in</h1>

          <p className="text-lg text-muted-foreground">
            Welcome back. Sign in to manage your account, orders, or farm profile.
          </p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  )
}
