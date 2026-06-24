import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { getFarmByOwnerId } from '@/lib/data/farms'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { DashboardMobileHeader } from '@/components/dashboard/DashboardMobileHeader'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { RecentOrders } from '@/components/dashboard/RecentOrders'
import { FarmListings } from '@/components/dashboard/FarmListings'
import { getRecentOrders } from '@/lib/data/orders'

export default async function DashboardPage() {
  const user = await requireUser()

  if (user.role !== 'farm') {
    redirect('/account')
  }

  const farm = await getFarmByOwnerId(user.id)

  const recentOrders = await getRecentOrders(farm.id)

  return (
    <main className="flex min-h-screen bg-background">
      <DashboardSidebar farmName={farm?.name} />

      <div className="flex-1">
        <DashboardMobileHeader farmName={farm?.name} />

        <section className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-8 md:px-12">
          <DashboardStats />

          <RecentOrders orders={recentOrders} />

          <FarmListings />
        </section>
      </div>
    </main>
  )
}
