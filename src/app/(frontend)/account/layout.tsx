import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { AccountSidebar } from '@/components/account/AccountSidebar'
import { AccountBottomNav } from '@/components/account/AccountBottomNav'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()

  if (user.role === 'farm') {
    redirect('/dashboard')
  }

  return (
    <main className="flex bg-background">
      <AccountSidebar email={user.email} />

      <div className="flex-1 pb-10 md:pb-0">{children}</div>

      <AccountBottomNav />
    </main>
  )
}
