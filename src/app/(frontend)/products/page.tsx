import { ProductListing } from '@/components/products/ProductListing'
import { getProducts } from '@/lib/data/products'
import { getProductCategories } from '@/lib/data/productCategories'
import { FilterSidebar } from '@/components/filters/FilterSidebar'
import { getCurrentUser } from '@/lib/auth'
import { getFavoriteProductIds } from '@/lib/data/favorites'

type Props = {
  searchParams: Promise<{
    search?: string
    category?: string | string[]
    price?: string
    distance?: string
    organic?: string
    lat?: string
    lng?: string
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
    lat: filters.lat,
    lng: filters.lng,
  })

  const categories = await getProductCategories()

  const user = await getCurrentUser()

  const favoriteProductIds =
    user?.role === 'customer' ? new Set(await getFavoriteProductIds(user.id)) : new Set()

  const productsWithFavorites = products.map((product: any) => ({
    ...product,
    isFavorited: favoriteProductIds.has(product.id),
  }))

  return (
    <>
      <ProductListing
        title="All Products"
        description="Fresh products from all farms"
        products={productsWithFavorites}
        filters={<FilterSidebar categories={categories} sidebar showGlobalFilters={false} />}
        showFavorite={user?.role === 'customer'}
      />
    </>
  )
}
