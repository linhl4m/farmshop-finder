import { User } from 'lucide-react'
import { DashboardSidebarNav } from './DashboardSidebarNav'
import Link from 'next/link'

type Props = {
  farmName?: string | null
  farmSlug?: string
}

export function DashboardSidebar({ farmName, farmSlug }: Props) {
  return (
    <aside className="left-0 hidden w-64 flex-col border-r bg-muted/40 p-4 md:flex">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User size={22} />
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Welcome back,</p>
          <Link href={`/farms/${farmSlug}`}>
            <p className="font-semibold">{farmName || 'Your Farm'}</p>
          </Link>
        </div>
      </div>

      <DashboardSidebarNav />
    </aside>
  )
}
