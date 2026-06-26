import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Minus, Plus, Store, ShoppingBasket } from 'lucide-react'
import { getCartWithProducts } from '@/lib/data/cart'
import { incrementCartItemAction } from './actions'
import { RemoveCartButton } from '@/components/cart/RemoveCartButton'
import { DecrementCartButton } from '@/components/cart/DecrementCartButton'
import { CheckoutButton } from '@/components/cart/CheckoutButton'

export default async function CartPage() {
  const cartGroups = await getCartWithProducts()

  const subtotal = cartGroups.reduce((sum, group) => {
    return (
      sum +
      group.items.reduce((itemSum, item) => {
        return itemSum + item.price * item.quantity
      }, 0)
    )
  }, 0)

  const deliveryFee = subtotal > 50 || subtotal === 0 ? 0 : 4.99
  const serviceFee = subtotal === 0 ? 0 : 1.5
  const total = subtotal + deliveryFee + serviceFee

  return (
    <main className="min-h-screen bg-background pb-24">
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-12 md:py-12">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1 space-y-8">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-4xl font-bold tracking-tight text-primary">Your Cart</h1>

              <Link
                href="/"
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                <ArrowLeft size={16} />
                Continue Shopping
              </Link>
            </div>

            {cartGroups.length === 0 ? (
              <div className="p-10 text-center">
                <ShoppingBasket className="mx-auto mb-4 text-muted-foreground" size={42} />
                <h2 className="text-2xl font-semibold">Your cart is empty</h2>
                <p className="mt-2 text-muted-foreground">
                  Browse farms and add fresh products to your cart.
                </p>
                <Link
                  href="/"
                  className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 font-semibold text-white"
                >
                  Start shopping
                </Link>
              </div>
            ) : (
              cartGroups.map((group) => (
                <section key={group.farm.id} className="space-y-4">
                  <div className="flex items-center gap-2 border-b pb-3">
                    <Store className="text-primary" size={22} />
                    <h2 className="text-2xl font-semibold">{group.farm.name}</h2>
                  </div>

                  <div className="space-y-4">
                    {group.items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex flex-col items-center gap-4 rounded-2xl border bg-card p-4 shadow-sm sm:flex-row"
                      >
                        <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:w-32">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : null}
                        </div>

                        <div className="flex-1 space-y-1 text-center sm:text-left">
                          {item.organic && (
                            <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                              Organic
                            </span>
                          )}

                          <h3 className="text-xl font-semibold">{item.name}</h3>

                          <p className="text-sm text-muted-foreground">
                            €{item.price.toFixed(2)} / {item.unit}
                          </p>
                        </div>

                        <div className="flex flex-col items-center gap-2 sm:items-end">
                          <div className="flex items-center rounded-full border bg-muted/40 p-1">
                            <DecrementCartButton
                              productId={item.productId}
                              quantity={item.quantity}
                            />

                            <span className="min-w-10 px-3 text-center font-semibold">
                              {item.quantity}
                            </span>

                            <form action={incrementCartItemAction}>
                              <input type="hidden" name="productId" value={item.productId} />
                              <button className="flex h-8 w-8 items-center justify-center rounded-full text-primary hover:bg-primary/10">
                                <Plus size={16} />
                              </button>
                            </form>
                          </div>

                          <p className="font-semibold text-primary">
                            €{(item.price * item.quantity).toFixed(2)}
                          </p>

                          <RemoveCartButton productId={item.productId} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>

          <aside className="w-full lg:w-96">
            <div className="sticky top-24 rounded-2xl border bg-card p-6 shadow-sm">
              <h2 className="border-b pb-4 text-2xl font-semibold text-primary">Order Summary</h2>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? 'Free' : `€${deliveryFee.toFixed(2)}`}</span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>Service Fee</span>
                  <span>€{serviceFee.toFixed(2)}</span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  <span className="text-2xl font-semibold">Total</span>
                  <span className="text-2xl font-semibold text-primary">€{total.toFixed(2)}</span>
                </div>
              </div>

              <CheckoutButton disabled={cartGroups.length === 0} />

              <p className="mt-4 text-center text-xs text-muted-foreground">
                By checking out, you agree to our Terms of Service and Privacy Policy.
              </p>

              <div className="mt-8 flex gap-3 rounded-xl border bg-primary/5 p-4">
                <ShoppingBasket className="text-primary" size={22} />
                <div>
                  <p className="font-semibold text-primary">Free delivery on €50+</p>
                  <p className="text-sm text-muted-foreground">
                    {subtotal >= 50
                      ? 'You unlocked free delivery.'
                      : `Add €${(50 - subtotal).toFixed(2)} more for free delivery.`}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
