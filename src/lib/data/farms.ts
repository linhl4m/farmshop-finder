import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'

type FarmFilters = {
  search?: string
}

export async function getFarms(filters: FarmFilters = {}) {
  const payload = await getPayload({ config })

  const where = filters.search
    ? {
        or: [
          { name: { like: filters.search } },
          { description: { like: filters.search } },
        ],
      }
    : undefined

  const farms = await payload.find({
    collection: 'farms',
    where,
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
