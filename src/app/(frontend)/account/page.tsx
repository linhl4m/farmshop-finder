import { ShoppingBasket } from 'lucide-react'
import { requireUser } from '@/lib/auth'
import { getOrdersByCustomer } from '@/lib/data/orders'
import Link from 'next/link'
import { OrderCard } from '@/components/account/OrderCard'
import { SavedFarmsCard } from '@/components/account/SavedFarmsCard'
import { ReviewPromptCard } from '@/components/account/ReviewPromptCard'
import { SeasonalCard } from '@/components/account/SeasonalCard'

export default async function AccountPage() {
  const user = await requireUser()

  const orders = await getOrdersByCustomer(user.id)

  return (
    <section className="mx-auto max-w-7xl px-6 py-10 md:px-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-primary md:text-5xl">My Dashboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Track your orders, saved farms, and recent activity.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="space-y-6 lg:col-span-8">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-semibold">Active Orders</h2>
            <Link href="#" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 text-center">
              <ShoppingBasket className="mx-auto mb-4 text-muted-foreground" size={40} />
              <h3 className="text-xl font-semibold">No orders yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Start shopping from local farms and your orders will appear here.
              </p>
              <Link
                href="/"
                className="mt-5 inline-flex rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
              >
                Browse products
              </Link>
            </div>
          ) : (
            orders.slice(0, 3).map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </section>

        <aside className="space-y-6 lg:col-span-4">
          <SavedFarmsCard />
          <ReviewPromptCard />
          <SeasonalCard />
        </aside>
      </div>
    </section>
  )
}
