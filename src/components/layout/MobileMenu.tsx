'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
  Bell,
  Heart,
  User,
  Home,
  Wheat,
  ShoppingBasket,
  TrendingUp,
  Leaf,
  LogOut,
} from 'lucide-react'
import { logoutAction } from '@/app/(frontend)/account/actions'

type Props = {
  isLoggedIn: boolean
  isCustomer: boolean
}

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/farms', label: 'Farms', icon: Wheat },
  { href: '/products', label: 'Products', icon: ShoppingBasket },
  { href: '#', label: 'Trending', icon: TrendingUp },
  { href: '#', label: 'Seasonal', icon: Leaf },
]

export function MobileMenu({ isLoggedIn, isCustomer }: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const linkClass = (href: string) => {
    const active = pathname === href
    return `flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
      active ? 'bg-primary/10 text-primary' : 'text-secondary hover:bg-primary/5 hover:text-primary'
    }`
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-full text-primary transition hover:bg-primary/10 md:hidden"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 z-999 md:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <div className="absolute right-0 top-0 h-full w-72 bg-[#f9faf2] shadow-2xl flex flex-col">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <span className="font-serif text-xl font-bold text-primary">Menu</span>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 text-secondary hover:bg-primary/10 transition"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex flex-col gap-1 px-3 py-4">
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <Link key={label} href={href} className={linkClass(href)}>
                    <Icon size={18} />
                    {label}
                  </Link>
                ))}
              </nav>

              {isLoggedIn && (
                <>
                  <div className="mx-5 border-t border-border" />
                  <div className="flex flex-col gap-1 px-3 py-4">
                    <Link href="/account" className={linkClass('/account')}>
                      <User size={18} />
                      Profile
                    </Link>

                    <button className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold text-secondary hover:bg-primary/5 hover:text-primary transition-colors text-left">
                      <Bell size={18} />
                      Notifications
                    </button>

                    {isCustomer && (
                      <Link href="/account/saved" className={linkClass('/account/saved')}>
                        <Heart size={18} />
                        Favorites
                      </Link>
                    )}

                    <form action={logoutAction}>
                      <button
                        type="submit"
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-base font-semibold text-destructive transition-colors hover:bg-destructive/10"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </form>
                  </div>
                </>
              )}

              {!isLoggedIn && (
                <div className="px-5 pt-2">
                  <Link
                    href="/login"
                    className="block w-full rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-primary/90"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
