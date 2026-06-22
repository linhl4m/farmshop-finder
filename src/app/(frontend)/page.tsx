import { getFarms } from '@/lib/data/farms'
import { getProducts } from '@/lib/data/products'
import { HomeContent } from '@/components/home/HomeContent'
import { getProductCategories } from '@/lib/data/productCategories'

type Props = {
  searchParams: Promise<{
    category?: string
    price?: string
    availability?: string
    distance?: string
  }>
}

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams

  const products = await getProducts({
    category: params.category,
    price: params.price,
    availability: params.availability,
    distance: params.distance,
    lat: params.lat,
    lng: params.lng,
  })

  const farms = await getFarms()

  const farmIds = new Set(
    products.map((product: any) =>
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
