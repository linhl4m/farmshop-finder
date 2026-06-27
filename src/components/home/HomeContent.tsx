'use client'

import { useState } from 'react'
import { FarmsFeed } from '@/components/home/FarmsFeed'
import { MapPanel } from '@/components/home/MapPanel'
import { TrendingProducts } from './TrendingProducts'
import { FilterSidebar } from '@/components/filters/FilterSidebar'
import { Map, SlidersHorizontal } from 'lucide-react'

export function HomeContent({ farms, products, categories }: any) {
  const [mapOpen, setMapOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)

  return (
    <main className="container-page">
      <TrendingProducts products={products} />

      <section className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12">
        {/* Desktop Sidebar */}
        <aside className="lg:col-span-3">
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

        <div className="lg:col-span-9">
          {mapOpen ? <MapPanel farms={farms} /> : <FarmsFeed farms={farms} />}
        </div>
      </section>

      {/* Floating Buttons */}
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
