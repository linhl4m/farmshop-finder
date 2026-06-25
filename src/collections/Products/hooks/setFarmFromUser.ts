import type { CollectionBeforeValidateHook } from 'payload'

export const setFarmFromUser: CollectionBeforeValidateHook = async ({ data, req, operation }) => {
  if (operation !== 'create') return data
  if (!req.user || req.user.role !== 'farm') return data

  const farms = await req.payload.find({
    collection: 'farms',
    where: { owner: { equals: req.user.id } },
    limit: 1,
  })

  const farm = farms.docs[0]

  if (farm) {
    return { ...data, farm: farm.id }
  }

  return data
}
