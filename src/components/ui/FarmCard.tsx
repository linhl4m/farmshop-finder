import Link from 'next/link'
import Image from 'next/image'
import { FavoriteFarmButton } from '@/components/favorites/FavoriteFarmButton'
import { ChevronRight } from 'lucide-react'

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
        <div className="relative h-56 overflow-hidden">
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
        <div className="p-6">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="text-xl text-primary">{farm.name}</h3>
            <div className="flex items-center gap-1 text-primary">
              <span className="text-base">★</span>
              <span className="text-sm font-semibold">{farm.ratingAverage.toFixed(1) ?? 0}</span>
            </div>
          </div>

          {farm.region && (
            <div className="mb-4 flex items-center gap-1 text-secondary">
              <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <span className="text-sm">{farm.region}</span>
            </div>
          )}

          {farm.description && (
            <p className="mb-4 line-clamp-2 text-sm text-secondary">{farm.description}</p>
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
