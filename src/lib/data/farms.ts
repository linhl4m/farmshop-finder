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

export async function getFarmBySlug(slug: string) {
  const payload = await getPayload({ config })

  const farms = await payload.find({
    collection: 'farms',
    depth: 1,
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return farms.docs[0] ?? null
}
