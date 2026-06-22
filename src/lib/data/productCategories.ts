import { getPayload } from 'payload'
import config from '@payload-config'

export async function getProductCategories() {
  const payload = await getPayload({
    config,
  })

  const categories = await payload.find({
    collection: 'product-categories',
    sort: 'name',
  })

  return categories.docs
}
