import { FarmCard } from '@/components/ui/FarmCard'

type Props = {
  farms: any[]
}

export function FarmsFeed({ farms }: Props) {
  if (farms.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[#c2c9bb] bg-[#f3f4ed] p-12 text-center">
        <h3 className="mb-2 font-serif text-2xl font-semibold text-primary">No farms found</h3>
        <p className="text-sm text-secondary">Try changing your filters or search area.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {farms.map((farm) => (
        <FarmCard key={farm.id} farm={farm} />
      ))}
    </div>
  )
}
