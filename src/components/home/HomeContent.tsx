'use client'

import { useMemo, useState } from 'react'
import { FarmsFeed } from '@/components/home/FarmsFeed'
import { MapPanel } from '@/components/home/MapPanel'
import { TrendingProducts } from './TrendingProducts'
import { FilterSidebar } from '@/components/filters/FilterSidebar'
import { Map, SlidersHorizontal } from 'lucide-react'

type Props = {
  farms: any[]
  products: any[]
  categories: any[]
  lat?: string
  lng?: string
  distance?: string
  showFavorite?: boolean
}

export function HomeContent({
  farms,
  products,
  categories,
  lat,
  lng,
  distance,
  showFavorite,
}: Props) {
  const [mapOpen, setMapOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const mapCenter = useMemo(
    () => (lat && lng ? { lat: Number(lat), lng: Number(lng) } : undefined),
    [lat, lng],
  )

  return (
    <main className="container-page pb-24 lg:pb-12">
      <section className="mb-6">
        <TrendingProducts products={products} showFavorite={showFavorite} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[16rem_1fr] lg:gap-6">
        <aside>
          <FilterSidebar
            sidebar
            mapOpen={mapOpen}
            onToggleMap={() => setMapOpen(!mapOpen)}
            categories={categories}
            showGlobalFilters
            mobileOpen={filtersOpen}
            onMobileClose={() => setFiltersOpen(false)}
          />
        </aside>

        <div>
          {mapOpen ? (
            <MapPanel farms={farms} center={mapCenter} distance={distance} />
          ) : (
            <FarmsFeed farms={farms} showFavorite={showFavorite} />
          )}
        </div>
      </section>

      {/* Mobile Floating Buttons */}
      <div className="fixed bottom-10 left-6 right-6 z-40 flex justify-between lg:hidden">
        <button
          onClick={() => setFiltersOpen(true)}
          className="rounded-full bg-white px-4 py-3 font-semibold text-primary shadow-lg text-base flex items-center gap-1"
        >
          <SlidersHorizontal size={15} /> Filters
        </button>

        <button
          onClick={() => setMapOpen(!mapOpen)}
          className="flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-base font-semibold text-white shadow-lg transition active:scale-95"
        >
          <Map size={15} />
          {mapOpen ? 'Back to Farms' : 'View Nearby'}
        </button>
      </div>
    </main>
  )
}
