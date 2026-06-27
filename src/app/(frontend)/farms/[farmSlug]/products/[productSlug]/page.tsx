import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Leaf, MapPin, Star, Store } from 'lucide-react'
import { getFarmBySlug } from '@/lib/data/farmDetails'
import { ProductQuantity } from '@/components/products/ProductQuantity'
import { ReviewsSection } from '@/components/reviews/ReviewsSection'
import { getCurrentUser } from '@/lib/auth'
import { customerHasOrderedProduct } from '@/lib/data/orders'
import { ReviewModalButton } from '@/components/reviews/ReviewModalButton'
import { getProductBySlugAndFarmId, getReviewsByProductId } from '@/lib/data/productDetails'
import { getIsProductFavorited } from '@/lib/data/favorites'

type Props = {
  params: Promise<{
    farmSlug: string
    productSlug: string
  }>
}

function getAvailability(product: any) {
  if (product.status === 'out_of_season') return 'Out of Season'
  if (product.stock <= 0) return 'Sold Out'
  return 'Available'
}

export default async function ProductDetailPage({ params }: Props) {
  const { farmSlug, productSlug } = await params

  const farm = await getFarmBySlug(farmSlug)
  if (!farm) notFound()

  const product = await getProductBySlugAndFarmId(productSlug, farm.id)
  if (!product) notFound()

  const reviews = await getReviewsByProductId(product.id)

  const user = await getCurrentUser()

  const isFavorited =
    user?.role === 'customer' ? await getIsProductFavorited(user.id, product.id) : false

  const canWriteReview =
    user?.role === 'customer' ? await customerHasOrderedProduct(user.id, product.id) : false

  const rawPhoto = product.photos?.[0]
  const image = typeof rawPhoto === 'object' ? rawPhoto : null
  const category = typeof product.productCategory === 'object' ? product.productCategory.name : null

  const availability = getAvailability(product)
  const canBuy = availability === 'Available'
  return (
    <main className="container-page space-y-16">
      <section className="grid grid-cols-1 items-start gap-6 xl:gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-white shadow-sm">
            {image?.url ? (
              <Image
                src={image.url}
                alt={product.name}
                fill
                priority
                className="object-cover transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            ) : (
              <div className="h-full bg-[#e2e3dc]" />
            )}

            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              {farm.organic && (
                <span className="rounded-full bg-[#2d5a27]/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#9dd090]">
                  Organic
                </span>
              )}

              {category && (
                <span className="rounded-full bg-[#ffdcc3] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#5a2e00]">
                  {category}
                </span>
              )}
            </div>
          </div>

          {product.photos && product.photos.length > 1 && (
            <div className="mt-4 flex gap-4">
              {product.photos.slice(0, 3).map((photo: any, index: number) => (
                <div
                  key={photo.id ?? index}
                  className="relative h-24 w-24 overflow-hidden rounded-lg border border-[#c2c9bb]"
                >
                  <Image src={photo.url} alt={product.name} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6 lg:sticky lg:top-28 lg:col-span-5">
          <div>
            <Link
              href={`/farms/${farm.slug}`}
              className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              <Store className="h-4 w-4" />
              {farm.name}
            </Link>

            <h1 className="text-primary md:text-4xl lg:text-5xl">{product.name}</h1>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex text-[#5a2e00]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-current" />
                ))}
              </div>

              <span className="text-sm font-semibold text-secondary">
                ({product.ratingCount ?? 0} Reviews)
              </span>
            </div>

            <p className="mt-6 text-xl font-bold text-primary md:text-2xl">
              €{Number(product.price).toFixed(2)}{' '}
              <span className="text-sm font-normal text-secondary md:text-base">
                / {product.unit}
              </span>
            </p>
          </div>

          <p className="text-base leading-relaxed text-secondary md:text-lg">
            {product.description}
          </p>

          <div className="rounded-xl border border-[#c2c9bb]/30 bg-[#f3f4ed] p-5">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-primary">
              Product Info
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between border-b border-[#c2c9bb]/30 pb-2">
                <span className="text-secondary">Stock</span>
                <span className="font-bold text-primary">{product.stock ?? 0}</span>
              </div>

              <div className="flex justify-between border-b border-[#c2c9bb]/30 pb-2">
                <span className="text-secondary">Status</span>
                <span className="font-bold text-primary">{availability}</span>
              </div>

              <div className="flex justify-between border-b border-[#c2c9bb]/30 pb-2">
                <span className="text-secondary">Farm</span>
                <span className="font-bold text-primary">{farm.name}</span>
              </div>

              <div className="flex justify-between border-b border-[#c2c9bb]/30 pb-2">
                <span className="text-secondary">Region</span>
                <span className="font-bold text-primary">{farm.region}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-secondary">
            <MapPin className="h-4 w-4 text-primary" />
            {farm.location?.city ?? farm.region}
            {farm.organic && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-[#bcf0ae]/40 px-2 py-1 text-xs font-bold text-primary">
                <Leaf className="h-3 w-3" />
                Organic
              </span>
            )}
          </div>

          <ProductQuantity
            product={product}
            farmId={farm.id}
            farmSlug={farmSlug}
            disabled={!canBuy}
            stock={product.stock ?? 0}
            unit={product.unit}
            availability={availability}
            initialFavorited={isFavorited}
            showFavorite={user?.role === 'customer'}
          />
        </div>
      </section>
      <ReviewsSection
        reviews={reviews}
        ratingAverage={product.ratingAverage ?? 0}
        ratingCount={product.ratingCount ?? 0}
        canWriteReview={canWriteReview}
        reviewButton={
          <ReviewModalButton farmId={farm.id} farmSlug={farm.slug} productId={product.id} productSlug={product.slug} />
        }
        viewAllHref={`/farms/${farm.slug}/products/${product.slug}/reviews`}
      />
    </main>
  )
}
