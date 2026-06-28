import Image from 'next/image'
import Link from 'next/link'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { Plus } from 'lucide-react'
import { FavoriteProductButton } from '@/components/favorites/FavoriteProductButton'

type Props = {
  product: any
  variant?: 'small' | 'large' | 'seasonal' | 'market'
  showFavorite?: boolean
}

const CATEGORY_COLORS = {
  produce: {
    solid: 'bg-[#dcf0dc] text-[#1a5c1a]',
    overlay: 'bg-[#dcf0dc]/90 text-[#1a5c1a]',
  },
  dairy: {
    solid: 'bg-[#fff8e1] text-[#7a5c00]',
    overlay: 'bg-[#fff8e1]/90 text-[#7a5c00]',
  },
  eggs: {
    solid: 'bg-[#fff3cd] text-[#856404]',
    overlay: 'bg-[#fff3cd]/90 text-[#856404]',
  },
  meat: {
    solid: 'bg-[#fce8e8] text-[#8b0000]',
    overlay: 'bg-[#fce8e8]/90 text-[#8b0000]',
  },
  honey: {
    solid: 'bg-[#fef3c7] text-[#78580a]',
    overlay: 'bg-[#fef3c7]/90 text-[#78580a]',
  },
  baked_goods: {
    solid: 'bg-[#ede0cd] text-[#5c3d11]',
    overlay: 'bg-[#ede0cd]/90 text-[#5c3d11]',
  },
} as const

function getCategoryColors(value?: string) {
  return (
    CATEGORY_COLORS[value as keyof typeof CATEGORY_COLORS] ?? {
      solid: 'bg-[#ffdcc3] text-[#5a2e00]',
      overlay: 'bg-[#ffdcc3]/90 text-[#5a2e00]',
    }
  )
}

