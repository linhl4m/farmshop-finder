import Image from 'next/image'
import { notFound } from 'next/navigation'
import {
  getFarmBySlug,
  getAvailableProductsByFarmId,
  getSeasonalProductsByFarmId,
  getReviewsByFarmId,
} from '@/lib/data/farmDetails'
import { Leaf, MapPin, ShieldCheck, ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/products/ProductCard'
import Link from 'next/link'
import { ReviewsSection } from '@/components/reviews/ReviewsSection'
import { getCurrentUser } from '@/lib/auth'
import { customerHasOrderFromFarm } from '@/lib/data/orders'
import { ReviewModalButton } from '@/components/reviews/ReviewModalButton'
import { FavoriteFarmButton } from '@/components/favorites/FavoriteFarmButton'
import { getIsFarmFavorited, getFavoriteProductIds } from '@/lib/data/favorites'

type Props = {
  params: Promise<{
    farmSlug: string
  }>
}

export default async function FarmPage({ params }: Props) {
  const { farmSlug } = await params

  const farm = await getFarmBySlug(farmSlug)

  if (!farm) notFound()

  const user = await getCurrentUser()

  const canWriteReview =
    user?.role === 'customer' ? await customerHasOrderFromFarm(user.id, farm.id) : false

  const isFavorited = user?.role === 'customer' ? await getIsFarmFavorited(user.id, farm.id) : false

  const favoriteProductIds =
    user?.role === 'customer' ? new Set(await getFavoriteProductIds(user.id)) : new Set()

  const availableProducts = await getAvailableProductsByFarmId(farm.id)

  const availableProductsWithFavorites = availableProducts.map((product: any) => ({
    ...product,
    isFavorited: favoriteProductIds.has(product.id),
  }))

  const seasonalProducts = await getSeasonalProductsByFarmId(farm.id)
  const reviews = await getReviewsByFarmId(farm.id)

  const heroImage = farm.coverImage?.url

  return (
    <main className="container-page">
      <section className="mb-12">
        <div className="relative mb-8 h-[300px] overflow-hidden rounded-xl shadow-lg md:h-[450px]">
          {heroImage ? (
            <Image
              src={heroImage}
              alt={farm.name}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="h-full bg-[#e2e3dc]" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

          {user?.role === 'customer' && (
            <FavoriteFarmButton
              farmId={farm.id}
              farmSlug={farm.slug}
              initialFavorited={isFavorited}
              className="absolute right-6 top-6 z-20"
            />
          )}

          <div className="absolute bottom-8 left-8 z-10 text-white">
            <h1 className="mb-4 text-white md:text-4xl lg:text-5xl">{farm.name}</h1>

            <div className="flex flex-wrap gap-2">
              {farm.organic && (
                <span className="flex items-center gap-1 rounded-full bg-[#bcf0ae] px-3 py-1 text-xs font-bold text-[#23501e]">
                  <Leaf className="h-3.5 w-3.5" />
                  ORGANIC
                </span>
              )}

              {farm.type && (
                <span className="rounded-full bg-[#ffdcc3] px-3 py-1 text-xs font-bold text-[#5a2e00]">
                  {farm.type.toUpperCase()}
                </span>
              )}

              {farm.location?.city && (
                <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                  <MapPin className="h-3.5 w-3.5" />
                  {farm.location.city}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <h2 className="mb-4 text-primary md:text-2xl">Our Story</h2>

            <p className="text-base leading-relaxed text-secondary md:text-lg">
              {farm.description}
            </p>
          </div>

          <aside className="rounded-xl border border-[#c2c9bb]/30 bg-[#f3f4ed] p-6 md:col-span-4">
            <div className="mb-4 flex items-center gap-4">
              <ShieldCheck className="h-8 w-8 text-primary" />

              <div>
                <p className="font-semibold text-primary">Certified Local Farm</p>
                <p className="text-xs text-secondary">Fresh products from {farm.region}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary">Rating</span>
                <span className="font-semibold text-primary">
                  {farm.ratingAverage?.toFixed(1) ?? 0} ({farm.ratingCount ?? 0} reviews)
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-secondary">Region</span>
                <span className="font-semibold text-primary">{farm.region}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Available Products */}
      <section className="mb-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-primary md:text-2xl">Available Now</h2>
            <p className="text-secondary">Fresh products from this farm</p>
          </div>
          <Link
            href={`/farms/${farm.slug}/products`}
            className="font-semibold text-primary hover:underline"
          >
            View all <ArrowRight className="inline h-4 w-4" />
          </Link>
        </div>

        {availableProductsWithFavorites.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {availableProductsWithFavorites.slice(0, 4).map((product: any) => (
              <ProductCard key={product.id} product={product} variant="large" showFavorite={user?.role === 'customer'} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl p-8 text-center text-secondary">
            No products available right now.
          </div>
        )}
      </section>

      {/* Seasonal Favorites */}
      <section className="mb-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-primary md:text-2xl">Seasonal Favorites</h2>
          </div>
        </div>

        {seasonalProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-1 lg:grid-cols-3">
            {seasonalProducts.slice(0, 3).map((product: any) => (
              <ProductCard key={product.id} product={product} variant="seasonal" />
            ))}
          </div>
        ) : (
          <div className="rounded-xl p-8 text-center text-secondary">
            No products available right now.
          </div>
        )}
      </section>

      {/* Customer Reviews */}
      <ReviewsSection
        reviews={reviews}
        ratingAverage={farm.ratingAverage}
        ratingCount={farm.ratingCount}
        canWriteReview={canWriteReview}
        reviewButton={<ReviewModalButton farmId={farm.id} farmSlug={farm.slug} />}
        viewAllHref="#"
      />
    </main>
  )
}
