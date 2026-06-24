'use client'

import { Trash2 } from 'lucide-react'
import { removeCartItemAction } from '@/app/(frontend)/cart/actions'
import { useCart } from '@/components/cart/CartProvider'

type Props = {
  productId: string
}

export function RemoveCartButton({ productId }: Props) {
  const { decreaseCount } = useCart()

  async function handleRemove(formData: FormData) {
    await removeCartItemAction(formData)
    decreaseCount(1)
  }

  return (
    <form action={handleRemove}>
      <input type="hidden" name="productId" value={productId} />

      <button className="flex items-center gap-1 text-xs font-semibold text-destructive hover:underline">
        <Trash2 size={14} />
        Remove
      </button>
    </form>
  )
}
