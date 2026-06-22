import { getDistanceKm } from './distance'

type FarmWithLocation = {
  location?: {
    latitude?: number | null
    longitude?: number | null
  }
}

export function filterFarmsByRadius({
  farms,
  center,
  radiusKm,
}: {
  farms: any[]
  center: { lat: number; lng: number }
  radiusKm: number
}) {
  return farms.filter((farm) => {
    const lat = farm.location?.latitude
    const lng = farm.location?.longitude

    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return false
    }

    const distance = getDistanceKm(center, {
      lat,
      lng,
    })

    return distance <= radiusKm
  })
}
