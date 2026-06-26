'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function HorizontalScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  function updateButtons() {
    if (!ref.current) return

    const { scrollLeft, scrollWidth, clientWidth } = ref.current

    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5)
  }

  useEffect(() => {
    updateButtons()

    const element = ref.current

    if (!element) return

    element.addEventListener('scroll', updateButtons)
    window.addEventListener('resize', updateButtons)

    return () => {
      element.removeEventListener('scroll', updateButtons)
      window.removeEventListener('resize', updateButtons)
    }
  }, [])

  function scroll(direction: 'left' | 'right') {
    ref.current?.scrollBy({
      left: direction === 'right' ? 320 : -320,
      behavior: 'smooth',
    })
  }

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition hover:scale-105"
        >
          <ChevronLeft size={22} />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition hover:scale-105"
        >
          <ChevronRight size={22} />
        </button>
      )}

      <div
        ref={ref}
        onMouseDown={(e) => {
          if (!ref.current) return

          isDragging.current = true
          startX.current = e.pageX
          scrollLeft.current = ref.current.scrollLeft
        }}
        onMouseLeave={() => {
          isDragging.current = false
        }}
        onMouseUp={() => {
          isDragging.current = false
        }}
        onMouseMove={(e) => {
          if (!isDragging.current || !ref.current) return

          e.preventDefault()

          const walk = e.pageX - startX.current
          ref.current.scrollLeft = scrollLeft.current - walk
        }}
        className="flex cursor-grab gap-6 overflow-x-auto pb-4 active:cursor-grabbing snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
    </div>
  )
}
