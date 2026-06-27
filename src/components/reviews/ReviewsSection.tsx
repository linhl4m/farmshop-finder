import { Star } from 'lucide-react'
import Link from 'next/link'

type Props = {
  reviews: any[]
  ratingAverage: number
  ratingCount: number

  canWriteReview?: boolean
  reviewButton?: React.ReactNode

  viewAllHref?: string
  title?: string
}

export function ReviewsSection({
  reviews,
  ratingAverage,
  ratingCount,
  canWriteReview = false,
  reviewButton,
  viewAllHref,
  title = 'Customer Reviews',
}: Props) {
  return (
    <section className="mb-12 border-t border-[#c2c9bb]/30 pt-10">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-primary md:text-2xl">{title}</h2>

          <div className="mt-3 flex items-center gap-3">
            <p className="text-2xl font-bold text-primary">{ratingAverage.toFixed(1)}</p>

            <div>
              <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-current" />
                ))}
              </div>

              <p className="text-xs text-secondary">Based on {ratingCount} ratings</p>
            </div>
          </div>
        </div>

        {canWriteReview && reviewButton}
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {reviews.slice(0, 3).map((review) => (
          <article key={review.id} className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="mb-3 flex justify-between">
              <div>
                <h3 className="text-sm font-semibold text-primary">{review.title || 'Review'}</h3>

                <p className="text-xs text-secondary">
                  {typeof review.customer === 'object' ? review.customer.email : 'Customer'}
                </p>
              </div>

              <p className="text-sm font-bold text-[#5a2e00]">{review.rating}/5</p>
            </div>

            <p className="text-sm italic text-secondary">"{review.comment}"</p>
          </article>
        ))}
      </div>

      {viewAllHref && (
        <div className="flex justify-center pt-6">
          <Link href="#" className="font-bold underline">
            View all {ratingCount} reviews
          </Link>
        </div>
      )}
    </section>
  )
}
