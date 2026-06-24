import Image from 'next/image'
import { notFound } from 'next/navigation'
import {
  getFarmBySlug,
  getAvailableProductsByFarmId,
  getSeasonalProductsByFarmId,
  getReviewsByFarmId,
} from '@/lib/data/farmDetails'
import { Star, Leaf, MapPin, ShieldCheck, ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/products/ProductCard'
import Link from 'next/link'

type Props = {
  params: Promise<{
    farmSlug: string
  }>
}

export default async function FarmPage({ params }: Props) {
  const { farmSlug } = await params

  const farm = await getFarmBySlug(farmSlug)

  if (!farm) notFound()

  const availableProducts = await getAvailableProductsByFarmId(farm.id)
  const seasonalProducts = await getSeasonalProductsByFarmId(farm.id)
  const reviews = await getReviewsByFarmId(farm.id)

  const heroImage = farm.photos?.[0]?.url

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

          <div className="absolute bottom-8 left-8 z-10 text-white">
            <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">{farm.name}</h1>

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
            <h2 className="mb-4 font-serif text-2xl font-semibold text-primary">Our Story</h2>

            <p className="text-lg leading-relaxed text-secondary">{farm.description}</p>
          </div>

          <aside className="rounded-xl border border-[#c2c9bb]/30 bg-[#f3f4ed] p-6 md:col-span-4">
            <div className="mb-4 flex items-center gap-4">
              <ShieldCheck className="h-8 w-8 text-primary" />

              <div>
                <p className="font-semibold text-primary">Certified Local Farm</p>
                <p className="text-xs text-secondary">Fresh products from Brandenburg</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary">Rating</span>
                <span className="font-semibold text-primary">
                  {farm.ratingAverage ?? 0} ({farm.ratingCount ?? 0} reviews)
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
            <h2 className="font-serif text-2xl font-semibold text-primary">Available Now</h2>
            <p className="text-secondary">Fresh products from this farm</p>
          </div>
          <Link
            href={`/farms/${farm.slug}/products`}
            className="font-semibold text-primary hover:underline"
          >
            View all <ArrowRight className="inline h-4 w-4" />
          </Link>
        </div>

        {availableProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {availableProducts.slice(0, 4).map((product: any) => (
              <ProductCard key={product.id} product={product} variant="large" />
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
            <h2 className="font-serif text-2xl font-semibold text-primary">Seasonal Favorites</h2>
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
      <section className="rounded-2xl border border-[#c2c9bb]/20 bg-[#f3f4ed] p-6 md:p-10">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-primary">Customer Reviews</h2>

            <div className="mt-2 flex items-center gap-2">
              <div className="flex text-[#5a2e00]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-current" />
                ))}
              </div>

              <span className="text-sm font-semibold text-primary">
                {farm.ratingAverage ?? 0} average based on {farm.ratingCount ?? 0} reviews
              </span>
            </div>
          </div>

          <button className="rounded-full border border-primary px-6 py-2 text-sm font-semibold text-primary hover:bg-primary/5">
            Write a Review
          </button>
        </div>

        {reviews.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {reviews.map((review: any) => (
              <div
                key={review.id}
                className="rounded-xl border border-[#c2c9bb]/20 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#bcf0ae] font-bold text-[#23501e]">
                    {review.customer?.email?.slice(0, 2).toUpperCase() ?? 'CU'}
                  </div>

                  <div>
                    <p className="font-semibold text-primary">{review.title}</p>
                    <p className="text-xs text-secondary">Verified Customer</p>
                  </div>
                </div>

                <p className="mb-4 italic text-secondary">"{review.comment}"</p>

                <div className="flex text-[#5a2e00]">
                  {Array.from({ length: review.rating ?? 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-secondary">No reviews yet.</p>
        )}
      </section>
    </main>
  )
}
