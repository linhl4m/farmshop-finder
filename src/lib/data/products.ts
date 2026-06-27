import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'
import { filterFarmsByRadius } from '@/lib/maps/filterFarmsByRadius'

type ProductFilters = {
  farmId?: string
  search?: string
  category?: string | string[]
  price?: string
  distance?: string
  lat?: string
  lng?: string
  organic?: boolean | string
}

export async function getProducts(filters: ProductFilters = {}) {
  const payload = await getPayload({ config })

  const where: any = {
    and: [],
  }

  if (filters.farmId) {
    where.and.push({
      farm: {
        equals: filters.farmId,
      },
    })
  }

  if (filters.search) {
    where.and.push({
      or: [
        {
          name: {
            like: filters.search,
          },
        },
        {
          description: {
            like: filters.search,
          },
        },
      ],
    })
  }

  if (filters.category) {
    const categorySlugs = Array.isArray(filters.category)
      ? filters.category
      : filters.category.split(',').filter(Boolean)

    const categoryDocs = await payload.find({
      collection: 'product-categories',
      where: {
        slug: {
          in: categorySlugs,
        },
      },
      limit: 100,
    })

    where.and.push({
      productCategory: {
        in: categoryDocs.docs.map((category) => category.id),
      },
    })
  }

  if (filters.price) {
    where.and.push({
      price: {
        less_than_equal: Number(filters.price),
      },
    })
  }

  if (filters.distance) {
    const farms = await payload.find({
      collection: 'farms',
      limit: 100,
    })

    const farmsInRadius = filterFarmsByRadius({
      farms: farms.docs,
      center: {
        lat: filters.lat ? Number(filters.lat) : 52.52,
        lng: filters.lng ? Number(filters.lng) : 13.405,
      },
      radiusKm: Number(filters.distance),
    })

    where.and.push({
      farm: {
        in: farmsInRadius.map((farm) => farm.id),
      },
    })
  }

  if (filters.organic === true || filters.organic === 'true') {
    const organicFarms = await payload.find({
      collection: 'farms',
      where: {
        organic: {
          equals: true,
        },
      },
      limit: 100,
    })

    where.and.push({
      farm: {
        in: organicFarms.docs.map((farm) => farm.id),
      },
    })
  }

  const products = await payload.find({
    collection: 'products',
    where: where.and.length > 0 ? where : undefined,
    depth: 2,
    limit: 100,
  })
  return products.docs
}

export async function getTrendingProducts() {
  const payload = await getPayload({ config })

  const products = await payload.find({
    collection: 'products',
    where: {
      and: [
        { status: { equals: 'in_season' } },
        { stock: { greater_than: 0 } },
      ],
    },
    sort: '-ratingAverage',
    depth: 2,
    limit: 7,
  })

  return products.docs
}