export function ProductCard({ product, variant = 'small', showFavorite = true }: Props) {
  const image = product.photos?.[0]
  const isLarge = variant === 'large'
  const isSeasonal = variant === 'seasonal'
  const isMarket = variant === 'market'

  const farmId = typeof product.farm === 'object' ? product.farm.id : product.farm

  const farmSlug = typeof product.farm === 'object' ? product.farm.slug : ''

  const categoryName =
    typeof product.productCategory === 'object' ? product.productCategory.name : ''

  const categorySlug =
    typeof product.productCategory === 'object' ? product.productCategory.slug : ''

  function getProductAvailability(product: any) {
    if (product.status === 'out_of_season') return 'Out of Season'
    if (product.status === 'sold_out') return 'Sold Out'
    if (product.stock <= 0) return 'Sold Out'

    return 'Available'
  }

  const disabled = getProductAvailability(product) !== 'Available'

  if (isSeasonal) {
    return (
      <Link href={`/farms/${product.farm.slug}/products/${product.slug}`}>
        <div className="group relative h-64 overflow-hidden rounded-xl bg-[#e2e3dc] shadow-sm transition">
          {image?.url ? (
            <Image
              src={image.url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 420px"
            />
          ) : (
            <div className="h-full bg-[#e2e3dc]" />
          )}

          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-primary/85 to-transparent p-6">
            <span className="mb-2 w-fit rounded bg-[#ffdcc3] px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#5a2e00]">
              {categoryName || 'Seasonal'}
            </span>

            <h3 className="text-xl text-white">{product.name}</h3>

            <p className="text-sm font-semibold text-[#bcf0ae]">
              €{product.price.toFixed(2)} / {product.unit}
            </p>
          </div>
        </div>
      </Link>
    )
  }

  if (isMarket) {
    return (
      <div className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm transition">
        <div className="relative aspect-square overflow-hidden bg-[#e2e3dc]">
          <Link href={`/farms/${product.farm.slug}/products/${product.slug}`}>
            {image?.url ? (
              <Image
                src={image.url}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 360px"
              />
            ) : (
              <div className="h-full bg-[#e2e3dc]" />
            )}

            <div className="hidden md:flex absolute left-4 top-4 gap-2">
              {categoryName && (
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${getCategoryColors(categorySlug).solid}`}
                >
                  {categoryName}
                </span>
              )}

              {typeof product.farm === 'object' && product.farm.organic && (
                <span className="hidden md:block rounded-full bg-[#bcf0ae] px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                  Organic
                </span>
              )}
            </div>
          </Link>

          {showFavorite && (
            <FavoriteProductButton
              productId={product.id}
              productSlug={product.slug}
              farmSlug={farmSlug}
              initialFavorited={product.isFavorited}
              className="absolute right-3 top-3 z-20"
              variant="floating"
            />
          )}
        </div>

        <div className="flex flex-1 flex-col p-3">
          <h3 className="mb-0.5 text-sm lg:text-lg font-semibold text-primary truncate line-clamp-1">
            {product.name}
          </h3>

          <p className="mb-3 text-xs text-secondary">
            {typeof product.farm === 'object' ? product.farm.name : ''}
          </p>

          <div className="mt-auto flex items-center justify-between gap-2">
            <div>
              <p className="text-sm lg:text-lg font-bold text-primary">
                €{product.price.toFixed(2)}
              </p>

              <p className="text-xs lg:text-base text-secondary">per {product.unit}</p>
            </div>

            {disabled ? (
              <p className="rounded-lg bg-red-50 px-2 py-1.5 text-xs xl:text-sm font-semibold text-destructive text-center flex">
                {getProductAvailability(product)}
              </p>
            ) : (
              <AddToCartButton
                productId={product.id}
                farmId={farmId}
                disabled={disabled}
                className="rounded-lg bg-primary px-3 py-1.5 text-xs lg:text-sm font-semibold text-white disabled:opacity-50"
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!isLarge) {
    return (
      <div className="min-w-[190px] flex-shrink-0 snap-start group cursor-pointer">
        <div className="relative mb-2 h-40 overflow-hidden rounded-xl">
          <Link href={`/farms/${product.farm.slug}/products/${product.slug}`}>
            {image?.url ? (
              <Image
                src={image.url}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500"
                sizes="280px"
              />
            ) : (
              <div className="h-full bg-[#e2e3dc]" />
            )}
          </Link>

          {showFavorite && (
            <FavoriteProductButton
              productId={product.id}
              productSlug={product.slug}
              farmSlug={farmSlug}
              initialFavorited={product.isFavorited}
              className="absolute right-3 top-3 z-20"
              variant="floating"
            />
          )}
        </div>

        <div className="px-1">
          <p className="font-serif text-sm font-semibold text-primary">{product.name}</p>
          <p className="mb-2 text-xs text-secondary">
            {typeof product.farm === 'object' ? product.farm.name : ''}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-primary">
              €{product.price.toFixed(2)} / {product.unit}
            </span>
            <AddToCartButton
              productId={product.id}
              farmId={farmId}
              disabled={disabled}
              className="rounded-lg bg-primary p-1.5 text-white disabled:opacity-50"
            >
              <Plus size={16} />
            </AddToCartButton>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="relative h-56">
        <Link href={`/farms/${product.farm.slug}/products/${product.slug}`}>
          {image?.url ? (
            <Image src={image.url} alt={product.name} fill className="object-cover" sizes="300px" />
          ) : (
            <div className="h-full bg-[#e2e3dc]" />
          )}

          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {categoryName && (
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-sm ${getCategoryColors(categorySlug).overlay}`}
              >
                {categoryName}
              </span>
            )}

            <span className="rounded-full bg-[#bcf0ae]/90 px-2.5 py-1 text-xs font-semibold text-[#23501e]">
              {getProductAvailability(product)}
            </span>
          </div>
        </Link>
        {showFavorite && (
          <FavoriteProductButton
            productId={product.id}
            productSlug={product.slug}
            farmSlug={farmSlug}
            initialFavorited={product.isFavorited}
            className="absolute right-3 top-3 z-20"
            variant="floating"
          />
        )}
      </div>

      <div className="p-4">
        <p className="mb-1 truncate line-clamp-1 font-serif text-lg font-semibold text-primary md:text-xl">
          {product.name}
        </p>

        <p className="text-xs text-secondary">
          {typeof product.farm === 'object' ? product.farm.name : ''}
        </p>
        <div className="flex justify-between">
          <p className="mt-2 font-semibold text-primary">
            €{product.price.toFixed(2)} / {product.unit}
          </p>

          <AddToCartButton
            productId={product.id}
            farmId={farmId}
            disabled={disabled}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  )
}
