import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/products/ProductCard'
import { HorizontalScroll } from '@/components/ui/HorizontalScroll'

type Props = {
  products: any[]
}

export function TrendingProducts({ products }: Props) {
  return (
    <section className="mb-12">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-primary md:text-2xl">Trending Products</h2>
          <p className="mt-1 text-sm text-secondary">Freshly harvested from your neighbors.</p>
        </div>
        <Link
          href="/products"
          className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          View all <ArrowRight className="inline h-4 w-4" />
        </Link>
      </div>

      <HorizontalScroll>
        {products.length > 0 ? (
          products
            .slice(0, 7)
            .map((product) => <ProductCard key={product.id} product={product} variant="small" />)
        ) : (
          <div className="flex w-full justify-center">
            <p className="p-6 text-sm text-muted-foreground">No products found.</p>
          </div>
        )}
      </HorizontalScroll>
    </section>
  )
}
