'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
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

export function ProductFilters({ categories, showGlobalFilters = true }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (!value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <aside className="hidden w-64 flex-shrink-0 md:block">
      <div className="sticky top-28 space-y-8">
        <div>
          <h3 className="mb-4 font-serif text-2xl font-semibold text-primary">Search</h3>
          <SearchInput />
        </div>

        <div>
          <h3 className="mb-4 font-serif text-2xl font-semibold text-primary">Categories</h3>

          <div className="flex flex-col gap-2">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center gap-2 text-secondary">
                <input
                  type="checkbox"
                  checked={searchParams.getAll('category').includes(category.slug)}
                  onChange={() => {
                    const params = new URLSearchParams(searchParams.toString())
                    const current = params.getAll('category')

                    params.delete('category')

                    const next = current.includes(category.slug)
                      ? current.filter((slug) => slug !== category.slug)
                      : [...current, category.slug]

                    next.forEach((slug) => params.append('category', slug))

                    router.push(`${pathname}?${params.toString()}`)
                  }}
                />

                {category.name}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-serif text-2xl font-semibold text-primary">Price</h3>
          <div className="relative w-full">
            <select
              value={searchParams.get('price') ?? ''}
              onChange={(e) => updateParam('price', e.target.value)}
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
            <h3 className="mb-4 font-serif text-2xl font-semibold text-primary">Farm Filter</h3>
            <div className="flex gap-2">
              <input
                checked={searchParams.get('organic') === 'true'}
                onChange={(e) => updateParam('organic', e.target.checked ? 'true' : '')}
                type="checkbox"
              />
              <label>Organic Farms</label>
            </div>
          </div>
        )}

        {showGlobalFilters && (
          <div>
            <h3 className="mb-4 font-serif text-2xl font-semibold text-primary">Distance</h3>
            <div className="relative w-full">
              <select
                value={searchParams.get('distance') ?? ''}
                onChange={(e) => updateParam('distance', e.target.value)}
                className="w-full appearance-none rounded-full border border-[#c2c9bb]/40 bg-white py-2 pl-4 pr-10 text-sm"
              >
                <option value="">Any distance</option>
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
