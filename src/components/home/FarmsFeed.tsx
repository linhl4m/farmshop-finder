import { FarmCard } from '@/components/ui/FarmCard'
import { ProductCard } from '@/components/products/ProductCard'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type Props = {
  farms: any[]
  products: any[]
  mapOpen?: boolean
  categories: string[]
}

export function FarmsFeed({ farms, products, mapOpen, categories }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {!mapOpen && (
        <section>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-serif text-2xl font-semibold text-primary">Trending Products</h2>
            <Link href="/products" className="text-sm font-semibold text-primary">
              View all <ArrowRight className="inline h-4 w-4" />
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {products.length > 0 ? (
              products
                .slice(0, 7)
                .map((product) => (
                  <ProductCard key={product.id} product={product} variant="small" />
                ))
            ) : (
              <p className="text-sm text-muted-foreground">No products found.</p>
            )}
          </div>
        </section>
      )}
      <section>
        <h2 className="mb-6 font-serif text-3xl font-semibold">Discover Farms</h2>

        {farms.length > 0 ? (
          <div
            className={
              mapOpen ? 'grid gap-8 md:grid-cols-2' : 'grid gap-8 md:grid-cols-2 xl:grid-cols-3'
            }
          >
            {farms.map((farm) => (
              <FarmCard key={farm.id} farm={farm} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl p-12 text-center">
            <h3 className="mb-2 font-serif text-xl font-semibold">No farms found</h3>

            <p className="text-sm text-muted-foreground">Try changing your filters.</p>
          </div>
        )}
      </section>
    </div>
  )
}
