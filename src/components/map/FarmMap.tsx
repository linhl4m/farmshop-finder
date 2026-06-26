'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import { useRouter } from 'next/navigation'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

type Props = {
  farms: any[]
}

export function FarmMap({ farms }: Props) {
  const router = useRouter()
  const mapContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [13.405, 52.52],
      zoom: 8,
    })

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
    }
  }, [farms, router])

  return <div ref={mapContainer} className="h-full w-full" />
}
