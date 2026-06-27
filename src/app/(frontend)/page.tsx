import { getFarms } from '@/lib/data/farms'
import { getProducts } from '@/lib/data/products'
import { HomeContent } from '@/components/home/HomeContent'
import { getProductCategories } from '@/lib/data/productCategories'
import { getCurrentUser } from '@/lib/auth'
import { getFavoriteFarmIds, getFavoriteProductIds } from '@/lib/data/favorites'

type Props = {
  searchParams: Promise<{
    category?: string
    price?: string
    distance?: string
    organic?: boolean
    lat?: string
    lng?: string
  }>
}

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams

  const productsForFilter = await getProducts({
    category: params.category,
    price: params.price,
    distance: params.distance,
    lat: params.lat,
    lng: params.lng,
    organic: params.organic === 'true',
  })

  const [products, farms, user, categories] = await Promise.all([
    getProducts(),
    getFarms(),
    getCurrentUser(),
    getProductCategories(),
  ])

  const farmIds = new Set(
    productsForFilter.map((product: any) =>
      typeof product.farm === 'string' ? product.farm : product.farm?.id,
    ),
  )

  const filteredFarms = farms.filter((farm: any) => farmIds.has(farm.id))

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
      />
    </>
  )
}
