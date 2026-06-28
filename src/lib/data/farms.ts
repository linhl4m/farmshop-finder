import 'server-only'

import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

type FarmFilters = {
  search?: string
}

const completenessConditions = [
  { name: { exists: true } },
  { name: { not_equals: '' } },
  { description: { exists: true } },
  { description: { not_equals: '' } },
  { type: { exists: true } },
  { type: { not_equals: '' } },
  { region: { exists: true } },
  { region: { not_equals: '' } },
  { 'location.address': { exists: true } },
  { 'location.address': { not_equals: '' } },
  { 'location.city': { exists: true } },
  { 'location.city': { not_equals: '' } },
  { coverImage: { exists: true } },
] as const

export async function getFarms(filters: FarmFilters = {}) {
  const payload = await getPayload({ config })

  const searchCondition = filters.search
    ? [
        {
          or: [
            { name: { like: filters.search } },
            { description: { like: filters.search } },
          ],
        },
      ]
    : []

  const where = {
    and: [...completenessConditions, ...searchCondition],
  } as any

  const farms = await payload.find({
    collection: 'farms',
    where,
    depth: 2,
  })

  return farms.docs
}

export const getFarmByOwnerId = cache(async function getFarmByOwnerId(ownerId: string) {
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
})
