import Link from 'next/link'

type Props = {
  products: any[]
}

export function ProductListings({ products }: Props) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-primary">Product Listings</h2>

        <Link
          href="/dashboard/products"
          className="text-sm font-semibold text-primary hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.name}
            className="flex items-center justify-between rounded-xl border p-4"
          >
            <div>
              <p className="font-semibold">{product.name}</p>

              <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
            </div>

            <p className="font-semibold text-primary">€{product.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
