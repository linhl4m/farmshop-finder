'use client'
import Link from 'next/link'
import { Heart, LogOut, ReceiptText, Settings, User, LayoutDashboard } from 'lucide-react'
import { logoutAction } from '@/app/(frontend)/account/actions'
import { usePathname } from 'next/navigation'
import { User as PayloadUser } from '@/payload-types'

type Props = {
  email?: string | null
  user: PayloadUser
}

export function AccountSidebar({ email, user }: Props) {
  const isCustomer = user.role === 'customer'
  const dashboardHref = user.role === 'admin' ? '/account/admin' : '/account'
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/account' ? pathname === href : pathname.startsWith(href)

  return (
    <aside className="left-0 hidden w-64 flex-col border-r bg-muted/40 p-4 md:flex">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User size={22} />
        </div>

        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Welcome back,</p>
          <p className="truncate font-semibold">{email}</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        <Link
          href={dashboardHref}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
            isActive(dashboardHref)
              ? 'bg-primary/10 font-semibold text-primary'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </Link>

        {isCustomer && (
          <>
            <Link
              href="/account/orders"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
                isActive('/account/orders')
                  ? 'bg-primary/10 font-semibold text-primary'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <ReceiptText size={20} />
              My Orders
            </Link>

            <Link
              href="/account/saved"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
                isActive('/account/saved')
                  ? 'bg-primary/10 font-semibold text-primary'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <Heart size={20} />
              Saved Farms
            </Link>
          </>
        )}
      </nav>

      <div className="border-t pt-4">
        <form action={logoutAction}>
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-destructive hover:bg-destructive/10">
            <LogOut size={20} />
            Logout
          </button>
        </form>
      </div>
    </aside>
  )
}
