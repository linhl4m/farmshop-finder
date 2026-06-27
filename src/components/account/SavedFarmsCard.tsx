import Link from 'next/link'
import { Heart } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { getFavoriteFarms } from '@/lib/data/favorites'
import Image from 'next/image'

export async function SavedFarmsCard() {
  const user = await getCurrentUser()

  if (!user || user.role !== 'customer') {
    return null
  }

  const farms = await getFavoriteFarms(user.id, user)

  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-xl font-semibold">Saved Farms</h2>

        <Link
          href="/account/saved"
          className="text-xs font-medium text-primary hover:underline md:text-sm"
        >
          View all
        </Link>
      </div>

      {farms.length > 0 ? (
        <div className="space-y-3">
          {farms.slice(0, 2).map((farm: any) => (
            <Link
              key={farm.id}
              href={`/farms/${farm.slug}`}
              className="flex items-center gap-3 rounded-xl border p-3 transition hover:bg-muted/30"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                {farm.coverImage?.url && (
                  <Image
                    src={farm.coverImage.url}
                    alt={farm.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="truncate text-xs font-medium md:text-base">{farm.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {farm.region ?? 'Local farm'}
                </p>
              </div>

              <Heart className="shrink-0 fill-primary text-primary" size={18} />
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">You haven't saved any farms yet.</p>
      )}
    </section>
  )
}
