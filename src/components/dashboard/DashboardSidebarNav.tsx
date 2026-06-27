'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ReceiptText, Store, LogOut } from 'lucide-react'
import { logoutAction } from '@/app/(frontend)/account/actions'

export function DashboardSidebarNav() {
  const pathname = usePathname()

  function getLinkClasses(href: string) {
    const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href)

    return active
      ? 'flex items-center gap-3 rounded-xl bg-primary/10 px-4 py-3 font-semibold text-primary'
      : 'flex items-center gap-3 rounded-xl px-4 py-3 text-muted-foreground hover:bg-muted'
  }

  return (
    <nav className="flex flex-col gap-2">
      <Link href="/dashboard" className={getLinkClasses('/dashboard')}>
        <LayoutDashboard size={20} />
        Seller Dashboard
      </Link>

      <Link href="/dashboard/farm" className={getLinkClasses('/dashboard/farm')}>
        <Store size={20} />
        Edit Farm Page
      </Link>

      <Link href="/dashboard/orders" className={getLinkClasses('/dashboard/orders')}>
        <ReceiptText size={20} />
        Orders
      </Link>

      <Link href="/dashboard/products" className={getLinkClasses('/dashboard/products')}>
        <Package size={20} />
        Products
      </Link>

      <form action={logoutAction}>
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-destructive hover:bg-destructive/10">
          <LogOut size={20} />
          Logout
        </button>
      </form>
    </nav>
  )
}
