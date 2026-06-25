import Image from 'next/image'
import { EditProductSubmit } from './EditProductSubmit'

type Props = {
  product: any
  categories: any[]
}

export function EditProductForm({ product, categories }: Props) {
  const image = product.photos?.[0]

  const categoryId =
    typeof product.productCategory === 'object'
      ? product.productCategory.id
      : product.productCategory

  const existingPhotoIds = (product.photos ?? [])
    .map((photo: any) => (typeof photo === 'object' ? photo.id : photo))
    .filter(Boolean)

  return (
    <EditProductSubmit>
      <input type="hidden" name="productId" value={product.id} />
      <input type="hidden" name="existingPhotoIds" value={JSON.stringify(existingPhotoIds)} />

      <div>
        <label className="mb-2 block text-sm font-semibold text-primary">Product Image</label>

        {image && typeof image === 'object' && image.url ? (
          <Image
            src={image.url}
            alt={product.name}
            width={800}
            height={400}
            className="mb-4 h-64 w-full rounded-xl object-cover"
          />
        ) : null}

        <input
          type="file"
          name="photo"
          accept="image/*"
          className="w-full rounded-xl border bg-background px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-primary">Product Name</label>
        <input
          name="name"
          required
          defaultValue={product.name || ''}
          className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-primary">Description</label>
        <textarea
          name="description"
          defaultValue={product.description || ''}
          rows={5}
          className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-primary">Price</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={product.price || 0}
            className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-primary">Unit</label>
          <select
            name="unit"
            required
            defaultValue={product.unit || 'kg'}
            className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
          >
            <option value="kg">kg</option>
            <option value="lb">lb</option>
            <option value="dozen">dozen</option>
            <option value="bunch">bunch</option>
            <option value="piece">piece</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-primary">Category</label>
          <select
            name="productCategory"
            required
            defaultValue={categoryId || ''}
            className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
          >
            <option value="">Select category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-primary">Stock</label>
          <input
            name="stock"
            type="number"
            min="0"
            defaultValue={product.stock ?? 0}
            className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-primary">Status</label>
          <select
            name="status"
            defaultValue={product.status || 'in_season'}
            className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
          >
            <option value="in_season">In Season</option>
            <option value="out_of_season">Out of Season</option>
            <option value="sold_out">Sold Out</option>
          </select>
        </div>
      </div>
    </EditProductSubmit>
  )
}
