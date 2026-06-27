'use server'

import { revalidatePath } from 'next/cache'
import { getCart, setCart } from '@/lib/data/cart'
import { getCurrentUser, requireUser } from '@/lib/auth'
import { getPayload } from 'payload'
import config from '@payload-config'
import { redirect } from 'next/navigation'

export async function addToCartAction(formData: FormData) {
  const user = await getCurrentUser()

  if (user?.role === 'farm') {
    return {
      success: false,
      message: 'Farm accounts cannot order.',
      isNewProduct: false,
    }
  }

  const productId = String(formData.get('productId'))
  const farmId = String(formData.get('farmId'))
  const quantity = Number(formData.get('quantity') || 1)

  const cart = await getCart()

  const existing = cart.find((item) => item.productId === productId)

  if (existing) {
    existing.quantity += quantity

    await setCart(cart)
    revalidatePath('/', 'layout')

    return { isNewProduct: false }
  }

  cart.push({ productId, farmId, quantity })

  await setCart(cart)
  revalidatePath('/', 'layout')

  return { isNewProduct: true }
}

export async function incrementCartItemAction(formData: FormData) {
  const productId = String(formData.get('productId'))

  const cart = await getCart()

  const nextCart = cart.map((item) =>
    item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
  )

  await setCart(nextCart)

  revalidatePath('/', 'layout')
}

export async function decrementCartItemAction(formData: FormData) {
  const productId = String(formData.get('productId'))

  const cart = await getCart()

  const nextCart = cart
    .map((item) => (item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item))
    .filter((item) => item.quantity > 0)

  await setCart(nextCart)

  revalidatePath('/', 'layout')
}

export async function removeCartItemAction(formData: FormData) {
  const productId = String(formData.get('productId'))

  const cart = await getCart()

  const nextCart = cart.filter((item) => item.productId !== productId)

  await setCart(nextCart)

  revalidatePath('/', 'layout')
}

export async function checkoutAction() {
  const user = await requireUser()

  if (user.role !== 'customer') {
    redirect('/account')
  }

  const cart = await getCart()

  if (cart.length === 0) {
    redirect('/cart')
  }

  const groups = new Map<
    string,
    { farmId: string; items: { productId: string; quantity: number }[] }
  >()

  for (const item of cart) {
    if (!item.farmId) continue

    if (!groups.has(item.farmId)) {
      groups.set(item.farmId, { farmId: item.farmId, items: [] })
    }

    groups.get(item.farmId)!.items.push({ productId: item.productId, quantity: item.quantity })
  }

  if (groups.size === 0) {
    redirect('/cart')
  }

  const payload = await getPayload({ config })

  for (const group of groups.values()) {
    await payload.create({
      collection: 'orders',
      data: {
        customer: user.id,
        farm: group.farmId,
        items: group.items.map((item) => ({
          product: item.productId,
          quantity: item.quantity,
          priceSnapshot: 0,
        })),
        total: 0,
        status: 'pending',
      },
      overrideAccess: false,
      user,
    })
  }

  await setCart([])

  revalidatePath('/', 'layout')

  return { success: true }
}
