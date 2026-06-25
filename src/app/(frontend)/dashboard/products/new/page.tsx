import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { getFarmByOwnerId } from '@/lib/data/farms'
import { getProductCategories } from '@/lib/data/productCategories'
import { AddProductForm } from '@/components/dashboard/AddProductForm'

export default async function NewProductPage() {
  const user = await requireUser()

  if (user.role !== 'farm') {
    redirect('/account')
  }

  const farm = await getFarmByOwnerId(user.id)

  if (!farm) {
    redirect('/dashboard')
  }

  const categories = await getProductCategories()

  return (
    <main className="flex min-h-screen bg-background">
      <div className="flex-1">
        <section className="max-w-4xl px-6 py-8 md:px-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary">Add Product</h1>
            <p className="mt-2 text-muted-foreground">
              Create a new product listing for your farm.
            </p>
          </div>

          <AddProductForm categories={categories} />
        </section>
      </div>
    </main>
  )
}
