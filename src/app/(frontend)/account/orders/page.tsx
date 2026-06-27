import { ShoppingBasket } from 'lucide-react'
import Link from 'next/link'
import { requireUser } from '@/lib/auth'
import { getOrdersByCustomer } from '@/lib/data/orders'
import { OrderCard } from '@/components/account/OrderCard'

export default async function OrderHistoryPage() {
  const user = await requireUser()

  const orders = await getOrdersByCustomer(user.id)

  return (
    <section className="mx-auto max-w-7xl px-6 py-10 md:px-12">
      <div className="mb-10">
        <h1 className="text-primary md:text-4xl lg:text-5xl">Order History</h1>
        <p className="mt-2 text-base text-muted-foreground md:text-lg">
          View all your past and current orders from local farms.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="p-10 text-center">
          <ShoppingBasket className="mx-auto mb-4 text-muted-foreground" size={42} />

          <h2 className="text-2xl font-semibold">No orders yet</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Start shopping from local farms and your orders will appear here.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="max-w-3xl space-y-5">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </section>
  )
}
