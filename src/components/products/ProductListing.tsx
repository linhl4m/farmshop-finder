import { ProductCard } from '@/components/products/ProductCard'

type Props = {
  title: string
  description?: string
  products: any[]
  filters?: React.ReactNode
  showFavorite?: boolean
}

export function ProductListing({ title, description, products, filters, showFavorite }: Props) {
  return (
    <main className="container-page">
      <div className="flex gap-8">
        {filters}

        <section className="flex-1">
          <div className="mb-6 border-b border-border pb-4">
            <h1 className="text-primary md:text-4xl">{title}</h1>

            {description && <p className="mt-2 text-secondary">{description}</p>}

            <p className="mt-4 text-sm text-secondary">Showing {products.length} products</p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} variant="market" showFavorite={showFavorite} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl p-10 text-center text-secondary">No products found.</div>
          )}
        </section>
      </div>
    </main>
  )
}
