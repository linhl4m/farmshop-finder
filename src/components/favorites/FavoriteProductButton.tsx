'use client'

import { Heart } from 'lucide-react'
import { useActionState } from 'react'
import { toggleFavoriteProductAction } from '@/app/(frontend)/favorites/actions'

type Props = {
  productId: string
  productSlug: string
  farmSlug: string
  initialFavorited?: boolean
  className?: string
  variant?: 'default' | 'floating'
}

export function FavoriteProductButton({
  productId,
  productSlug,
  farmSlug,
  initialFavorited = false,
  className,
  variant = 'default',
}: Props) {
  const [state, formAction] = useActionState(toggleFavoriteProductAction, {
    success: false,
    favorited: initialFavorited,
  })

  const favorited = state?.favorited ?? initialFavorited

  const buttonClass =
    variant === 'floating'
      ? 'flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-primary shadow backdrop-blur transition hover:bg-white'
      : 'flex h-[60px] w-[60px] items-center justify-center rounded-xl border border-primary/20 bg-white text-primary transition hover:bg-primary/10'

  const iconClass =
    variant === 'floating'
      ? favorited
        ? 'h-4 w-4 fill-current'
        : 'h-4 w-4'
      : favorited
        ? 'h-6 w-6 fill-current'
        : 'h-6 w-6'

  return (
    <form action={formAction} className={className}>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="productSlug" value={productSlug} />
      <input type="hidden" name="farmSlug" value={farmSlug} />

      <button
        type="submit"
        className={buttonClass}
        aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart className={iconClass} />
      </button>
    </form>
  )
}
