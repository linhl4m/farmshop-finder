import Link from 'next/link'
import { Bell, User, Heart } from 'lucide-react'
import { CartButton } from '@/components/cart/CartButton'
import { getCurrentUser } from '@/lib/auth'
import { HeaderNav } from '@/components/layout/HeaderNav'
import { MobileMenu } from '@/components/layout/MobileMenu'

type Props = {
  cartCount?: number
}

export async function Header({ cartCount = 0 }: Props) {
  const user = await getCurrentUser()

  return (
    <header className="sticky top-0 z-50 border-b border-[#c2c9bb]/20 bg-[#f9faf2]/90 backdrop-blur">
      <div className="flex items-center justify-between px-5 py-4 sm:px-7 lg:px-9">
        <Link href="/" className="font-serif text-3xl font-bold shrink-0">
          Farmshop Finder
        </Link>

        <HeaderNav />

        <div className="flex items-center gap-2">
          {(user?.role === 'customer' || !user) && <CartButton />}

          {/* Desktop only icons */}
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <button className="rounded-full p-2 text-primary transition hover:bg-primary/10">
                <Bell size={22} />
              </button>

              {user.role === 'customer' && (
                <Link
                  href="/account/saved"
                  className="rounded-full p-2 text-primary transition hover:bg-primary/10"
                >
                  <Heart size={22} />
                </Link>
              )}

              <Link
                href="/account"
                className="rounded-full p-2 text-primary transition hover:bg-primary/10"
              >
                <User size={22} />
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden md:block rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              Sign In
            </Link>
          )}

          {/* Mobile hamburger */}
          <MobileMenu isLoggedIn={!!user} isCustomer={user?.role === 'customer'} />
        </div>
      </div>
    </header>
  )
}
