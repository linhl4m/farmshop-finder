import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { AccountSidebar } from '@/components/account/AccountSidebar'
import { AccountMobileHeader } from '@/components/account/AccountMobileHeader'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()

  if (user.role === 'farm') {
    redirect('/dashboard')
  }

  return (
    <main className="flex min-h-screen bg-background">
      <AccountSidebar email={user.email} />

      <div className="flex-1">
        <AccountMobileHeader />

        {children}
      </div>
    </main>
  )
}
