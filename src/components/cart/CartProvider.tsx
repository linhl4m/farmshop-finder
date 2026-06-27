'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type CartContextValue = {
  count: number
  increaseCount: (amount: number) => void
  decreaseCount: (amount: number) => void
  setCount: (count: number) => void
  resetCount: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({
  initialCount,
  children,
}: {
  initialCount: number
  children: React.ReactNode
}) {
  const [count, setCount] = useState(initialCount)

  useEffect(() => {
    setCount(initialCount)
  }, [initialCount])

  function increaseCount(amount: number) {
    setCount((prev) => prev + amount)
  }

  function decreaseCount(amount: number) {
    setCount((prev) => Math.max(0, prev - amount))
  }

  function resetCount() {
    setCount(0)
  }

  return (
    <CartContext.Provider value={{ count, increaseCount, decreaseCount, setCount, resetCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }

  return context
}
