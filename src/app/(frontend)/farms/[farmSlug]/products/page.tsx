import { notFound } from 'next/navigation'
import { getFarmBySlug, getProductCategoriesByFarmId } from '@/lib/data/farmDetails'
import { ProductListing } from '@/components/products/ProductListing'
import { ProductFilters } from '@/components/products/ProductFilters'
import { getProducts } from '@/lib/data/products'

type Props = {
  params: Promise<{
    farmSlug: string
  }>
  searchParams: Promise<{
    search?: string
    category?: string | string[]
    price?: string
  }>
}

export default async function FarmProductsPage({ params, searchParams }: Props) {
  const { farmSlug } = await params
  const filters = await searchParams

  const farm = await getFarmBySlug(farmSlug)

  if (!farm) notFound()

  const products = await getProducts({
    farmId: farm.id,
    search: filters.search,
    category: filters.category,
    price: filters.price,
  })

  const categories = await getProductCategoriesByFarmId(farm.id)

  return (
    <ProductListing
      title={`Products from ${farm.name}`}
      description="Fresh products available from this farm."
      products={products}
      filters={<ProductFilters categories={categories} showGlobalFilters={false} />}
    />
  )
}
