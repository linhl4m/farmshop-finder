import Link from 'next/link'
import Image from 'next/image'
import { FavoriteFarmButton } from '@/components/favorites/FavoriteFarmButton'
import { ChevronRight, MapPin } from 'lucide-react'

type Props = {
  farm: any
  showFavorite?: boolean
}

export function FarmCard({ farm, showFavorite = true }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm">
      <Link
        href={`/farms/${farm.slug}`}
        className="group block overflow-hidden rounded-2xl bg-white"
      >
        <div className="relative h-44 overflow-hidden">
          {farm.coverImage?.url ? (
            <Image
              src={farm.coverImage.url}
              alt={farm.name}
              fill
              sizes="(max-width: 1024px) 100vw, 560px"
              className="object-cover transition-transform duration-700"
              loading="eager"
            />
          ) : (
            <div className="h-full bg-[#e2e3dc]" />
          )}
          {farm.organic && (
            <span className="absolute left-4 top-4 rounded-full bg-[#bcf0ae]/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
              Organic
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="mb-1 flex items-start justify-between">
            <h3 className="text-base text-primary truncate line-clamp-1">{farm.name}</h3>
            <div className="items-center gap-1 text-primary hidden md:flex">
              <span className="text-base">★</span>
              <span className="text-sm font-semibold">{farm.ratingAverage.toFixed(1) ?? 0}</span>
            </div>
          </div>

          {farm.region && (
            <div className="mb-2 flex items-center gap-1 text-secondary">
              <MapPin className="h-3 w-3 md:h-4 md:w-4" />
              <span className="text-xs md:text-sm truncate line-clamp-1">{farm.region}</span>
            </div>
          )}

          {farm.description && (
            <p className="mb-2 line-clamp-1 text-xs md:line-clamp-2 md:text-sm text-secondary">
              {farm.description}
            </p>
          )}

          <div className="flex items-center justify-end">
            <span className="flex items-center gap-1 text-sm font-semibold text-primary transition-transform">
              Visit Farm
              <ChevronRight size={20} />
            </span>
          </div>
        </div>
      </Link>
      {showFavorite && (
        <FavoriteFarmButton
          farmId={farm.id}
          farmSlug={farm.slug}
          initialFavorited={farm.isFavorited}
          className="absolute right-4 top-4 z-20"
        />
      )}
    </div>
  )
}
