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
        {farm.coverImage?.url ? (
          <Image
            src={farm.coverImage?.url}
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
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-serif text-2xl font-semibold ">{farm.name}</h3>

            <p className="mt-2 text-secondary">{farm.description}</p>

            <p className="mt-3 text-sm text-secondary">{farm.region}</p>
          </div>

          <div className="flex flex-col items-center rounded-lg bg-[#bcf0ae]/30 px-3 py-1">
            <span>⭐</span> <span>{farm.ratingAverage ?? 0}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
