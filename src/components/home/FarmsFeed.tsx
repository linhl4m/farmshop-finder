import { FarmCard } from '@/components/ui/FarmCard'
import { ProductCard } from '@/components/ui/ProductCard'

type Props = {
  farms: any[]
  products: any[]
  mapOpen?: boolean
  categories: string[]
}

export function FarmsFeed({ farms, products, mapOpen, categories }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {!mapOpen && (
        <section>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-serif text-2xl font-semibold text-primary">Trending Products</h2>
            <a href="#" className="text-sm font-semibold text-primary">
              View all
            </a>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {products.slice(0, 7).map((product) => (
              <ProductCard key={product.id} product={product} variant="small" />
            ))}
          </div>
        </section>
      )}
      <section>
        <h2 className="mb-6 font-serif text-3xl font-semibold text-[#154212]">
          Discover Farms in Brandenburg
        </h2>

        <div
          className={
            mapOpen ? 'grid gap-8 md:grid-cols-2' : 'grid gap-8 md:grid-cols-2 xl:grid-cols-3'
          }
        >
          {farms.map((farm) => (
            <FarmCard key={farm.id} farm={farm} />
          ))}
        </div>
      </section>
    </div>
  )
}
