import { getFarms } from '@/lib/data/farms'
import { getProducts } from '@/lib/data/products'
import { HomeContent } from '@/components/home/HomeContent'
import { getProductCategories } from '@/lib/data/productCategories'
import { getCurrentUser } from '@/lib/auth'
import { getFavoriteFarmIds } from '@/lib/data/favorites'

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

export default async function FarmsPage({ searchParams }: Props) {
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

  const [farms, user, categories] = await Promise.all([
    getFarms(),
    getCurrentUser(),
    getProductCategories(),
  ])

  const farmIdsFromProducts = new Set(
    productsForFilter.map((product: any) =>
      typeof product.farm === 'string' ? product.farm : product.farm?.id,
    ),
  )

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

  const allRelevantFarmIds = new Set([...farmIdsFromProducts, ...farmIdsFromSearch])
  const filteredFarms = farms.filter((farm: any) => allRelevantFarmIds.has(farm.id))

  const favoriteFarmIds =
    user?.role === 'customer' ? new Set(await getFavoriteFarmIds(user.id)) : new Set()

  const farmsWithFavorites = filteredFarms.map((farm: any) => ({
    ...farm,
    isFavorited: favoriteFarmIds.has(farm.id),
  }))

  return (
    <HomeContent
      farms={farmsWithFavorites}
      categories={categories}
      lat={params.lat}
      lng={params.lng}
      distance={params.distance}
      showFavorite={user?.role === 'customer'}
      hideTrending
      title="All Farms"
      description="Discover local farms near you"
    />
  )
}
