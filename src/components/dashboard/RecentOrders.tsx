import { Package } from 'lucide-react'
import Link from 'next/link'

type Props = {
  orders: any[]
}

export function RecentOrders({ orders }: Props) {
  function getStatusColor(status: string) {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-700'

      case 'processing':
        return 'bg-blue-100 text-blue-700'

      case 'completed':
        return 'bg-green-100 text-green-700'

      case 'cancelled':
        return 'bg-red-100 text-red-700'

      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold text-primary">Recent Orders</h2>

          <p className="text-sm text-muted-foreground">Latest purchases from your customers</p>
        </div>

        <Link
          href="#"
          className="shrink-0 whitespace-nowrap text-sm font-semibold text-primary hover:underline"
        >
          View All
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Package size={40} className="mb-3 text-muted-foreground" />

          <p className="font-medium">No orders yet</p>

          <p className="text-sm text-muted-foreground">
            Orders will appear here once customers purchase products.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const customer = typeof order.customer === 'object' ? order.customer.email : 'Customer'

            return (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-xl border p-4 transition hover:bg-muted/30"
              >
                <div>
                  <p className="font-semibold">Order #{String(order.id).slice(-6)}</p>

                  <p className="text-sm text-muted-foreground">{customer}</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="mb-2 font-semibold text-primary">€{order.total.toFixed(2)}</p>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                      order.status,
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
