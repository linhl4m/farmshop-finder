'use client'

import { useState } from 'react'
import { FarmsFeed } from '@/components/home/FarmsFeed'
import { MapPanel } from '@/components/home/MapPanel'
import { TrendingProducts } from './TrendingProducts'
import { FilterSidebar } from '@/components/filters/FilterSidebar'
import { Map } from 'lucide-react'

export function HomeContent({ farms, products, categories }: any) {
  const [mapOpen, setMapOpen] = useState(false)

  return (
    <main className="container-page">
      <TrendingProducts products={products} />

      <section className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <FilterSidebar
            sidebar
            mapOpen={mapOpen}
            onToggleMap={() => setMapOpen(!mapOpen)}
            categories={categories}
            showGlobalFilters={true}
          />
        </aside>

        <div className="lg:col-span-9">
          {mapOpen ? <MapPanel farms={farms} /> : <FarmsFeed farms={farms} />}
        </div>
      </section>

      <button
        onClick={() => setMapOpen(!mapOpen)}
        className="fixed bottom-24 right-6 z-40 flex items-center gap-2 rounded-full bg-primary px-6 py-4 font-semibold text-white shadow-lg transition active:scale-95 md:bottom-10 md:right-10 lg:hidden"
      >
        <Map className="h-5 w-5" />
        {mapOpen ? 'Back to Farms' : 'View Nearby'}
      </button>
    </main>
  )
}
