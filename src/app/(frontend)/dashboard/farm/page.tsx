import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { getFarmByOwnerId } from '@/lib/data/farms'
import { EditFarmForm } from '@/components/dashboard/EditFarmForm'

export default async function EditFarmPage() {
  const user = await requireUser()

  if (user.role !== 'farm') {
    redirect('/account')
  }

  const farm = await getFarmByOwnerId(user.id)

  if (!farm) {
    redirect('/dashboard')
  }

  return (
    <main className="flex min-h-screen bg-background">
      <div className="flex-1">
        <section className="max-w-4xl px-6 py-8 md:px-12">
          <div>
            <h1 className="text-primary md:text-4xl">Edit Farm Page</h1>
            <p className="mt-2 text-muted-foreground">
              Update how your farm appears in the marketplace.
            </p>
          </div>

          <EditFarmForm farm={farm} />
        </section>
      </div>
    </main>
  )
}
