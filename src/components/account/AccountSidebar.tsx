import Link from 'next/link'
import { Heart, LogOut, ReceiptText, Settings, User } from 'lucide-react'
import { logoutAction } from '@/lib/auth'

type Props = {
  email?: string | null
}

export function AccountSidebar({ email }: Props) {
  return (
    <aside className="left-0 hidden w-64 flex-col border-r bg-muted/40 p-4 md:flex">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User size={22} />
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Welcome back,</p>
          <p className="font-semibold">{email}</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        <Link
          href="/account"
          className="flex items-center gap-3 rounded-xl bg-primary/10 px-4 py-3 font-semibold text-primary"
        >
          <ReceiptText size={20} />
          My Orders
        </Link>

        <Link
          href="/account/saved"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-muted-foreground hover:bg-muted"
        >
          <Heart size={20} />
          Saved Farms
        </Link>
      </nav>

      <div className="border-t pt-4">
        <Link
          href="#"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-muted-foreground hover:bg-muted"
        >
          <Settings size={20} />
          Settings
        </Link>

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
