import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { getFarmByOwnerId } from '@/lib/data/farms'
import { getProductById } from '@/lib/data/dashboardProducts'
import { getProductCategories } from '@/lib/data/productCategories'
import { EditProductForm } from '@/components/dashboard/EditProductForm'

type Props = {
  params: Promise<{
    productId: string
  }>
}

export default async function EditProductPage({ params }: Props) {
  const { productId } = await params

  const user = await requireUser()
  const farm = (await getFarmByOwnerId(user.id))!

  const product = await getProductById(productId)

  const productFarmId = typeof product.farm === 'object' ? product.farm.id : product.farm

  if (productFarmId !== farm.id) {
    redirect('/dashboard/products')
  }

  const categories = await getProductCategories()

  return (
    <div className="flex-1">
      <section className="max-w-4xl px-6 py-8 md:px-12">
        <div className="mb-8">
          <h1 className="text-primary md:text-4xl">Edit Product</h1>
          <p className="mt-2 text-muted-foreground">
            Update product details, price, stock and availability.
          </p>
        </div>

        <EditProductForm product={product} categories={categories} />
      </section>
    </div>
  )
}
