import Link from 'next/link'

type Props = {
  products: any[]
}

export function ProductListings({ products }: Props) {
  return (
    <section className="max-w-3xl rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-primary">Product Listings</h2>

        <Link
          href="/dashboard/products"
          className="text-sm font-semibold text-primary hover:underline"
        >
          View All
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="font-semibold text-primary">No products yet</p>

          <p className="mt-2 text-sm text-muted-foreground">
            Add products to start selling from your farm.
          </p>

          <Link
            href="/dashboard/products/new"
            className="mt-5 inline-flex rounded-xl bg-primary px-4 py-2 font-semibold text-white"
          >
            Add Product
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
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
      )}
    </section>
  )
}
