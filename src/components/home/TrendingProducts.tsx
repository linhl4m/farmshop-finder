import Link from 'next/link'
import { ArrowRight, Leaf } from 'lucide-react'
import { ProductCard } from '@/components/products/ProductCard'

type Props = {
  products: any[]
}

export function TrendingProducts({ products }: Props) {
  return (
    <section className="mb-8">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
            <Leaf className="h-4 w-4" />
            Fresh from local farms
          </div>

          <h2 className="font-serif text-3xl font-semibold text-primary">Trending Products</h2>

          <p className="mt-1 text-sm text-secondary">
            Seasonal picks customers are browsing right now.
          </p>
        </div>

        <Link href="/products" className="text-sm font-semibold text-primary hover:underline">
          View all <ArrowRight className="inline h-4 w-4" />
        </Link>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide">
        {products.length > 0 ? (
          products
            .slice(0, 7)
            .map((product) => <ProductCard key={product.id} product={product} variant="small" />)
        ) : (
          <div className="flex w-full justify-center">
            <p className="p-6 text-sm text-muted-foreground">No products found.</p>
          </div>
        )}
      </div>
    </section>
  )
}
