import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { getFarmByOwnerId } from '@/lib/data/farms'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { DashboardMobileHeader } from '@/components/dashboard/DashboardMobileHeader'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()

  if (user.role !== 'farm') {
    redirect('/account')
  }

  const farm = await getFarmByOwnerId(user.id)

  if (!farm) {
    redirect('/')
  }

  return (
    <main className="flex min-h-screen bg-background">
      <DashboardSidebar farmName={farm.name} farmSlug={farm.slug} />

      <div className="flex-1">
        <DashboardMobileHeader farmName={farm.name} />

        {children}
      </div>
    </main>
  )
}
