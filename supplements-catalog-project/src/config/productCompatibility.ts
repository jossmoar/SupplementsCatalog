import type { ProductType } from '../types/product'

/**
 * Categorías funcionales usadas por la matriz de combinaciones seguras
 * (ver "Suplementos: Combinaciones Seguras + Especificación Técnica").
 * No son 1:1 con ProductType del catálogo: el catálogo aún no vende
 * BCAA, Caseína ni Omega-3 por separado, así que esas entradas quedan
 * listas para cuando existan productos de esas categorías.
 */
export type CompatibilityCategory =
  | 'creatina'
  | 'proteina'
  | 'bcaa'
  | 'caseina'
  | 'multivitaminico'
  | 'omega-3'

interface CompatibilityEntry {
  sugerir: CompatibilityCategory[]
  excluir: CompatibilityCategory[]
}

export const COMPATIBILITY_MATRIX: Record<CompatibilityCategory, CompatibilityEntry> = {
  creatina: { sugerir: ['proteina', 'multivitaminico', 'omega-3', 'caseina'], excluir: ['bcaa'] },
  proteina: { sugerir: ['creatina', 'multivitaminico', 'omega-3', 'caseina'], excluir: ['bcaa'] },
  bcaa: { sugerir: ['creatina', 'multivitaminico', 'omega-3'], excluir: ['proteina', 'caseina'] },
  caseina: { sugerir: ['proteina', 'creatina', 'multivitaminico', 'omega-3'], excluir: ['bcaa'] },
  multivitaminico: { sugerir: ['proteina', 'creatina', 'omega-3', 'caseina'], excluir: ['bcaa'] },
  'omega-3': { sugerir: ['proteina', 'creatina', 'multivitaminico', 'caseina'], excluir: ['bcaa'] },
}

/** Respaldo cuando la categoría del producto no está en la matriz (producto nuevo o mal clasificado). */
export const FALLBACK_SUGERIR: CompatibilityCategory[] = ['multivitaminico', 'omega-3']

/**
 * Mapa del ProductType real del catálogo a la categoría funcional de la matriz.
 * Colágeno, Bienestar y Accesorios no tienen una función equivalente clara en la
 * matriz, así que se quedan sin mapear y usan el respaldo universal (caso borde
 * de la especificación: "categoría no existe en la matriz").
 */
export const PRODUCT_TYPE_TO_COMPAT: Partial<Record<ProductType, CompatibilityCategory>> = {
  proteinas: 'proteina',
  creatinas: 'creatina',
  vitaminas: 'multivitaminico',
}
