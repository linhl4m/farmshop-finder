import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function getFarmBySlug(slug: string) {
  const payload = await getPayload({ config })

  const farms = await payload.find({
    collection: 'farms',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 2,
  })

  return farms.docs[0] ?? null
}

export async function getAvailableProductsByFarmId(farmId: string) {
  const payload = await getPayload({ config })

  const products = await payload.find({
    collection: 'products',
    where: {
      and: [
        {
          farm: {
            equals: farmId,
          },
        },
        {
          stock: {
            greater_than: 0,
          },
        },
        {
          status: {
            equals: 'in_season',
          },
        },
      ],
    },
    limit: 12,
    depth: 2,
  })

  return products.docs
}

export async function getSeasonalProductsByFarmId(farmId: string) {
  const payload = await getPayload({ config })

  const products = await payload.find({
    collection: 'products',
    where: {
      and: [
        {
          farm: {
            equals: farmId,
          },
        },
        {
          status: {
            equals: 'in_season',
          },
        },
      ],
    },
    limit: 12,
    depth: 2,
  })

  return products.docs
}

export async function getReviewsByFarmId(farmId: string) {
  const payload = await getPayload({ config })

  const reviews = await payload.find({
    collection: 'reviews',
    where: {
      farm: {
        equals: farmId,
      },
    },
    limit: 4,
    depth: 2,
  })

  return reviews.docs
}

export async function getProductCategoriesByFarmId(farmId: string) {
  const payload = await getPayload({ config })

  const products = await payload.find({
    collection: 'products',
    where: {
      farm: {
        equals: farmId,
      },
    },
    limit: 100,
    depth: 2,
  })

  const categories = products.docs.map((product: any) => product.productCategory).filter(Boolean)

  const uniqueCategories = Array.from(
    new Map(
      categories.map((category: any) => [
        typeof category === 'string' ? category : category.id,
        category,
      ]),
    ).values(),
  )

  return uniqueCategories
}
