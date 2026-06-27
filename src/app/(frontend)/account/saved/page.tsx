import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getFavoriteFarms, getFavoriteProducts } from '@/lib/data/favorites'
import { FarmCard } from '@/components/ui/FarmCard'
import { ProductCard } from '@/components/products/ProductCard'

export default async function SavedPage() {
  const user = await getCurrentUser()

  if (!user) redirect('/login')
  if (user.role !== 'customer') redirect('/account')

  const [farms, products] = await Promise.all([
    getFavoriteFarms(user.id, user),
    getFavoriteProducts(user.id, user),
  ])

  return (
    <main className="container-page py-10">
      <div className="mb-12">
        <h1 className="text-primary md:text-4xl lg:text-5xl">Saved</h1>
        <p className="mt-2 text-base text-muted-foreground md:text-lg">
          Farms and products you want to come back to.
        </p>
      </div>

      {/* Saved Farms */}
      <section className="mb-14">
        <h2 className="mb-6 text-primary md:text-2xl">Saved Farms</h2>

        {farms.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {farms.map((farm: any) => (
              <FarmCard key={farm.id} farm={farm} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-secondary">You haven't saved any farms yet.</p>
          </div>
        )}
      </section>

      {/* Saved Products */}
      <section>
        <h2 className="mb-6 text-primary md:text-2xl">Saved Products</h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} variant="large" />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-secondary">You haven't saved any products yet.</p>
          </div>
        )}
      </section>
    </main>
  )
}
