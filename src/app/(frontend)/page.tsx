import { getFarms } from '@/lib/data/farms'
import { getProducts, getTrendingProducts } from '@/lib/data/products'
import { HomeContent } from '@/components/home/HomeContent'
import { getProductCategories } from '@/lib/data/productCategories'
import { getCurrentUser } from '@/lib/auth'
import { getFavoriteFarmIds, getFavoriteProductIds } from '@/lib/data/favorites'

type Props = {
  searchParams: Promise<{
    search?: string
    category?: string
    price?: string
    distance?: string
    organic?: string
    lat?: string
    lng?: string
  }>
}

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams

  const productsForFilter = await getProducts({
    search: params.search,
    category: params.category,
    price: params.price,
    distance: params.distance,
    lat: params.lat,
    lng: params.lng,
    organic: params.organic,
  })

  const [products, farms, user, categories] = await Promise.all([
    getTrendingProducts(),
    getFarms(),
    getCurrentUser(),
    getProductCategories(),
  ])

  // Farm IDs from products matching filters
  const farmIdsFromProducts = new Set(
    productsForFilter.map((product: any) =>
      typeof product.farm === 'string' ? product.farm : product.farm?.id,
    ),
  )

  // Farm IDs from direct farm name/description match (JS filter on already-fetched farms)
  const searchLower = params.search?.toLowerCase() ?? ''
  const farmIdsFromSearch = new Set(
    searchLower
      ? farms
          .filter(
            (f: any) =>
              f.name?.toLowerCase().includes(searchLower) ||
              f.description?.toLowerCase().includes(searchLower),
          )
          .map((f: any) => f.id)
      : [],
  )

  // Union: show farm if it has matching products OR its name matches the search
  const allRelevantFarmIds = new Set([...farmIdsFromProducts, ...farmIdsFromSearch])
  const filteredFarms = farms.filter((farm: any) => allRelevantFarmIds.has(farm.id))

  const favoriteFarmIds =
    user?.role === 'customer' ? new Set(await getFavoriteFarmIds(user.id)) : new Set()

  const farmsWithFavorites = filteredFarms.map((farm: any) => ({
    ...farm,
    isFavorited: favoriteFarmIds.has(farm.id),
  }))

  const favoriteProductIds =
    user?.role === 'customer' ? new Set(await getFavoriteProductIds(user.id)) : new Set()

  const productsWithFavorites = products.map((product: any) => ({
    ...product,
    isFavorited: favoriteProductIds.has(product.id),
  }))

  return (
    <>
      <HomeContent
        farms={farmsWithFavorites}
        products={productsWithFavorites}
        categories={categories}
        lat={params.lat}
        lng={params.lng}
        distance={params.distance}
        showFavorite={user?.role === 'customer'}
      />
    </>
  )
}
