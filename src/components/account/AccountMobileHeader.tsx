import Link from 'next/link'
import { ShoppingBasket } from 'lucide-react'

export function AccountMobileHeader() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-background/80 px-6 py-4 backdrop-blur md:hidden">
      <Link href="/" className="text-xl font-bold text-primary">
        Farmshop Finder
      </Link>

      <ShoppingBasket className="text-muted-foreground" />
    </header>
  )
}
