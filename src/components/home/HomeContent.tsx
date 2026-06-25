'use client'

import { useState } from 'react'
import { FarmsFeed } from '@/components/home/FarmsFeed'
import { MapPanel } from '@/components/home/MapPanel'
import { TrendingProducts } from './TrendingProducts'

export function HomeContent({ farms, products, categories }: any) {
  const [mapOpen, setMapOpen] = useState(false)

  return (
    <main className="container-page">
      <div className={mapOpen ? 'mt-6 flex h-[calc(100vh-180px)] gap-6 overflow-hidden' : 'mt-6'}>
        <div className={mapOpen ? 'min-w-0 basis-1/2 overflow-y-auto' : 'w-full'}>
          {!mapOpen && <TrendingProducts products={products} />}
          <FarmsFeed
            farms={farms}
            products={products}
            categories={categories}
            mapOpen={mapOpen}
            onToggleMap={() => setMapOpen(!mapOpen)}
          />
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
