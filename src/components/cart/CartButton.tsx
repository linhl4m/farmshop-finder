'use client'

import Link from 'next/link'
import { ShoppingBasket } from 'lucide-react'
import { useCart } from './CartProvider'

export function CartButton() {
  const { count } = useCart()

  return (
    <Link href="/cart" className="relative inline-flex items-center justify-center rounded-full p-2 text-primary transition hover:bg-primary/10">
      <ShoppingBasket size={22} />

      {count > 0 && (
        <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  )
}
