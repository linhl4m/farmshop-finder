import { notFound } from 'next/navigation'
import { getFarmBySlug, getProductCategoriesByFarmId } from '@/lib/data/farmDetails'
import { ProductListing } from '@/components/products/ProductListing'
import { FilterSidebar } from '@/components/filters/FilterSidebar'
import { getProducts } from '@/lib/data/products'
import { getCurrentUser } from '@/lib/auth'
import { getFavoriteProductIds } from '@/lib/data/favorites'

type Props = {
  params: Promise<{
    farmSlug: string
  }>
  searchParams: Promise<{
    search?: string
    category?: string | string[]
    price?: string
    available?: string
  }>
}

export default async function FarmProductsPage({ params, searchParams }: Props) {
  const { farmSlug } = await params
  const filters = await searchParams

  const farm = await getFarmBySlug(farmSlug)

  if (!farm) notFound()

  const user = await getCurrentUser()

  const products = await getProducts({
    farmId: farm.id,
    search: filters.search,
    category: filters.category,
    price: filters.price,
    available: filters.available,
  })

  const categories = await getProductCategoriesByFarmId(farm.id)

  const favoriteProductIds =
    user?.role === 'customer' ? new Set(await getFavoriteProductIds(user.id)) : new Set()

  const productsWithFavorites = products.map((product: any) => ({
    ...product,
    isFavorited: favoriteProductIds.has(product.id),
  }))

  return (
    <ProductListing
      title={`Products from ${farm.name}`}
      description="Fresh products available from this farm."
      products={productsWithFavorites}
      filters={<FilterSidebar categories={categories} sidebar showGlobalFilters={false} showDistanceFilter={false} />}
    />
  )
}
