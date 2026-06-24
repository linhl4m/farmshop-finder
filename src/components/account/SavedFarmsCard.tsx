import Link from 'next/link'
import { Heart } from 'lucide-react'

export function SavedFarmsCard() {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Saved Farms</h2>
        <Link href="/farms" className="text-sm font-medium text-primary hover:underline">
          Explore
        </Link>
      </div>

      <div className="space-y-3">
        {['Oak Creek Orchards', 'Honey Hill Apiary'].map((farm) => (
          <div key={farm} className="flex items-center gap-3 rounded-xl border p-3">
            <div className="h-14 w-14 rounded-lg bg-muted" />
            <div className="flex-1">
              <p className="font-medium">{farm}</p>
              <p className="text-xs text-muted-foreground">Local seasonal produce</p>
            </div>
            <Heart className="fill-primary text-primary" size={18} />
          </div>
        ))}
      </div>
    </section>
  )
}
