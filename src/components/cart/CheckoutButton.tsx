'use client'

import { useRouter } from 'next/navigation'
import { useCart } from '@/components/cart/CartProvider'
import { checkoutAction } from '@/app/(frontend)/cart/actions'

export function CheckoutButton({ disabled }: { disabled: boolean }) {
  const { setCount } = useCart()
  const router = useRouter()

  async function handleCheckout() {
    const result = await checkoutAction()
    if (result?.success) {
      setCount(0)
      router.push('/checkout/success')
    }
  }

  return (
    <form action={handleCheckout}>
      <button
        disabled={disabled}
        className="mt-8 w-full rounded-xl bg-primary py-4 text-lg font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        Proceed to Checkout
      </button>
    </form>
  )
}
