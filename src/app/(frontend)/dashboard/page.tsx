import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { getFarmByOwnerId } from '@/lib/data/farms'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { RecentOrders } from '@/components/dashboard/RecentOrders'
import { ProductListings } from '@/components/dashboard/ProductListings'
import { getRecentOrders } from '@/lib/data/orders'
import { getProductsByFarmId } from '@/lib/data/dashboardProducts'
import { DashboardMobileHeader } from '@/components/dashboard/DashboardMobileHeader'

export default async function DashboardPage() {
  const user = await requireUser()

  if (user.role !== 'farm') {
    redirect('/account')
  }

  const farm = await getFarmByOwnerId(user.id)

  const recentOrders = await getRecentOrders(farm.id)

  const products = await getProductsByFarmId(farm.id)

  return (
    <main className="flex min-h-screen bg-background">
      <div className="flex-1">
        <section className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-8 md:px-12">
          <DashboardMobileHeader farmName={farm.name} farmSlug={farm.slug} />
          <DashboardStats />

          <RecentOrders orders={recentOrders} />

          <ProductListings products={products} />
        </section>
      </div>
    </main>
  )
}
