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
