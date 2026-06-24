import Link from 'next/link'
import { Bell, ShoppingBasket, User } from 'lucide-react'
import { CartButton } from '@/components/cart/CartButton'

type Props = {
  cartCount?: number
}

export function Header({ cartCount = 0 }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#c2c9bb]/20 bg-[#f9faf2]/90 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4 lg:px-16">
        <Link href="/" className="font-serif text-3xl font-bold">
          Farmshop Finder
        </Link>

        <div className="flex items-center gap-2">
          <button className="rounded-full p-2 text-primary transition hover:bg-primary/10">
            <Bell size={22} />
          </button>

          <CartButton />

          <Link
            href="/account"
            className="rounded-full p-2 text-primary transition hover:bg-primary/10"
          >
            <User size={22} />
          </Link>
        </div>
      </div>
    </header>
  )
}
