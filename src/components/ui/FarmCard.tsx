import Link from 'next/link'
import Image from 'next/image'

type Props = {
  farm: any
}

export function FarmCard({ farm }: Props) {
  return (
    <Link
      href={`/farms/${farm.slug}`}
      className="block overflow-hidden rounded-xl border border-[#c2c9bb]/20 bg-white shadow-sm transition"
    >
      <div className="h-56 relative">
        {farm.photos?.[0]?.url ? (
          <Image
            src={farm.photos[0].url}
            alt={farm.name}
            fill
            sizes="(max-width: 1024px) 100vw, 560px"
            className="object-cover"
            loading="eager"
          />
        ) : (
          <div className="h-full bg-[#e2e3dc]" />
        )}
      </div>

      <div className="p-6">
        <div className="flex justify-between">
          <div>
            <h3 className="font-serif text-2xl font-semibold text-[#154212]">{farm.name}</h3>

            <p className="mt-2 text-[#42493e]">{farm.description}</p>

            <p className="mt-3 text-sm text-[#42493e]">{farm.region}</p>
          </div>

          <div className="rounded-lg bg-[#bcf0ae]/30 px-3 py-1">⭐ {farm.ratingAverage ?? 0}</div>
        </div>
      </div>
    </Link>
  )
}
