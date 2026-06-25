'use client'

import { useActionState, useEffect, useState } from 'react'
import { Star, X, Send, PencilLine } from 'lucide-react'
import { toast } from 'sonner'
import { createReviewAction } from '@/app/(frontend)/farms/[farmSlug]/actions'

type Props = {
  farmId: string
  farmSlug: string
  productId?: string
}

export function ReviewModalButton({ farmId, farmSlug, productId }: Props) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [state, formAction] = useActionState(createReviewAction, null)

  useEffect(() => {
    if (!state) return

    if (state.success) {
      toast.success(state.message)
      setOpen(false)
    } else {
      toast.error(state.message)
    }
  }, [state])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full border border-primary px-5 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
      >
        <PencilLine size={16} />
        Write a Review
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-xl bg-background shadow-xl">
            <div className="flex items-center justify-between border-b bg-muted/40 px-6 py-4">
              <h2 className="font-serif text-2xl font-semibold text-primary">Write a Review</h2>

              <button onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-muted">
                <X size={20} />
              </button>
            </div>

            <form action={formAction} className="space-y-6 p-6">
              <input type="hidden" name="farmId" value={farmId} />
              <input type="hidden" name="farmSlug" value={farmSlug} />
              <input type="hidden" name="rating" value={rating} />
              {productId && <input type="hidden" name="productId" value={productId} />}

              <div className="text-center">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-secondary">
                  Your Rating
                </p>

                <div className="flex justify-center gap-2 text-yellow-500">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button key={value} type="button" onClick={() => setRating(value)}>
                      <Star
                        className={
                          value <= rating ? 'h-9 w-9 fill-current' : 'h-9 w-9 text-muted-foreground'
                        }
                      />
                    </button>
                  ))}
                </div>

                <p className="mt-2 text-sm font-semibold text-primary">{rating}/5</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-primary">Title</label>
                <input
                  name="title"
                  placeholder="Fresh and delicious"
                  className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-primary">
                  Your Experience
                </label>
                <textarea
                  name="comment"
                  rows={4}
                  placeholder="What did you like about this farm?"
                  className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-lg py-3 font-semibold text-secondary hover:bg-muted"
                >
                  Cancel
                </button>

                <button className="flex-[2] rounded-lg bg-primary py-3 font-bold text-white">
                  <span className="inline-flex items-center gap-2">
                    Submit Review
                    <Send size={16} />
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
