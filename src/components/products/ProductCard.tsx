import Image from 'next/image'
import Link from 'next/link'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { Plus } from 'lucide-react'

type Props = {
  product: any
  variant?: 'small' | 'large' | 'seasonal' | 'market'
}

export function ProductCard({ product, variant = 'small' }: Props) {
  const image = product.photos?.[0]
  const isLarge = variant === 'large'
  const isSeasonal = variant === 'seasonal'
  const isMarket = variant === 'market'

  const farmId = typeof product.farm === 'object' ? product.farm.id : product.farm

  const categoryName =
    typeof product.productCategory === 'object' ? product.productCategory.name : ''

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

            <h3 className="font-serif text-xl font-semibold text-white">{product.name}</h3>

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
        <Link href={`/farms/${product.farm.slug}/products/${product.slug}`}>
          <div className="relative aspect-square overflow-hidden bg-[#e2e3dc]">
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

            <div className="absolute left-4 top-4 flex gap-2">
              {categoryName && (
                <span className="rounded-full bg-[#ffdcc3] px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                  {categoryName}
                </span>
              )}

              {typeof product.farm === 'object' && product.farm.organic && (
                <span className="rounded-full bg-[#bcf0ae] px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                  Organic
                </span>
              )}
            </div>
          </div>
        </Link>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="mb-1 font-serif text-xl font-semibold text-primary">{product.name}</h3>

          <p className="mb-4 text-sm text-secondary">
            {typeof product.farm === 'object' ? product.farm.name : ''}
          </p>

          <div className="mt-auto flex items-center justify-between gap-4">
            <div>
              <p className="text-2xl font-bold text-primary">€{product.price.toFixed(2)}</p>

              <p className="text-xs text-secondary">per {product.unit}</p>
            </div>

            {disabled ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-destructive">
                {getProductAvailability(product)}
              </p>
            ) : (
              <AddToCartButton
                productId={product.id}
                farmId={farmId}
                disabled={disabled}
                className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-white disabled:opacity-50"
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!isLarge) {
    return (
      <div className="min-w-[260px] flex-shrink-0 snap-start group cursor-pointer">
        <Link href={`/farms/${product.farm.slug}/products/${product.slug}`}>
          <div className="relative mb-3 h-56 overflow-hidden rounded-xl">
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
          </div>
        </Link>

        <div className="px-1">
          <p className="font-serif text-lg font-semibold text-primary">{product.name}</p>
          <p className="mb-3 text-sm text-secondary">
            {typeof product.farm === 'object' ? product.farm.name : ''}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-primary">
              €{product.price.toFixed(2)} / {product.unit}
            </span>
            <AddToCartButton
              productId={product.id}
              farmId={farmId}
              disabled={disabled}
              className="rounded-lg bg-primary p-2 text-white disabled:opacity-50"
            >
              <Plus size={20} />
            </AddToCartButton>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      <Link href={`/farms/${product.farm.slug}/products/${product.slug}`}>
        <div className="relative h-56">
          {image?.url ? (
            <Image src={image.url} alt={product.name} fill className="object-cover" sizes="300px" />
          ) : (
            <div className="h-full bg-[#e2e3dc]" />
          )}

          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {categoryName && (
              <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
                {categoryName}
              </span>
            )}

            <span className="rounded-full bg-[#bcf0ae]/90 px-2.5 py-1 text-xs font-semibold text-[#23501e]">
              {getProductAvailability(product)}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <p className="mb-1 font-serif text-lg font-semibold text-primary">{product.name}</p>

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
