'use client'

import { FarmMap } from '@/components/map/FarmMap'

type Props = {
  farms: any[]
  center?: { lat: number; lng: number }
  distance?: string
}

export function MapPanel({ farms, center, distance }: Props) {
  return (
    <aside className="w-full">
      <div className="sticky top-24 h-[550px] w-full overflow-hidden rounded-2xl border bg-white shadow">
        <FarmMap farms={farms} center={center} distance={distance} />
      </div>
    </aside>
  )
}
