import { useEffect, useRef, useState } from 'react'

/**
 * Estado y controles para un riel con scroll horizontal + botones de navegación
 * (mismo patrón usado en la franja de Categorías de la home).
 */
export function useScrollRail(cardWidth: number, gap: number, cardsPerClick = 2) {
  const railRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollState = () => {
    const node = railRef.current
    if (!node) return
    setCanScrollLeft(node.scrollLeft > 4)
    setCanScrollRight(node.scrollLeft + node.clientWidth < node.scrollWidth - 4)
  }

  useEffect(() => {
    updateScrollState()
    const node = railRef.current
    if (!node) return
    node.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      node.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  })

  const scrollByCards = (dir: 1 | -1) => {
    const node = railRef.current
    if (!node) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    node.scrollBy({ left: dir * (cardWidth + gap) * cardsPerClick, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return { railRef, canScrollLeft, canScrollRight, scrollByCards }
}
