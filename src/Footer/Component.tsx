import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-[#c2c9bb]/20 bg-[#f9faf2] z-10">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="font-serif text-2xl font-bold text-primary">Farmshop Finder</h3>

            <p className="mt-3 max-w-sm text-sm text-secondary">
              Discover local farms, support sustainable agriculture, and buy fresh products directly
              from the source.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-primary">Explore</h4>

            <div className="flex flex-col gap-2 text-sm text-secondary">
              <Link href="/">Home</Link>
              <Link href="/farms">Farms</Link>
              <Link href="/map">Map</Link>
              <Link href="/products">Products</Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-primary">Account</h4>

            <div className="flex flex-col gap-2 text-sm text-secondary">
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
              <Link href="/account">My Orders</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[#c2c9bb]/20 pt-6 text-sm text-secondary">
          © {new Date().getFullYear()} Farmshop Finder. Built for local farms.
        </div>
      </div>
    </footer>
  )
}
