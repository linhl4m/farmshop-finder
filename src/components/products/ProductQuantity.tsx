'use client'

import { Minus, Plus, ShoppingBasket, Heart, OctagonAlert } from 'lucide-react'
import { addToCartAction } from '@/app/(frontend)/cart/actions'
import { useState } from 'react'
import { useCart } from '@/components/cart/CartProvider'
import { toast } from 'sonner'

type Props = {
  productId: string
  farmId: string
  disabled?: boolean
  stock: number
  unit: string
  availability: string
}

export function ProductQuantity({ productId, farmId, disabled, stock, unit, availability }: Props) {
  const [quantity, setQuantity] = useState(1)

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
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-[#c2c9bb]/30 bg-[#e2e3dc] px-2 py-1">
            <button
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full text-primary hover:bg-[#bcf0ae]/30"
            >
              <Minus className="h-4 w-4" />
            </button>

            <span className="w-12 text-center text-xl font-bold text-primary">{quantity}</span>

            <button
              onClick={() => setQuantity((prev) => Math.min(stock, prev + 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full text-primary hover:bg-[#bcf0ae]/30"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <span className="text-sm font-semibold text-secondary">{unit}(s) in cart</span>
        </div>
        <div className="flex justify-center">
          {disabled && (
            <p className="flex items-center gap-2 text-xl font-semibold text-destructive">
              <OctagonAlert size={20} />
              {availability}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <form action={handleAddToCart} className="flex w-full">
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="farmId" value={farmId} />
          <input type="hidden" name="quantity" value={quantity} />

          <button
            disabled={disabled}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-4 text-lg font-bold text-white transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingBasket className="h-5 w-5" />
            {disabled ? 'Not available' : 'Add to Cart'}
          </button>
        </form>

        <button className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-primary text-primary hover:bg-primary/5">
          <Heart className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
