'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Check, ChevronDown, Map } from 'lucide-react'

type ProductCategory = {
  id: string
  name: string
  slug: string
}

type Props = {
  mapOpen: boolean
  onToggleMap?: () => void
  categories?: ProductCategory[]
  showGlobalFilters?: boolean
}

const DISTANCE_STEPS = ['', '5', '10', '25', '50']

export function FilterSidebar({
  mapOpen,
  onToggleMap,
  categories = [],
  showGlobalFilters = false,
}: Props) {
  const [categoryOpen, setCategoryOpen] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const activeCategories = searchParams.getAll('category')
  const organicActive = searchParams.get('organic') === 'true'
  const currentDistance = searchParams.get('distance') ?? ''
  const distanceIndex = Math.max(0, DISTANCE_STEPS.indexOf(currentDistance))
  const [localDistanceIndex, setLocalDistanceIndex] = useState(distanceIndex)

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentValue = params.get(key) ?? ''

    if (currentValue === value) return

    if (!value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }

    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  const toggleCategory = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentCategories = params.getAll('category')
    params.delete('category')
    const nextCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((id) => id !== categoryId)
      : [...currentCategories, categoryId]
    nextCategories.forEach((id) => params.append('category', id))
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  const clearCategories = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('category')
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  const toggleOrganic = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (organicActive) {
      params.delete('organic')
    } else {
      params.set('organic', 'true')
    }
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  useEffect(() => {
    setLocalDistanceIndex(distanceIndex)
  }, [distanceIndex])

  return (
    <div className="sticky top-24 space-y-8">
      <div>
        <h3 className="font-serif text-2xl font-semibold text-primary">
          Discover {showGlobalFilters ? 'Local Farms' : 'Products'}
        </h3>
        <p className="mt-1 mb-6 text-sm text-secondary">
          Find the best {showGlobalFilters ? 'producers within 50 km.' : 'local products'}
        </p>
        {showGlobalFilters && onToggleMap && (
          <button
            onClick={onToggleMap}
            className="mb-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#bcf0ae]/30 py-3 font-semibold text-primary transition hover:bg-[#bcf0ae]/50 active:scale-95"
          >
            <Map className="h-5 w-5" />
            {mapOpen ? 'Back to List' : 'View on Map'}
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Farm Type */}
        <div>
          <span className="mb-3 block text-xs font-semibold uppercase tracking-wider text-secondary">
            Farm Type
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={toggleOrganic}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                organicActive
                  ? 'border-primary bg-[#bcf0ae]/30 text-primary'
                  : 'border-[#c2c9bb] text-secondary hover:bg-[#f3f4ed]'
              }`}
            >
              Organic
            </button>
          </div>
        </div>

        {/* Distance */}
        <div>
          <span className="mb-3 block text-xs font-semibold uppercase tracking-wider text-secondary">
            Distance
          </span>
          <input
            type="range"
            min={0}
            max={4}
            step={1}
            value={localDistanceIndex}
            onChange={(e) => {
              setLocalDistanceIndex(Number(e.target.value))
            }}
            onMouseUp={() => {
              updateParam('distance', DISTANCE_STEPS[localDistanceIndex])
            }}
            onTouchEnd={() => {
              updateParam('distance', DISTANCE_STEPS[localDistanceIndex])
            }}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-[#e7e9e1] accent-primary"
          />
          <div className="mt-2 grid grid-cols-5 text-xs text-secondary">
            <span className="text-left">Any</span>
            <span className="text-center">5 km</span>
            <span className="text-center">10 km</span>
            <span className="text-center">25 km</span>
            <span className="text-right">50 km</span>
          </div>
        </div>

        {/* Max Price */}
        <div>
          <span className="mb-3 block text-xs font-semibold uppercase tracking-wider text-secondary">
            Max Price
          </span>
          <div className="relative">
            <select
              value={searchParams.get('price') ?? ''}
              onChange={(e) => updateParam('price', e.target.value)}
              className="w-full appearance-none rounded-xl border border-[#c2c9bb]/40 bg-white py-2 pl-4 pr-10 text-sm"
            >
              <option value="">Any price</option>
              <option value="3">Up to €3</option>
              <option value="5">Up to €5</option>
              <option value="10">Up to €10</option>
              <option value="15">Up to €15</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
          </div>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div>
            <span className="mb-3 block text-xs font-semibold uppercase tracking-wider text-secondary">
              Products
            </span>
            <div className="space-y-2">
              <label
                onClick={clearCategories}
                className="flex cursor-pointer items-center gap-3 group"
              >
                <div
                  className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border ${
                    activeCategories.length === 0 ? 'border-primary bg-primary' : 'border-[#c2c9bb]'
                  }`}
                >
                  {activeCategories.length === 0 && <Check className="h-3 w-3 text-white" />}
                </div>
                <span className="text-sm text-secondary transition-colors group-hover:text-primary">
                  All Products
                </span>
              </label>

              {categories.map((category) => {
                const active = activeCategories.includes(category.slug)
                return (
                  <label
                    key={category.id}
                    onClick={() => toggleCategory(category.slug)}
                    className="flex cursor-pointer items-center gap-3 group"
                  >
                    <div
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border ${
                        active ? 'border-primary bg-primary' : 'border-[#c2c9bb]'
                      }`}
                    >
                      {active && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className="text-sm text-secondary transition-colors group-hover:text-primary">
                      {category.name}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
