'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import { useRouter } from 'next/navigation'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

const DISTANCE_ZOOM: Record<string, number> = {
  '5': 12,
  '10': 11,
  '25': 10,
  '50': 9,
}

type Props = {
  farms: any[]
  center?: { lat: number; lng: number }
  distance?: string
}

export function FarmMap({ farms, center, distance }: Props) {
  const router = useRouter()
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }

    const zoom = distance && DISTANCE_ZOOM[distance] ? DISTANCE_ZOOM[distance] : center ? 11 : 8

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center ? [center.lng, center.lat] : [13.405, 52.52],
      zoom,
    })
    mapRef.current = map

    if (center) {
      const el = document.createElement('div')
      el.style.cssText =
        'width:16px;height:16px;border-radius:50%;background:#4285f4;border:3px solid white;box-shadow:0 0 0 2px #4285f4;'
      new mapboxgl.Marker({ element: el }).setLngLat([center.lng, center.lat]).addTo(map)
    }

    farms.forEach((farm) => {
      const lat = farm.location?.latitude
      const lng = farm.location?.longitude

      if (typeof lat !== 'number' || typeof lng !== 'number') return

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 24,
        className: 'farm-popup',
      }).setHTML(`
  <a
    href="/farms/${farm.slug}"
    style="display:block;width:240px;text-decoration:none;color:inherit;overflow:hidden;border-radius:12px;background:white;"
  >
    ${
      farm.coverImage?.url
        ? `<img
            src="${farm.coverImage.url}"
            style="display:block;width:100%;height:130px;object-fit:cover;"
          />`
        : `<div style="width:100%;height:130px;background:#e2e3dc;"></div>`
    }

    <div style="padding:12px;background:white;">
      <h3 style="margin:0;font-size:15px;font-weight:600;color:#154212;">
        ${farm.name}
      </h3>

      <p style="margin:4px 0 0;color:#666;font-size:13px;">
        ${farm.region ?? ''}
      </p>

      <p style="margin:8px 0 0;font-size:13px;color:#5a2e00;">
        ⭐ ${farm.ratingAverage ?? 0} (${farm.ratingCount ?? 0})
      </p>
    </div>
  </a>
`)

      const marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map)

      const element = marker.getElement()

      element.style.cursor = 'pointer'

      element.addEventListener('click', () => {
        router.push(`/farms/${farm.slug}`)
      })

      element.addEventListener('mouseenter', () => {
        popup.setLngLat([lng, lat]).addTo(map)
      })

      element.addEventListener('mouseleave', () => {
        popup.remove()
      })
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [farms, router, center, distance])

  return <div ref={mapContainer} className="h-full w-full" />
}
