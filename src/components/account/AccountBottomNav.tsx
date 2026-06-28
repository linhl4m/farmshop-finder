'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, LogOut, ReceiptText, Settings, LayoutDashboard } from 'lucide-react'
import { logoutAction } from '@/app/(frontend)/account/actions'
import { User } from '@/payload-types'

type Props = {
  user: User
}

export function AccountBottomNav({ user }: Props) {
  const isCustomer = user.role === 'customer'
  const dashboardHref = user.role === 'admin' ? '/account/admin' : '/account'
  const pathname = usePathname()

  const linkClass = (href: string) => {
    const active = pathname === href
    return `flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium transition ${
      active ? 'text-primary' : 'text-muted-foreground'
    }`
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t bg-white/95 backdrop-blur-sm md:hidden">
      <Link href={dashboardHref} className={linkClass(dashboardHref)}>
        <LayoutDashboard size={22} />
        <span>Dashboard</span>
      </Link>

      {isCustomer && (
        <>
          <Link href="/account/orders" className={linkClass('/account/orders')}>
            <ReceiptText size={22} />
            <span>Orders</span>
          </Link>

          <Link href="/account/saved" className={linkClass('/account/saved')}>
            <Heart size={22} />
            <span>Saved</span>
          </Link>
        </>
      )}

      <form action={logoutAction} className="flex flex-1">
        <button className="flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium text-destructive transition hover:opacity-70">
          <LogOut size={22} />
          <span>Logout</span>
        </button>
      </form>
    </nav>
  )
}
