import { getFarms } from '@/lib/data/farms'
import { getProducts } from '@/lib/data/products'
import { HomeContent } from '@/components/home/HomeContent'
import { getProductCategories } from '@/lib/data/productCategories'

type Props = {
  searchParams: Promise<{
    category?: string
    price?: string
    distance?: string
    organic?: boolean
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
    organic: params.organic,
  })

  const products = await getProducts()

  const farms = await getFarms()

  const farmIds = new Set(
    productsForFilter.map((product: any) =>
      typeof product.farm === 'string' ? product.farm : product.farm?.id,
    ),
  )

  const filteredFarms = farms.filter((farm: any) => farmIds.has(farm.id))

  const categories = await getProductCategories()

  return (
    <>
      <HomeContent farms={filteredFarms} products={products} categories={categories} />
    </>
  )
}
