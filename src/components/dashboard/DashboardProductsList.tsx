import Image from 'next/image'
import Link from 'next/link'
import { Package, Pencil, Trash2 } from 'lucide-react'
import { deleteProductAction } from '@/app/(frontend)/dashboard/products/actions'

type Props = {
  products: any[]
}

export function DashboardProductsList({ products }: Props) {
  function getStatusLabel(status: string) {
    if (status === 'in_season') return 'In Season'
    if (status === 'out_of_season') return 'Out of Season'
    if (status === 'sold_out') return 'Sold Out'
    return status
  }

  function getStatusClass(status: string) {
    if (status === 'in_season') return 'bg-green-100 text-green-700'
    if (status === 'out_of_season') return 'bg-amber-100 text-amber-700'
    if (status === 'sold_out') return 'bg-red-100 text-red-700'
    return 'bg-muted text-muted-foreground'
  }

  if (products.length === 0) {
    return (
      <div className="p-12 text-center">
        <Package className="mx-auto mb-4 text-muted-foreground" size={44} />
        <h2 className="text-2xl font-semibold">No products yet</h2>
        <p className="mt-2 text-muted-foreground">Add products to start selling from your farm.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_6rem] gap-4 border-b bg-muted/40 px-5 py-3 text-sm font-semibold text-muted-foreground">
        <span>Product</span>
        <span>Category</span>
        <span>Price</span>
        <span>Status</span>
        <span />
      </div>

      <div className="divide-y">
        {products.map((product) => {
          const image = product.photos?.[0]
          const category =
            typeof product.productCategory === 'object'
              ? product.productCategory.name
              : 'Uncategorized'

          return (
            <div
              key={product.id}
              className="grid grid-cols-[1.5fr_1fr_1fr_1fr_6rem] items-center gap-4 px-5 py-4"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-muted">
                  {image && typeof image === 'object' && image.url ? (
                    <Image src={image.url} alt={product.name} fill className="object-cover" />
                  ) : null}
                </div>

                <div>
                  <p className="font-semibold text-primary">{product.name}</p>
                  <p className="text-sm text-muted-foreground">Stock: {product.stock ?? 0}</p>
                </div>
              </div>

              <p className="text-sm">{category}</p>

              <p className="font-semibold">
                €{Number(product.price).toFixed(2)} / {product.unit}
              </p>

              <span
                className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                  product.status,
                )}`}
              >
                {getStatusLabel(product.status)}
              </span>

              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/products/${product.id}/edit`}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-primary hover:bg-primary/10"
                >
                  <Pencil size={18} />
                </Link>

                <form action={deleteProductAction}>
                  <input type="hidden" name="productId" value={product.id} />

                  <button
                    type="submit"
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </form>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
