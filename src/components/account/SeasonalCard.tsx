import Link from 'next/link'

export function SeasonalCard() {
  return (
    <section className="rounded-2xl bg-primary p-6 text-primary-foreground">
      <h2 className="text-xl font-semibold">New Season Arrivals</h2>

      <p className="mt-2 text-sm opacity-80">
        Fresh spring products are now available from nearby farms.
      </p>

      <Link
        href="/products"
        className="mt-5 inline-block rounded-lg border px-4 py-2 text-sm font-medium"
      >
        Browse seasonal
      </Link>
    </section>
  )
}
