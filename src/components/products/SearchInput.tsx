'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function SearchInput() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') ?? '')

  useEffect(() => {
    const currentSearch = searchParams.get('search') ?? ''

    if (search !== currentSearch) {
      setSearch(currentSearch)
    }
  }, [searchParams])

  useEffect(() => {
    const currentSearch = searchParams.get('search') ?? ''

    if (search === currentSearch) return

    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())

      if (!search.trim()) {
        params.delete('search')
      } else {
        params.set('search', search.trim())
      }

      router.replace(`${pathname}?${params.toString()}`)
    }, 500)

    return () => clearTimeout(timeout)
  }, [search, searchParams, pathname, router])

  return (
    <input
      value={search ?? ''}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search..."
      className="w-full rounded-full border border-border bg-white px-4 py-2 text-sm"
    />
  )
}
