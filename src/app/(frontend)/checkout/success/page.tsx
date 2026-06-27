import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function CheckoutSuccessPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CheckCircle size={42} />
      </div>

      <h1 className="text-primary md:text-4xl">Order placed</h1>

      <p className="mt-4 text-lg text-muted-foreground">
        Your order has been sent to the farm. You can track it from your account.
      </p>

      <div className="mt-8 flex gap-3">
        <Link href="/account" className="rounded-xl bg-primary px-6 py-3 font-semibold text-white">
          View my orders
        </Link>

        <Link href="/" className="rounded-xl border px-6 py-3 font-semibold text-primary">
          Continue shopping
        </Link>
      </div>
    </main>
  )
}
