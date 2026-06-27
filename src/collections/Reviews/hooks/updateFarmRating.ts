import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, PayloadRequest } from 'payload'

function getId(value: unknown): string | null {
  if (!value) return null
  if (typeof value === 'string') return value
  if (typeof value === 'object' && 'id' in value) return String((value as any).id)
  return null
}

async function recalculateRating(
  req: PayloadRequest,
  collection: 'farms' | 'products',
  id: string,
  whereField: 'farm' | 'product',
) {
  const reviews = await req.payload.find({
    collection: 'reviews',
    where: { [whereField]: { equals: id } },
    limit: 1000,
  })

  const count = reviews.docs.length
  const average =
    count === 0
      ? 0
      : reviews.docs.reduce((sum, review) => sum + Number(review.rating || 0), 0) / count

  await req.payload.update({
    collection,
    id,
    data: {
      ratingAverage: Math.round(average * 10) / 10,
      ratingCount: count,
    },
    overrideAccess: true,
  })
}

export const updateFarmRatingAfterChange: CollectionAfterChangeHook = async ({ doc, req }) => {
  const farmId = getId(doc.farm)
  if (farmId) await recalculateRating(req, 'farms', farmId, 'farm')

  const productId = getId(doc.product)
  if (productId) await recalculateRating(req, 'products', productId, 'product')

  return doc
}

export const updateFarmRatingAfterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  const farmId = getId(doc.farm)
  if (farmId) await recalculateRating(req, 'farms', farmId, 'farm')

  const productId = getId(doc.product)
  if (productId) await recalculateRating(req, 'products', productId, 'product')

  return doc
}
