'use client'

import { FarmMap } from '@/components/map/FarmMap'

type Props = {
  farms: any[]
}

export function MapPanel({ farms }: Props) {
  return (
    <aside className="w-full">
      <div className="sticky top-24 h-[550px] w-full overflow-hidden rounded-2xl border bg-white shadow">
        <FarmMap farms={farms} />
      </div>
    </aside>
  )
}
