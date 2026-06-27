import { getProductCategories } from '@/lib/data/productCategories'
import { AddProductForm } from '@/components/dashboard/AddProductForm'

export default async function NewProductPage() {
  const categories = await getProductCategories()

  return (
    <div className="flex-1">
      <section className="max-w-4xl px-6 py-8 md:px-12">
        <div className="mb-8">
          <h1 className="text-primary md:text-4xl">Add Product</h1>
          <p className="mt-2 text-muted-foreground">
            Create a new product listing for your farm.
          </p>
        </div>

        <AddProductForm categories={categories} />
      </section>
    </div>
  )
}
