'use client'

import { parseAsString, useQueryState } from 'nuqs'

export function SearchInput() {
  const [search, setSearch] = useQueryState(
    'search',
    parseAsString.withDefault('').withOptions({ shallow: false, history: 'replace', throttleMs: 500 }),
  )

  return (
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value || null)}
      placeholder="Search..."
      className="w-full rounded-full border border-border bg-white px-4 py-2 text-sm"
    />
  )
}
