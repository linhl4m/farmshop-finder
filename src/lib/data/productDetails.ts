import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function getProductBySlugAndFarmId(productSlug: string, farmId: string) {
  const payload = await getPayload({ config })

  const products = await payload.find({
    collection: 'products',
    where: {
      and: [
        {
          slug: {
            equals: productSlug,
          },
        },
        {
          farm: {
            equals: farmId,
          },
        },
      ],
    },
    limit: 1,
    depth: 2,
  })

  return products.docs[0] ?? null
}

export async function getReviewsByProductId(productId: string) {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'reviews',
    where: {
      product: {
        equals: productId,
      },
    },
    depth: 1,
    sort: '-createdAt',
    pagination: false,
  })

  return { docs: result.docs, totalDocs: result.totalDocs }
}
