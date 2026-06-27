'use client'

import { parseAsString, useQueryState } from 'nuqs'

type Props = {
  placeholder?: string
}

export function SearchInput({ placeholder = 'Search…' }: Props) {
  const [search, setSearch] = useQueryState(
    'search',
    parseAsString
      .withDefault('')
      .withOptions({ shallow: false, history: 'replace', throttleMs: 500 }),
  )

  return (
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value || null)}
      placeholder={placeholder}
      className="w-full rounded-full border border-border px-4 py-2 text-sm"
    />
  )
}
