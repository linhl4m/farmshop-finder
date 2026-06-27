import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'

export async function getFavoriteFarms(customerId: string, user: any) {
  const payload = await getPayload({ config })

  const favorites = await payload.find({
    collection: 'favorites',
    where: {
      and: [{ customer: { equals: customerId } }, { farm: { exists: true } }],
    },
    depth: 2,
    limit: 100,
    overrideAccess: false,
    user,
  })

  return favorites.docs
    .map((favorite: any) => favorite.farm)
    .filter(Boolean)
    .map((farm: any) => ({
      ...farm,
      isFavorited: true,
    }))
}

export async function getFavoriteFarmIds(customerId: string) {
  const payload = await getPayload({ config })

  const favorites = await payload.find({
    collection: 'favorites',
    where: {
      and: [{ customer: { equals: customerId } }, { farm: { exists: true } }],
    },
    depth: 0,
    limit: 1000,
  })

  return favorites.docs.map((favorite: any) => favorite.farm).filter(Boolean)
}

export async function getIsFarmFavorited(customerId: string, farmId: string): Promise<boolean> {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'favorites',
    where: {
      and: [{ customer: { equals: customerId } }, { farm: { equals: farmId } }],
    },
    limit: 1,
    depth: 0,
  })

  return result.totalDocs > 0
}

export async function getFavoriteProducts(customerId: string, user: any) {
  const payload = await getPayload({ config })

  const favorites = await payload.find({
    collection: 'favorites',
    where: {
      and: [{ customer: { equals: customerId } }, { product: { exists: true } }],
    },
    depth: 2,
    limit: 100,
    overrideAccess: false,
    user,
  })

  return favorites.docs
    .map((favorite: any) => favorite.product)
    .filter(Boolean)
    .map((product: any) => ({
      ...product,
      isFavorited: true,
    }))
}

export async function getFavoriteProductIds(customerId: string) {
  const payload = await getPayload({ config })

  const favorites = await payload.find({
    collection: 'favorites',
    where: {
      and: [{ customer: { equals: customerId } }, { product: { exists: true } }],
    },
    depth: 0,
    limit: 1000,
  })

  return favorites.docs.map((favorite: any) => favorite.product).filter(Boolean)
}

export async function getIsProductFavorited(
  customerId: string,
  productId: string,
): Promise<boolean> {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'favorites',
    where: {
      and: [{ customer: { equals: customerId } }, { product: { equals: productId } }],
    },
    limit: 1,
    depth: 0,
  })

  return result.totalDocs > 0
}
