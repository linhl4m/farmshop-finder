import { Star } from 'lucide-react'

export function ReviewPromptCard() {
  return (
    <section className="rounded-2xl bg-orange-100 p-6">
      <h2 className="text-xl font-semibold text-orange-950">How was your last order?</h2>

      <p className="mt-2 text-sm text-orange-900/80">
        Share your feedback for your latest farm order.
      </p>

      <div className="mt-4 flex gap-1 text-orange-900">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} size={22} />
        ))}
      </div>

      <button className="mt-5 w-full rounded-lg bg-orange-950 px-4 py-2 text-sm font-medium text-white">
        Write a review
      </button>
    </section>
  )
}
