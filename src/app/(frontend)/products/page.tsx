import { ProductListing } from '@/components/products/ProductListing'
import { ProductFilters } from '@/components/products/ProductFilters'
import { getProducts } from '@/lib/data/products'
import { getProductCategories } from '@/lib/data/productCategories'

type Props = {
  searchParams: Promise<{
    search?: string
    category?: string | string[]
    price?: string
    distance?: string
    organic?: string
  }>
}

export default async function ProductsPage({ searchParams }: Props) {
  const filters = await searchParams

  const products = await getProducts({
    search: filters.search,
    category: filters.category,
    price: filters.price,
    distance: filters.distance,
    organic: filters.organic,
  })

  const categories = await getProductCategories()

  return (
    <ProductListing
      title="All Products"
      description="Fresh products from all farms"
      products={products}
      filters={<ProductFilters categories={categories} showGlobalFilters={true} />}
    />
  )
}
