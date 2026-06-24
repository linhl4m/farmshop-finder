'use client'

import { Minus } from 'lucide-react'
import { decrementCartItemAction } from '@/app/(frontend)/cart/actions'
import { useCart } from '@/components/cart/CartProvider'

type Props = {
  productId: string
  quantity: number
}

export function DecrementCartButton({ productId, quantity }: Props) {
  const { decreaseCount } = useCart()

  async function handleDecrement(formData: FormData) {
    await decrementCartItemAction(formData)

    if (quantity === 1) {
      decreaseCount(1)
    }
  }

  return (
    <form action={handleDecrement}>
      <input type="hidden" name="productId" value={productId} />

      <button className="flex h-8 w-8 items-center justify-center rounded-full text-primary hover:bg-primary/10">
        <Minus size={16} />
      </button>
    </form>
  )
}
