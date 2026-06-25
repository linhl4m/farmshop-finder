import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, PayloadRequest } from 'payload'

async function recalculateFarmRating(req: PayloadRequest, farmId: string) {
  const reviews = await req.payload.find({
    collection: 'reviews',
    where: {
      farm: {
        equals: farmId,
      },
    },
    limit: 1000,
  })

  const count = reviews.docs.length

  const average =
    count === 0
      ? 0
      : reviews.docs.reduce((sum, review) => {
          return sum + Number(review.rating || 0)
        }, 0) / count

  await req.payload.update({
    collection: 'farms',
    id: farmId,
    data: {
      ratingAverage: Math.round(average * 10) / 10,
      ratingCount: count,
    },
    overrideAccess: true,
  })
}

function getId(value: unknown): string | null {
  if (!value) return null

  if (typeof value === 'string') return value

  if (typeof value === 'object' && 'id' in value) {
    return String(value.id)
  }

  return null
}

export const updateFarmRatingAfterChange: CollectionAfterChangeHook = async ({ doc, req }) => {
  const farmId = getId(doc.farm)

  if (!farmId) return doc

  await recalculateFarmRating(req, farmId)

  return doc
}

export const updateFarmRatingAfterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  const farmId = getId(doc.farm)

  if (!farmId) return doc

  await recalculateFarmRating(req, farmId)

  return doc
}
