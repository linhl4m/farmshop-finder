import { Store } from 'lucide-react'

type Props = {
  farmName?: string | null
}

export function DashboardMobileHeader({ farmName }: Props) {
  return (
    <header className="flex items-center justify-between px-6 py-6 md:hidden">
      <div>
        <p className="text-sm text-muted-foreground">Good morning,</p>
        <h1 className="text-3xl font-bold text-primary">{farmName || 'Your Farm'}</h1>
      </div>

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Store size={24} />
      </div>
    </header>
  )
}
