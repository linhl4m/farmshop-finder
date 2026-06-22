import { getPayload } from 'payload'
import config from '@payload-config'
import { filterFarmsByRadius } from '@/lib/maps/filterFarmsByRadius'

type ProductFilters = {
  category?: string | string[]
  price?: string
  availability?: string
  distance?: string
  lat?: string
  lng?: string
}

export async function getProducts(filters: ProductFilters = {}) {
  const payload = await getPayload({ config })

  const where: any = {
    and: [],
  }

  if (filters.category) {
    const categorySlugs = Array.isArray(filters.category) ? filters.category : [filters.category]

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

  if (filters.availability) {
    where.and.push({
      status: {
        equals: filters.availability,
      },
    })
  }

  if (filters.availability) {
    where.and.push({
      status: {
        equals: filters.availability,
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
        lat: 52.52,
        lng: 13.405,
      },
      radiusKm: Number(filters.distance),
    })

    where.and.push({
      farm: {
        in: farmsInRadius.map((farm) => farm.id),
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
