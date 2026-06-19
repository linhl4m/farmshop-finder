import Link from 'next/link'
import { getFarms } from '@/lib/data/farms'

export default async function HomePage() {
  const farms = await getFarms()

  return (
    <main>
      <h1>Find local farms near you</h1>

      <div>
        {farms.map((farm) => (
          <Link key={farm.id} href={`/farms/${farm.slug}`}>
            <h2>{farm.name}</h2>
            <p>{farm.region}</p>
            <p>
              ⭐ {farm.ratingAverage ?? 0} ({farm.ratingCount ?? 0})
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}
