import { redirect } from 'next/navigation'
import { Check, PackageCheck, ShoppingBag, X } from 'lucide-react'
import { requireUser } from '@/lib/auth'
import { getFarmByOwnerId } from '@/lib/data/farms'
import { getOrdersByFarm } from '@/lib/data/orders'
import { updateOrderStatusAction } from './actions'

export default async function FarmOrdersPage() {
  const user = await requireUser()

  if (user.role !== 'farm') {
    redirect('/account')
  }

  const farm = await getFarmByOwnerId(user.id)

  if (!farm) {
    redirect('/dashboard')
  }

  const orders = await getOrdersByFarm(farm.id)

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-12">
      <div className="mb-8">
        <h1 className="text-3xl text-primary md:text-5xl">Orders</h1>
        <p className="mt-2 text-muted-foreground">
          Review and manage orders placed for {farm.name}.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border bg-card p-10 text-center shadow-sm">
          <ShoppingBag className="mx-auto mb-4 text-muted-foreground" size={42} />
          <h2 className="text-2xl font-semibold">No orders yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Customer orders will appear here once they purchase your products.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order: any) => {
            const customer = typeof order.customer === 'object' ? order.customer.email : 'Customer'

            return (
              <article key={order.id} className="rounded-2xl border bg-card p-4 shadow-sm md:p-6">
                <div className="flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Order #{String(order.id).slice(-6)}
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-primary">{customer}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold capitalize text-muted-foreground">
                      {order.status}
                    </span>

                    <p className="text-lg font-bold text-primary">€{order.total.toFixed(2)}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {order.items?.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-4 rounded-xl bg-muted/40 p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {item.productNameSnapshot ?? 'Product'}
                        </p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>

                      <p className="shrink-0 font-semibold">
                        €{Number(item.priceSnapshot * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
                  {order.status === 'pending' && (
                    <>
                      <form action={updateOrderStatusAction}>
                        <input type="hidden" name="orderId" value={order.id} />
                        <input type="hidden" name="status" value="confirmed" />

                        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 font-semibold text-white sm:w-auto">
                          <Check size={18} />
                          Accept
                        </button>
                      </form>

                      <form action={updateOrderStatusAction}>
                        <input type="hidden" name="orderId" value={order.id} />
                        <input type="hidden" name="status" value="cancelled" />

                        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-destructive/10 px-4 py-2 font-semibold text-destructive sm:w-auto">
                          <X size={18} />
                          Decline
                        </button>
                      </form>
                    </>
                  )}
                  {order.status === 'confirmed' && (
                    <>
                      <form action={updateOrderStatusAction}>
                        <input type="hidden" name="orderId" value={order.id} />
                        <input type="hidden" name="status" value="shipped" />

                        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#bcf0ae]/30 px-4 py-2 font-semibold text-primary sm:w-auto">
                          <PackageCheck size={18} />
                          Mark shipped
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
