import { AddProductSubmit } from './AddProductSubmit'

type Props = {
  categories: any[]
}

export function AddProductForm({ categories }: Props) {
  return (
    <AddProductSubmit>
      <div>
        <label className="mb-2 block text-sm font-semibold text-primary">Product Image</label>
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
          className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-primary">Description</label>
        <textarea
          name="description"
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
            className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-primary">Unit</label>
          <select
            name="unit"
            required
            defaultValue="kg"
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
            defaultValue="0"
            className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-primary">Status</label>
          <select
            name="status"
            defaultValue="in_season"
            className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
          >
            <option value="in_season">In Season</option>
            <option value="out_of_season">Out of Season</option>
            <option value="sold_out">Sold Out</option>
          </select>
        </div>
      </div>
    </AddProductSubmit>
  )
}
