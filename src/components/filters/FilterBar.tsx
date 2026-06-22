'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check, ChevronDown } from 'lucide-react'

type ProductCategory = {
  id: string
  name: string
  slug: string
}

type Props = {
  mapOpen: boolean
  onToggleMap: () => void
  categories?: ProductCategory[]
}

export function FilterBar({ mapOpen, onToggleMap, categories = [] }: Props) {
  const [categoryOpen, setCategoryOpen] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  const activeCategories = searchParams.getAll('category')

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (!value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }

    router.push(`/?${params.toString()}`)
  }

  const toggleCategory = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentCategories = params.getAll('category')

    params.delete('category')

    const nextCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((id) => id !== categoryId)
      : [...currentCategories, categoryId]

    nextCategories.forEach((id) => params.append('category', id))

    router.push(`/?${params.toString()}`)
  }

  const clearCategories = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('category')
    router.push(`/?${params.toString()}`)
  }

  const categoryLabel =
    activeCategories.length === 0 ? 'Categories' : `${activeCategories.length} selected`

  return (
    <section>
      <div className="flex w-full justify-between gap-4">
        <div className="flex gap-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => setCategoryOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-full border border-[#c2c9bb]/40 bg-white px-5 py-2 text-sm"
            >
              {categoryLabel}
              <ChevronDown className="h-4 w-4" />
            </button>

            {categoryOpen && (
              <div className="absolute left-0 top-11 z-30 w-56 rounded-2xl border border-[#c2c9bb]/40 bg-white p-2 shadow-lg">
                <button
                  type="button"
                  onClick={clearCategories}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-[#f3f4ed]"
                >
                  All Results
                  {activeCategories.length === 0 && <Check className="h-4 w-4 text-[#154212]" />}
                </button>

                {categories.map((category) => {
                  const active = activeCategories.includes(category.slug)

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => toggleCategory(category.slug)}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-[#f3f4ed]"
                    >
                      <span>{category.name}</span>
                      {active && <Check className="h-4 w-4 text-[#154212]" />}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="relative">
            <select
              value={searchParams.get('price') ?? ''}
              onChange={(e) => updateParam('price', e.target.value)}
              className="appearance-none rounded-full border border-[#c2c9bb]/40 bg-white py-2 pl-4 pr-10 text-sm"
            >
              <option value="">Price</option>
              <option value="3">Up to €3</option>
              <option value="5">Up to €5</option>
              <option value="10">Up to €10</option>
              <option value="15">Up to €15</option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          </div>

          <div className="relative">
            <select
              value={searchParams.get('distance') ?? ''}
              onChange={(e) => updateParam('distance', e.target.value)}
              className="appearance-none rounded-full border border-[#c2c9bb]/40 bg-white py-2 pl-4 pr-10 text-sm"
            >
              <option value="">Distance</option>
              <option value="5">5 km</option>
              <option value="10">10 km</option>
              <option value="25">25 km</option>
              <option value="50">50 km</option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          </div>
        </div>

        <button
          onClick={onToggleMap}
          className="shrink-0 rounded-full border border-[#c2c9bb]/40 bg-white px-5 py-2 text-sm font-medium hover:bg-[#f3f4ed]"
        >
          {mapOpen ? 'Hide Map' : 'Discover nearby farms'}
        </button>
      </div>
    </section>
  )
}
