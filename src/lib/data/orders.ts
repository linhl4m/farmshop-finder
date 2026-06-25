import 'server-only'

import { getPayload } from 'payload'
import config from '@payload-config'

export async function getOrdersByCustomer(customerId: string) {
  const payload = await getPayload({ config })

  const orders = await payload.find({
    collection: 'orders',
    depth: 1,
    where: {
      customer: {
        equals: customerId,
      },
    },
    sort: '-createdAt',
  })

  return orders.docs
}

export async function getOrdersByFarm(farmId: string) {
  const payload = await getPayload({ config })

  const orders = await payload.find({
    collection: 'orders',
    depth: 1,
    where: {
      farm: {
        equals: farmId,
      },
    },
    sort: '-createdAt',
  })

  return orders.docs
}

export async function getRecentOrders(farmId: string) {
  const payload = await getPayload({ config })

  const recentOrders = await payload.find({
    collection: 'orders',
    where: {
      farm: {
        equals: farmId,
      },
    },
    sort: '-createdAt',
    limit: 5,
    depth: 2,
  })

  return recentOrders.docs
}

export async function customerHasOrderFromFarm(customerId: string, farmId: string) {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'orders',
    where: {
      and: [
        {
          customer: {
            equals: customerId,
          },
        },
        {
          farm: {
            equals: farmId,
          },
        },
      ],
    },
    limit: 1,
    depth: 0,
  })

  return result.docs.length > 0
}

export async function customerHasOrderedProduct(customerId: string, productId: string) {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'orders',
    where: {
      and: [
        {
          customer: {
            equals: customerId,
          },
        },
        {
          'items.product': {
            equals: productId,
          },
        },
      ],
    },
    limit: 1,
    depth: 0,
  })

  return result.docs.length > 0
}
