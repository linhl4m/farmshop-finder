'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function HeaderNav() {
  const pathname = usePathname()

  const linkClass = (href: string) => {
    const active = pathname === href

    return `text-sm font-semibold transition-colors ${
      active ? 'text-primary' : 'text-secondary hover:text-primary'
    }`
  }

  return (
    <nav className="hidden items-center gap-7 md:flex">
      <Link href="/" className={linkClass('/')}>
        Home
      </Link>

      <Link href="/farms" className={linkClass('/farms')}>
        Farms
      </Link>

      <Link href="/products" className={linkClass('/products')}>
        Products
      </Link>

      <Link
        href="#"
        className="text-sm font-semibold text-secondary hover:text-primary transition-colors"
      >
        Trending
      </Link>

      <Link
        href="#"
        className="text-sm font-semibold text-secondary hover:text-primary transition-colors"
      >
        Seasonal
      </Link>
    </nav>
  )
}
