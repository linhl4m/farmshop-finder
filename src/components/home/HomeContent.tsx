'use client'

import { useState } from 'react'
import { FarmsFeed } from '@/components/home/FarmsFeed'
import { MapPanel } from '@/components/home/MapPanel'
import { FilterBar } from '@/components/filters/FilterBar'

export function HomeContent({ farms, products, categories }: any) {
  const [mapOpen, setMapOpen] = useState(false)

  return (
    <main className="container-page">
      <FilterBar
        mapOpen={mapOpen}
        onToggleMap={() => setMapOpen(!mapOpen)}
        categories={categories}
      />

      <div className={mapOpen ? 'mt-6 flex h-[calc(100vh-180px)] gap-6 overflow-hidden' : 'mt-6'}>
        <div className={mapOpen ? 'min-w-0 basis-1/2 overflow-y-auto' : 'w-full'}>
          <FarmsFeed farms={farms} products={products} categories={categories} mapOpen={mapOpen} />
        </div>

        {mapOpen && (
          <div className="min-w-0 basis-1/2">
            <MapPanel farms={farms} />
          </div>
        )}
      </div>
    </main>
  )
}
