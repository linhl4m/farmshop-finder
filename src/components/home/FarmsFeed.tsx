import { FarmCard } from '@/components/ui/FarmCard'

type Props = {
  farms: any[]
}

export function FarmsFeed({ farms }: Props) {
  if (farms.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[#c2c9bb] bg-[#f3f4ed] p-12 text-center">
        <h3 className="mb-2 text-xl text-primary md:text-2xl">No farms found</h3>
        <p className="text-sm text-secondary">Try changing your filters or search area.</p>
      </div>
    )
  }

  return (
    <>
      <div className="xl:hidden">
        <h3 className="text-xl text-primary md:text-2xl">Discover Local Farms</h3>
        <p className="mt-1 mb-6 text-sm text-secondary">Find the best producers within 50 km</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {farms.map((farm) => (
          <FarmCard key={farm.id} farm={farm} />
        ))}
      </div>
    </>
  )
}
