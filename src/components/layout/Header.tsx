import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#c2c9bb]/20 bg-[#f9faf2]">
      <div className="flex items-center justify-between px-6 py-4 lg:px-16">
        <Link href="/" className="font-serif text-3xl font-bold">
          Farmshop Finder
        </Link>

        <div className="hidden w-full max-w-xl items-center rounded-full border border-[#c2c9bb]/40 bg-white px-5 py-3 md:flex">
          <input
            placeholder="Search farms, produce, or honey..."
            className="w-full bg-transparent outline-none"
          />
        </div>

        <div className="flex items-center gap-6">
          <button>Cart</button>
          <button>Profile</button>
        </div>
      </div>
    </header>
  )
}
