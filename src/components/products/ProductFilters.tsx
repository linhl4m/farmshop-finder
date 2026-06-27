'use client'

import { parseAsArrayOf, parseAsBoolean, parseAsString, useQueryState } from 'nuqs'
import { SearchInput } from '@/components/products/SearchInput'
import { ChevronDown } from 'lucide-react'

type Category = {
  id: string
  name: string
  slug: string
}

type Props = {
  categories: Category[]
  showGlobalFilters: boolean
}

const opts = { shallow: false } as const

export function ProductFilters({ categories, showGlobalFilters = true }: Props) {
  const [activeCategories, setActiveCategories] = useQueryState(
    'category',
    parseAsArrayOf(parseAsString).withDefault([]).withOptions(opts),
  )
  const [price, setPrice] = useQueryState(
    'price',
    parseAsString.withDefault('').withOptions(opts),
  )
  const [organic, setOrganic] = useQueryState(
    'organic',
    parseAsBoolean.withDefault(false).withOptions(opts),
  )
  const [distance, setDistance] = useQueryState(
    'distance',
    parseAsString.withDefault('').withOptions(opts),
  )

  return (
    <aside className="hidden w-64 shrink-0 md:block">
      <div className="top-28 space-y-8">
        <div>
          <h3 className="mb-4 text-xl text-primary">Search</h3>
          <SearchInput />
        </div>

        <div>
          <h3 className="mb-4 text-xl text-primary">Categories</h3>

          <div className="flex flex-col gap-2">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center gap-2 text-secondary">
                <input
                  type="checkbox"
                  checked={activeCategories.includes(category.slug)}
                  onChange={() =>
                    setActiveCategories((prev) =>
                      prev.includes(category.slug)
                        ? prev.filter((s) => s !== category.slug)
                        : [...prev, category.slug],
                    )
                  }
                />
                {category.name}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-xl text-primary">Price</h3>
          <div className="relative w-full">
            <select
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full appearance-none rounded-full border border-[#c2c9bb]/40 bg-white py-2 pl-4 pr-10 text-sm"
            >
              <option value="">Any price</option>
              <option value="5">Up to €5</option>
              <option value="10">Up to €10</option>
              <option value="15">Up to €15</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          </div>
        </div>

        {showGlobalFilters && (
          <div>
            <h3 className="mb-4 text-xl text-primary">Farm Filter</h3>
            <div className="flex gap-2">
              <input
                checked={organic}
                onChange={(e) => setOrganic(e.target.checked)}
                type="checkbox"
              />
              <label>Organic Farms</label>
            </div>
          </div>
        )}

        {showGlobalFilters && (
          <div>
            <h3 className="mb-4 text-xl text-primary">Distance</h3>
            <div className="relative w-full">
              <select
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full appearance-none rounded-full border border-[#c2c9bb]/40 bg-white py-2 pl-4 pr-10 text-sm"
              >
                <option value="">Any distance</option>
                <option value="5">5 km</option>
                <option value="10">10 km</option>
                <option value="25">25 km</option>
                <option value="50">50 km</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
