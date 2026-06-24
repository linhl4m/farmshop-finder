'use client'

import { addToCartAction } from '@/app/(frontend)/cart/actions'
import { useCart } from '@/components/cart/CartProvider'

type Props = {
  productId: string
  disabled?: boolean
  className?: string
}

export function AddToCartButton({ productId, disabled, className }: Props) {
  const { increaseCount } = useCart()

  async function handleAddToCart(formData: FormData) {
    const result = await addToCartAction(formData)

    if (result.isNewProduct) {
      increaseCount(1)
    }
  }

  return (
    <form action={handleAddToCart}>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="quantity" value="1" />

      <button type="submit" disabled={disabled} className={className}>
        Add to Cart
      </button>
    </form>
  )
}
