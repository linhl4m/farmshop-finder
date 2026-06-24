import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'

export async function getFarms() {
  const payload = await getPayload({ config })

  const farms = await payload.find({
    collection: 'farms',
    depth: 2,
  })

  return farms.docs
}

export async function getFarmByOwnerId(ownerId: string) {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'farms',
    where: {
      owner: {
        equals: ownerId,
      },
    },
    limit: 1,
  })

  return result.docs[0] ?? null
}
