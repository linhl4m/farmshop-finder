'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

type Props = {
  farms: any[]
}

export function FarmMap({ farms }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [13.405, 52.52], // Berlin
      zoom: 8,
    })

    farms.forEach((farm) => {
      const lat = farm.location?.latitude
      const lng = farm.location?.longitude

      if (typeof lat !== 'number' || typeof lng !== 'number') return

      new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup().setText(farm.name))
        .addTo(map)
    })

    return () => {
      map.remove()
    }
  }, [farms])

  return <div ref={mapContainer} className="h-full w-full" />
}
