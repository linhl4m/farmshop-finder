'use client'

import type { ReactNode } from 'react'
import { addToCartAction } from '@/app/(frontend)/cart/actions'
import { useCart } from '@/components/cart/CartProvider'
import { toast } from 'sonner'

type Props = {
  productId: string
  farmId: string
  disabled?: boolean
  className?: string
  children?: ReactNode
}

export function AddToCartButton({ productId, farmId, disabled, className, children }: Props) {
  const { increaseCount } = useCart()

  async function handleAddToCart(formData: FormData) {
    const result = await addToCartAction(formData)

    if (result.success === false) {
      toast.error(result.message)
      return
    }

    if (result.isNewProduct) {
      increaseCount(1)
    }
  }

  return (
    <form action={handleAddToCart}>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="farmId" value={farmId} />
      <input type="hidden" name="quantity" value="1" />

      <button type="submit" disabled={disabled} className={className}>
        {children ?? 'Add to Cart'}
      </button>
    </form>
  )
}
