'use client'

import { Heart } from 'lucide-react'
import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { toggleFavoriteFarmAction } from '@/app/(frontend)/favorites/actions'

type Props = {
  farmId: string
  farmSlug: string
  initialFavorited: boolean
  className?: string
}

export function FavoriteFarmButton({ farmId, farmSlug, initialFavorited, className }: Props) {
  const [state, formAction] = useActionState(toggleFavoriteFarmAction, {
    success: false,
    favorited: initialFavorited,
  })

  const favorited = state?.favorited ?? initialFavorited

  return (
    <form action={formAction} className={className}>
      <input type="hidden" name="farmId" value={farmId} />
      <input type="hidden" name="farmSlug" value={farmSlug} />
      <button
        type="submit"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-primary shadow backdrop-blur transition hover:bg-white"
        aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart className={favorited ? 'h-4 w-4 fill-current' : 'h-4 w-4'} />
      </button>
    </form>
  )
}
