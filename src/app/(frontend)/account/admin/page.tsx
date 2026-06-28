import Link from 'next/link'
import { Users, Store, Package, ShoppingBag, ArrowRight } from 'lucide-react'

const stats = [
  {
    title: 'Users',
    value: '1,248',
    icon: Users,
  },
  {
    title: 'Farms',
    value: '87',
    icon: Store,
  },
  {
    title: 'Products',
    value: '1,563',
    icon: Package,
  },
  {
    title: 'Orders',
    value: '3,912',
    icon: ShoppingBag,
  },
]

export default function AdminDashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-8 md:px-12">
      <div className="mb-10">
        <h1 className="text-primary md:text-4xl lg:text-5xl">Admin Dashboard</h1>

        <p className="mt-2 text-muted-foreground md:text-lg">
          Overview of the marketplace and administrative tools.
        </p>
      </div>

      <div className="grid gap-5 grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div key={stat.title} className="rounded-2xl border bg-card p-6 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={24} />
              </div>

              <p className="text-sm text-muted-foreground">{stat.title}</p>

              <p className="mt-1 text-3xl font-bold text-primary">{stat.value}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-10 rounded-2xl border bg-card p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-primary">Payload Admin Panel</h2>

        <p className="mt-2 max-w-2xl text-muted-foreground">
          Manage collections, users, farms, products, media and all administrative tasks through
          Payload's built-in admin panel.
        </p>

        <Link
          href="/admin"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:opacity-90"
        >
          Go to Admin Panel
          <ArrowRight size={18} />
        </Link>
      </div>
    </main>
  )
}
