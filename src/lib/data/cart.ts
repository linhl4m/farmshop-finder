import 'server-only'

import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

export type CartItem = {
  productId: string
  quantity: number
  farmId: string
}

const CART_COOKIE = 'farmshop-cart'

export async function getCart() {
  const cookieStore = await cookies()
  const value = cookieStore.get(CART_COOKIE)?.value

  if (!value) return []

  try {
    const items = JSON.parse(value) as CartItem[]
    return items.filter((item) => item.productId && item.farmId)
  } catch {
    return []
  }
}

export async function setCart(cart: CartItem[]) {
  const cookieStore = await cookies()

  cookieStore.set(CART_COOKIE, JSON.stringify(cart), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function getCartWithProducts() {
  const cart = await getCart()

  if (cart.length === 0) return []

  const payload = await getPayload({ config })

  const products = await payload.find({
    collection: 'products',
    where: {
      id: {
        in: cart.map((item) => item.productId),
      },
    },
    depth: 2,
  })

  const groups = new Map<string, any>()

  for (const cartItem of cart) {
    const product = products.docs.find((doc) => doc.id === cartItem.productId)

    if (!product) continue

    const farm = typeof product.farm === 'object' ? product.farm : null

    if (!farm) continue

    if (!groups.has(farm.id)) {
      groups.set(farm.id, {
        farm: {
          id: farm.id,
          name: farm.name,
        },
        items: [],
      })
    }

    groups.get(farm.id).items.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      quantity: cartItem.quantity,
      organic: farm.organic,
      imageUrl: typeof product.photos?.[0] === 'object' ? product.photos[0].url : null,
    })
  }

  return Array.from(groups.values())
}
