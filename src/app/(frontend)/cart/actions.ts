'use server'

import { revalidatePath } from 'next/cache'
import { getCart, setCart, getCartWithProducts } from '@/lib/data/cart'
import { requireUser } from '@/lib/auth'
import { getPayload } from 'payload'
import config from '@payload-config'
import { redirect } from 'next/navigation'

export async function addToCartAction(formData: FormData) {
  const productId = String(formData.get('productId'))
  const quantity = Number(formData.get('quantity') || 1)

  const cart = await getCart()

  const existing = cart.find((item) => item.productId === productId)

  if (existing) {
    existing.quantity += quantity

    await setCart(cart)
    revalidatePath('/cart')

    return { isNewProduct: false }
  }

  cart.push({ productId, quantity })

  await setCart(cart)
  revalidatePath('/cart')

  return { isNewProduct: true }
}

export async function incrementCartItemAction(formData: FormData) {
  const productId = String(formData.get('productId'))

  const cart = await getCart()

  const nextCart = cart.map((item) =>
    item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
  )

  await setCart(nextCart)

  revalidatePath('/cart')
}

export async function decrementCartItemAction(formData: FormData) {
  const productId = String(formData.get('productId'))

  const cart = await getCart()

  const nextCart = cart
    .map((item) => (item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item))
    .filter((item) => item.quantity > 0)

  await setCart(nextCart)

  revalidatePath('/cart')
}

export async function removeCartItemAction(formData: FormData) {
  const productId = String(formData.get('productId'))

  const cart = await getCart()

  const nextCart = cart.filter((item) => item.productId !== productId)

  await setCart(nextCart)

  revalidatePath('/cart')
}

export async function checkoutAction() {
  const user = await requireUser()

  if (user.role !== 'customer') {
    redirect('/login')
  }

  const cartGroups = await getCartWithProducts()

  if (cartGroups.length === 0) {
    redirect('/cart')
  }

  const payload = await getPayload({ config })

  for (const group of cartGroups) {
    const total = group.items.reduce((sum: number, item: any) => {
      return sum + item.price * item.quantity
    }, 0)

    await payload.create({
      collection: 'orders',
      user,
      data: {
        customer: user.id,
        farm: group.farm.id,
        items: group.items.map((item: any) => ({
          product: item.productId,
          quantity: item.quantity,
          priceSnapshot: item.price,
          unitSnapshot: item.unit,
          productNameSnapshot: item.name,
        })),
        total,
        status: 'pending',
      },
    })
  }

  await setCart([])

  redirect('/checkout/success')
}
