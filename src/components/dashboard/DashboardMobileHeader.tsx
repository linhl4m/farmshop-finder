import { Store } from 'lucide-react'
import Link from 'next/link'

type Props = {
  farmName?: string | null
  farmSlug?: string
}

export function DashboardMobileHeader({ farmName, farmSlug }: Props) {
  return (
    <header className="flex items-center justify-between md:hidden">
      <div>
        <p className="text-sm text-muted-foreground">Good morning,</p>
        <Link href={`/farms/${farmSlug || '#'}`}>
          <h1 className="text-primary">{farmName || 'Your Farm'}</h1>
        </Link>
      </div>

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Store size={24} />
      </div>
    </header>
  )
}
