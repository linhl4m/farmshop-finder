import Link from 'next/link'
import { Truck } from 'lucide-react'

type OrderCardProps = {
  order: any
}

export function OrderCard({ order }: OrderCardProps) {
  const farm = typeof order.farm === 'object' ? order.farm : null
  const firstItem = order.items?.[0]
  const itemCount = order.items?.length ?? 0

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Truck size={34} />
          </div>

          <div>
            <h3 className="text-xl font-semibold">
              {firstItem?.productNameSnapshot || 'Farm order'}
              {itemCount > 1 && ` + ${itemCount - 1} more`}
            </h3>

            <p className="text-sm text-muted-foreground">
              Order #{order.id.slice(-6).toUpperCase()} · {farm?.name || 'Farm'}
            </p>
          </div>
        </div>

        <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase text-primary">
          {order.status}
        </span>
      </div>

      <div className="mt-6 flex items-center justify-between border-t pt-6">
        <div>
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="font-semibold text-primary">€{Number(order.total).toFixed(2)}</p>
        </div>

        <Link
          href="#"
          className="rounded-lg border px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5"
        >
          Order details
        </Link>
      </div>
    </div>
  )
}
