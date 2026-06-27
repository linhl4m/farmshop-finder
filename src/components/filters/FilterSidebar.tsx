'use client'

import { useState, useEffect } from 'react'
import { parseAsArrayOf, parseAsBoolean, parseAsString, useQueryState } from 'nuqs'
import { Check, ChevronDown, Map, SlidersHorizontal, X } from 'lucide-react'

type ProductCategory = {
  id: string
  name: string
  slug: string
}

type Props = {
  mapOpen?: boolean
  onToggleMap?: () => void
  categories?: ProductCategory[]
  showGlobalFilters?: boolean
  sidebar?: boolean
  mobileOpen?: boolean
  onMobileClose?: () => void
}

const DISTANCE_STEPS = ['', '5', '10', '25', '50']
const opts = { shallow: false } as const

export function FilterSidebar({
  mapOpen = false,
  onToggleMap,
  categories = [],
  showGlobalFilters = false,
  mobileOpen,
  onMobileClose,
}: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const isControlled = mobileOpen !== undefined
  const open = isControlled ? mobileOpen! : drawerOpen
  const closeDrawer = isControlled ? (onMobileClose ?? (() => {})) : () => setDrawerOpen(false)

  const [activeCategories, setActiveCategories] = useQueryState(
    'category',
    parseAsArrayOf(parseAsString).withDefault([]).withOptions(opts),
  )
  const [organic, setOrganic] = useQueryState(
    'organic',
    parseAsBoolean.withDefault(false).withOptions(opts),
  )
  const [distance, setDistance] = useQueryState(
    'distance',
    parseAsString.withDefault('').withOptions(opts),
  )
  const [price, setPrice] = useQueryState(
    'price',
    parseAsString.withDefault('').withOptions(opts),
  )

  const distanceIndex = Math.max(0, DISTANCE_STEPS.indexOf(distance))
  const [localDistanceIndex, setLocalDistanceIndex] = useState(distanceIndex)

  const activeFilterCount =
    activeCategories.length + (organic ? 1 : 0) + (distance ? 1 : 0) + (price ? 1 : 0)

  const toggleCategory = (slug: string) =>
    setActiveCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    )

  const clearAll = () => {
    setActiveCategories([])
    setOrganic(false)
    setDistance('')
    setPrice('')
    closeDrawer()
  }

  useEffect(() => {
    setLocalDistanceIndex(distanceIndex)
  }, [distanceIndex])

  const filterControls = (
    <div className="space-y-6">
      {/* Farm Type */}
      <div>
        <span className="mb-3 block text-xs font-semibold uppercase tracking-wider text-secondary">
          Farm Type
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setOrganic(!organic)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              organic
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
          onChange={(e) => setLocalDistanceIndex(Number(e.target.value))}
          onMouseUp={() => setDistance(DISTANCE_STEPS[localDistanceIndex])}
          onTouchEnd={() => setDistance(DISTANCE_STEPS[localDistanceIndex])}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-[#e7e9e1] accent-primary"
        />
        <div className="mt-2 flex justify-between px-2 text-xs text-secondary">
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
            value={price}
            onChange={(e) => setPrice(e.target.value)}
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
              onClick={() => setActiveCategories([])}
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
  )

  return (
    <>
      {/* Desktop sidebar (lg+) */}
      <div className="hidden lg:block sticky top-24 space-y-6">
        <div>
          <h3 className="text-2xl text-primary">
            Discover {showGlobalFilters ? 'Local Farms' : 'Products'}
          </h3>
          <p className="mt-1 mb-6 text-sm text-secondary">
            Find the best {showGlobalFilters ? 'producers within 50 km.' : 'local products'}
          </p>
          {showGlobalFilters && onToggleMap && (
            <button
              onClick={onToggleMap}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#bcf0ae]/30 py-3 font-semibold text-primary transition hover:bg-[#bcf0ae]/50 active:scale-95"
            >
              <Map className="h-5 w-5" />
              {mapOpen ? 'Back to List' : 'View on Map'}
            </button>
          )}
        </div>
        <div className="flex justify-end">
          {activeFilterCount > 0 && (
            <button
              onClick={clearAll}
              className="text-sm font-medium text-secondary hover:text-primary"
            >
              Clear all
            </button>
          )}
        </div>
        {filterControls}
      </div>

      {/* Mobile floating filter button — only in uncontrolled (standalone) mode */}
      {!isControlled && (
        <button
          onClick={() => setDrawerOpen(true)}
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full border border-primary/20 bg-white px-5 py-3 text-sm font-semibold text-primary shadow-lg transition active:scale-95 lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      )}

      {/* Mobile bottom-sheet drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={closeDrawer} />

          <div className="absolute bottom-0 left-0 right-0 flex max-h-[88vh] flex-col rounded-t-2xl bg-white shadow-2xl">
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-[#c2c9bb]" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-primary">
                {showGlobalFilters ? 'Discover Local Farms' : 'Filter Products'}
              </h2>
              <div className="flex items-center gap-4">
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-sm font-medium text-secondary hover:text-primary"
                  >
                    Clear all
                  </button>
                )}
                <button onClick={closeDrawer} className="rounded-full p-1 hover:bg-[#f3f4ed]">
                  <X className="h-5 w-5 text-secondary" />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto px-6 py-6">{filterControls}</div>

            {/* Footer CTA */}
            <div className="border-t p-4">
              <button
                onClick={closeDrawer}
                className="w-full rounded-xl bg-primary py-3.5 font-semibold text-white transition active:scale-[0.98]"
              >
                {activeFilterCount > 0
                  ? `Show results · ${activeFilterCount} active`
                  : 'Show results'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
