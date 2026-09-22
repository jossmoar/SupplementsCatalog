import type { Product } from '../types/product'
import {
  COMPATIBILITY_MATRIX,
  FALLBACK_SUGERIR,
  PRODUCT_TYPE_TO_COMPAT,
  type CompatibilityCategory,
} from '../config/productCompatibility'

function pickBestProduct(
  allProducts: Product[],
  category: CompatibilityCategory,
  excludeIds: Set<string>,
): Product | null {
  const candidates = allProducts.filter(
    (p) =>
      !excludeIds.has(p.id) &&
      p.stock > 0 &&
      PRODUCT_TYPE_TO_COMPAT[p.type] === category,
  )
  if (candidates.length === 0) return null
  // Mismo criterio que ya usa el catálogo: recomendados primero, luego el orden
  // en que llegan de Firestore (más recientes primero).
  return candidates.find((p) => p.recommended) ?? candidates[0]
}

/**
 * Sugiere entre 1 y `max` productos que combinan bien con `currentProduct`,
 * siguiendo la matriz de compatibilidad de
 * "Suplementos: Combinaciones Seguras + Especificación Técnica".
 * Nunca sugiere la misma categoría ni el mismo producto que se está viendo,
 * y nunca junta BCAA con Proteína o Caseína (la matriz ya lo garantiza).
 */
export function getSuggestedProducts(
  currentProduct: Product,
  allProducts: Product[],
  max = 4,
): Product[] {
  const currentCategory = PRODUCT_TYPE_TO_COMPAT[currentProduct.type]
  const sugerir = currentCategory ? COMPATIBILITY_MATRIX[currentCategory].sugerir : FALLBACK_SUGERIR

  const results: Product[] = []
  const usedIds = new Set([currentProduct.id])

  for (const category of sugerir) {
    if (results.length >= max) break
    const product = pickBestProduct(allProducts, category, usedIds)
    if (product) {
      results.push(product)
      usedIds.add(product.id)
    }
  }

  return results
}
