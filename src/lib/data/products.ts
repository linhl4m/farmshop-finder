import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'

export async function getProducts() {
  const payload = await getPayload({ config })

  const products = await payload.find({
    collection: 'products',
    depth: 1,
    sort: '-createdAt',
  })

  return products.docs
}

export async function getProductsByFarm(farmId: string) {
  const payload = await getPayload({ config })

  const products = await payload.find({
    collection: 'products',
    depth: 1,
    where: {
      farm: {
        equals: farmId,
      },
    },
  })

  return products.docs
}

export async function getProductBySlug(slug: string) {
  const payload = await getPayload({ config })

  const products = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return products.docs[0] ?? null
}
