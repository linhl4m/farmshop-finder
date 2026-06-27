import Link from 'next/link'
import { Bell, User } from 'lucide-react'
import { CartButton } from '@/components/cart/CartButton'
import { getCurrentUser } from '@/lib/auth'

type Props = {
  cartCount?: number
}

export async function Header({ cartCount = 0 }: Props) {
  const user = await getCurrentUser()

  return (
    <header className="sticky top-0 z-50 border-b border-[#c2c9bb]/20 bg-[#f9faf2]/90 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4 lg:px-16">
        <Link href="/" className="font-serif text-3xl font-bold">
          Farmshop Finder
        </Link>

        <div className="flex items-center gap-2">
          {user?.role !== 'farm' && <CartButton />}

          {user ? (
            <>
              <button className="rounded-full p-2 text-primary transition hover:bg-primary/10">
                <Bell size={22} />
              </button>

              <Link
                href="/account"
                className="rounded-full p-2 text-primary transition hover:bg-primary/10"
              >
                <User size={22} />
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
