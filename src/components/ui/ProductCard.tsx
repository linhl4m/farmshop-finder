import Image from 'next/image'

type Props = {
  product: any
  variant?: 'small'
}

export function ProductCard({ product }: Props) {
  const image = product.photos?.[0]

  return (
    <div className="w-45 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <div className="relative h-32">
        {image?.url ? (
          <Image
            src={image.url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 160px, 160px"
            className="object-cover"
            loading="eager"
          />
        ) : (
          <div className="h-full bg-[#e2e3dc]" />
        )}
      </div>

      <div className="p-3">
        <p className="truncate text-sm font-semibold">{product.name}</p>
        <p className="text-xs">
          {typeof product.farm === 'object' ? product.farm.name : product.category}
        </p>
        <p className="mt-1 font-bold text-sm">
          €{product.price} / {product.unit}
        </p>
      </div>
    </div>
  )
}
