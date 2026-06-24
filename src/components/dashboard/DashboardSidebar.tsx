import Link from 'next/link'
import { LayoutDashboard, Package, ReceiptText, User } from 'lucide-react'

type Props = {
  farmName?: string | null
}

export function DashboardSidebar({ farmName }: Props) {
  return (
    <aside className="left-0 hidden w-64 flex-col border-r bg-muted/40 p-4 md:flex">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User size={22} />
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Welcome back,</p>
          <p className="font-semibold">{farmName || 'Your Farm'}</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-xl bg-primary/10 px-4 py-3 font-semibold text-primary"
        >
          <LayoutDashboard size={20} />
          Seller Dashboard
        </Link>
        <Link
          href="/dashboard/orders"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-muted-foreground hover:bg-muted"
        >
          <ReceiptText size={20} />
          Orders
        </Link>

        <Link
          href="/dashboard/products"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-muted-foreground hover:bg-muted"
        >
          <Package size={20} />
          Products
        </Link>
      </nav>
    </aside>
  )
}
