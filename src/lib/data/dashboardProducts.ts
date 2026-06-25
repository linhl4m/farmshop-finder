import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'

export async function getProductsByFarmId(farmId: string) {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'products',
    where: {
      farm: {
        equals: farmId,
      },
    },
    depth: 2,
    sort: '-createdAt',
  })

  return result.docs
}

export async function getProductById(productId: string) {
  const payload = await getPayload({ config })

  return payload.findByID({
    collection: 'products',
    id: productId,
    depth: 2,
  })
}
