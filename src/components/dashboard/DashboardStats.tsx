import { Euro, Package, ShoppingBag, Users } from 'lucide-react'

export function DashboardStats() {
  const stats = [
    {
      label: 'Revenue',
      value: '€1,245',
      icon: Euro,
      color: 'bg-green-500/10 text-green-600',
    },
    {
      label: 'Orders',
      value: '34',
      icon: ShoppingBag,
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      label: 'Products',
      value: '18',
      icon: Package,
      color: 'bg-orange-500/10 text-orange-600',
    },
    {
      label: 'Customers',
      value: '27',
      icon: Users,
      color: 'bg-purple-500/10 text-purple-600',
    },
  ]

  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold text-primary">Overview</h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-card p-4 shadow-sm transition sm:p-5">
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl sm:mb-4 sm:h-12 sm:w-12 ${stat.color}`}
            >
              <stat.icon size={20} className="sm:h-6 sm:w-6" />
            </div>

            <p className="text-xs text-muted-foreground sm:text-sm">{stat.label}</p>

            <p className="mt-1 text-xl font-bold sm:text-3xl">{stat.value}</p>

            <div className="mt-3 h-1 w-full rounded-full bg-muted sm:mt-4">
              <div
                className={`h-1 rounded-full ${
                  stat.label === 'Revenue'
                    ? 'bg-green-500'
                    : stat.label === 'Orders'
                      ? 'bg-blue-500'
                      : stat.label === 'Products'
                        ? 'bg-orange-500'
                        : 'bg-purple-500'
                }`}
                style={{ width: '70%' }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
