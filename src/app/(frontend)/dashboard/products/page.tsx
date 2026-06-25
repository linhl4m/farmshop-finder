import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { getFarmByOwnerId } from '@/lib/data/farms'
import { getProductsByFarmId } from '@/lib/data/dashboardProducts'
import { DashboardProductsList } from '@/components/dashboard/DashboardProductsList'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function DashboardProductsPage() {
  const user = await requireUser()

  if (user.role !== 'farm') {
    redirect('/account')
  }

  const farm = await getFarmByOwnerId(user.id)

  if (!farm) {
    redirect('/dashboard')
  }

  const products = await getProductsByFarmId(farm.id)

  return (
    <main className="flex min-h-screen bg-background">
      <div className="flex-1">
        <section className="mx-auto max-w-7xl px-6 py-8 md:px-12">
          <div className="flex justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-primary">Products</h1>
              <p className="mt-2 text-muted-foreground">
                Manage your farm products and availability.
              </p>
            </div>
            <div>
              <Link
                href="/dashboard/products/new"
                className="inline-flex px-4 py-2 items-center gap-2 rounded-xl bg-primary font-semibold text-white"
              >
                <Plus size={18} />
                Add Product
              </Link>
            </div>
          </div>

          <DashboardProductsList products={products} />
        </section>
      </div>
    </main>
  )
}
