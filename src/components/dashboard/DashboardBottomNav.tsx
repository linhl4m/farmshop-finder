'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ReceiptText, Pencil, Eye } from 'lucide-react'

type Props = {
  farmSlug?: string
}

export function DashboardBottomNav({ farmSlug }: Props) {
  const pathname = usePathname()

  const linkClass = (href: string) => {
    const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href)
    return `flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium transition ${
      active ? 'text-primary' : 'text-muted-foreground'
    }`
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t bg-white/95 backdrop-blur-sm md:hidden">
      <Link href="/dashboard" className={linkClass('/dashboard')}>
        <LayoutDashboard size={22} />
        <span>Overview</span>
      </Link>

      {farmSlug && (
        <Link href={`/farms/${farmSlug}`} className={linkClass(`/farms/${farmSlug}`)}>
          <Eye size={22} />
          View Farm
        </Link>
      )}

      <Link href="/dashboard/farm" className={linkClass('/dashboard/farm')}>
        <Pencil size={22} />
        <span>Edit Farm</span>
      </Link>

      <Link href="/dashboard/orders" className={linkClass('/dashboard/orders')}>
        <ReceiptText size={22} />
        <span>Orders</span>
      </Link>

      <Link href="/dashboard/products" className={linkClass('/dashboard/products')}>
        <Package size={22} />
        <span>Products</span>
      </Link>
    </nav>
  )
}
