import type { CollectionBeforeChangeHook } from 'payload'

export const createOrderSnapshot: CollectionBeforeChangeHook = async ({ data, req, operation }) => {
  if (operation !== 'create') return data

  if (!data.items || !Array.isArray(data.items)) {
    return data
  }

  let total = 0

  const items = await Promise.all(
    data.items.map(async (item) => {
      const productId = typeof item.product === 'string' ? item.product : item.product?.id

      if (!productId) return item

      const product = await req.payload.findByID({
        collection: 'products',
        id: productId,
      })

      const quantity = Number(item.quantity || 1)
      const price = Number(product.price || 0)

      total += price * quantity

      return {
        ...item,
        priceSnapshot: price,
        productNameSnapshot: product.name,
        unitSnapshot: product.unit,
      }
    }),
  )

  return {
    ...data,
    items,
    total,
  }
}
