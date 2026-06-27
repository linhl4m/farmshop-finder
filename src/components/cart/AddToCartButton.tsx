'use client'

import type { ReactNode } from 'react'
import { addToCartAction } from '@/app/(frontend)/cart/actions'
import { useCart } from '@/components/cart/CartProvider'
import { toast } from 'sonner'
import { ShoppingBasket } from 'lucide-react'

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
        {children ?? (
          <>
            <span className="hidden xl:inline">Add to Cart</span>
            <ShoppingBasket className="h-5 w-5 xl:hidden" />
          </>
        )}
      </button>
    </form>
  )
}
