import { FarmCard } from '@/components/ui/FarmCard'
import Link from 'next/link'
import { ArrowRight, Leaf, MapPin } from 'lucide-react'
import { FilterBar } from '@/components/filters/FilterBar'

type Props = {
  farms: any[]
  mapOpen?: boolean
  categories: string[]
  onToggleMap: () => void
}

export function FarmsFeed({ farms, mapOpen, categories, onToggleMap }: Props) {
  return (
    <div className="flex flex-col gap-12">
      <section>
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
              <MapPin className="h-4 w-4" />
              Discover nearby
            </div>

            <h2 className="font-serif text-3xl font-semibold text-primary">Discover Farms</h2>

            <p className="mt-1 text-sm text-secondary">
              Meet local growers, browse their products, and order directly.
            </p>
          </div>
        </div>
        <div className="pb-4">
          <FilterBar mapOpen={Boolean(mapOpen)} onToggleMap={onToggleMap} categories={categories} />
        </div>

        {farms.length > 0 ? (
          <div
            className={
              mapOpen ? 'grid gap-6 md:grid-cols-2' : 'grid gap-6 md:grid-cols-2 xl:grid-cols-3'
            }
          >
            {farms.map((farm) => (
              <FarmCard key={farm.id} farm={farm} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#c2c9bb] bg-[#f3f4ed] p-12 text-center">
            <h3 className="mb-2 font-serif text-2xl font-semibold text-primary">No farms found</h3>

            <p className="text-sm text-secondary">Try changing your filters or search area.</p>
          </div>
        )}
      </section>
    </div>
  )
}
