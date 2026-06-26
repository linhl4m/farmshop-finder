import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentUser } from '@/lib/auth'
import { FarmCard } from '@/components/ui/FarmCard'

export default async function SavedFarmsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  if (user.role !== 'customer') {
    redirect('/account')
  }

  const payload = await getPayload({ config })

  const favorites = await payload.find({
    collection: 'favorites',
    where: {
      customer: {
        equals: user.id,
      },
    },
    depth: 2,
    limit: 100,
    overrideAccess: false,
    user,
  })

  const farms = favorites.docs
    .map((favorite: any) => favorite.farm)
    .filter(Boolean)
    .map((farm: any) => ({
      ...farm,
      isFavorited: true,
    }))

  return (
    <main className="container-page py-10">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-primary">Saved Farms</h1>
        <p className="mt-2 text-secondary">Your favorite farms in one place.</p>
      </div>

      {farms.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {farms.map((farm: any) => (
            <FarmCard key={farm.id} farm={farm} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#c2c9bb]/30 bg-[#f3f4ed] p-10 text-center">
          <h2 className="font-serif text-2xl font-semibold text-primary">No saved farms yet</h2>
          <p className="mt-2 text-secondary">Save farms by clicking the heart icon.</p>
        </div>
      )}
    </main>
  )
}
