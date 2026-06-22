import Image from 'next/image'

type Props = {
  product: any
  variant?: 'small' | 'large' | 'seasonal' | 'market'
}

export function ProductCard({ product, variant = 'small' }: Props) {
  const image = product.photos?.[0]
  const isLarge = variant === 'large'
  const isSeasonal = variant === 'seasonal'
  const isMarket = variant === 'market'

  const categoryName =
    typeof product.productCategory === 'object' ? product.productCategory.name : ''

  function getProductAvailability(product: any) {
    if (product.stock > 0) return 'Available'
    return product.status
  }

  if (isSeasonal) {
    return (
      <div className="group relative h-64 overflow-hidden rounded-xl bg-[#e2e3dc] shadow-sm transition hover:shadow-md">
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
    )
  }

  if (isMarket) {
    return (
      <div className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md">
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
              <span className="rounded-full bg-[#bcf0ae]/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
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

        <div className="flex flex-1 flex-col p-4">
          <h3 className="mb-1 font-serif text-xl font-semibold text-primary">{product.name}</h3>

          <p className="mb-4 text-sm text-secondary">
            {typeof product.farm === 'object' ? product.farm.name : ''}
          </p>

          <div className="mt-auto flex items-end justify-between gap-4">
            <div>
              <p className="text-2xl font-bold text-primary">€{product.price.toFixed(2)}</p>

              <p className="text-xs text-secondary">per {product.unit}</p>
            </div>

            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={
        isLarge
          ? 'overflow-hidden rounded-xl bg-white shadow-sm'
          : 'w-45 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-white shadow-sm'
      }
    >
      <div className={isLarge ? 'relative h-56' : 'relative h-32'}>
        {image?.url ? (
          <Image
            src={image.url}
            alt={product.name}
            fill
            className="object-cover"
            sizes={isLarge ? '300px' : '160px'}
          />
        ) : (
          <div className="h-full bg-[#e2e3dc]" />
        )}

        {isLarge && (
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
        )}
      </div>

      <div className={isLarge ? 'p-4' : 'p-3'}>
        <p
          className={
            isLarge
              ? 'mb-1 font-serif text-lg font-semibold text-primary'
              : 'truncate text-sm font-semibold'
          }
        >
          {product.name}
        </p>

        <p className="text-xs text-secondary">
          {typeof product.farm === 'object' ? product.farm.name : ''}
        </p>

        <p className={isLarge ? 'mt-2 font-semibold text-primary' : 'mt-1 text-sm font-bold'}>
          €{product.price.toFixed(2)} / {product.unit}
        </p>

        {isLarge && (
          <button className="mt-4 w-full rounded-lg bg-primary py-2 text-sm font-semibold text-white">
            Add to Cart
          </button>
        )}
      </div>
    </div>
  )
}
