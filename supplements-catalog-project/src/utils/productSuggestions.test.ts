import { describe, expect, it } from 'vitest'
import type { Product } from '../types/product'
import { getSuggestedProducts } from './productSuggestions'
import { COMPATIBILITY_MATRIX, PRODUCT_TYPE_TO_COMPAT } from '../config/productCompatibility'

function makeProduct(overrides: Partial<Product> & Pick<Product, 'id' | 'type'>): Product {
  return {
    name: `Producto ${overrides.id}`,
    gender: 'unisex',
    price: 10000,
    images: [],
    benefits: [],
    presentation: '1 unidad',
    usage: '',
    stock: 10,
    ...overrides,
  }
}

describe('getSuggestedProducts', () => {
  const catalog: Product[] = [
    makeProduct({ id: 'creatina-1', type: 'creatinas' }),
    makeProduct({ id: 'creatina-2', type: 'creatinas' }),
    makeProduct({ id: 'proteina-1', type: 'proteinas' }),
    makeProduct({ id: 'vitaminas-1', type: 'vitaminas' }),
    makeProduct({ id: 'colageno-1', type: 'colageno' }),
    makeProduct({ id: 'bienestar-1', type: 'bienestar' }),
    makeProduct({ id: 'accesorios-1', type: 'accesorios' }),
  ]

  it('nunca sugiere la misma categoría del producto que se está viendo', () => {
    const current = catalog.find((p) => p.id === 'creatina-1')!
    const suggestions = getSuggestedProducts(current, catalog)
    for (const s of suggestions) {
      expect(s.type).not.toBe(current.type)
    }
  })

  it('nunca sugiere el mismo producto', () => {
    const current = catalog.find((p) => p.id === 'proteina-1')!
    const suggestions = getSuggestedProducts(current, catalog)
    expect(suggestions.some((s) => s.id === current.id)).toBe(false)
  })

  it('la matriz nunca junta BCAA con Proteína o Caseína en la misma lista de "sugerir"', () => {
    // El catálogo aún no vende BCAA/Caseína como categorías propias, así que esta
    // regla se verifica sobre los datos de configuración: si algún día se agregan
    // esos ProductType, la matriz ya garantiza que nunca se recomiendan juntos.
    for (const entry of Object.values(COMPATIBILITY_MATRIX)) {
      const hasBcaa = entry.sugerir.includes('bcaa')
      const hasProteinOrCasein = entry.sugerir.includes('proteina') || entry.sugerir.includes('caseina')
      expect(hasBcaa && hasProteinOrCasein).toBe(false)
    }
  })

  it('devuelve máximo 4 resultados', () => {
    const current = catalog.find((p) => p.id === 'creatina-1')!
    const suggestions = getSuggestedProducts(current, catalog, 4)
    expect(suggestions.length).toBeLessThanOrEqual(4)
  })

  it('excluye productos sin stock', () => {
    const noStock = catalog.map((p) => (p.id === 'proteina-1' ? { ...p, stock: 0 } : p))
    const current = noStock.find((p) => p.id === 'creatina-1')!
    const suggestions = getSuggestedProducts(current, noStock)
    expect(suggestions.some((s) => s.id === 'proteina-1')).toBe(false)
  })

  it('usa el respaldo universal (multivitamínico + omega-3) para categorías fuera de la matriz', () => {
    const current = catalog.find((p) => p.id === 'accesorios-1')!
    const suggestions = getSuggestedProducts(current, catalog)
    for (const s of suggestions) {
      expect(PRODUCT_TYPE_TO_COMPAT[s.type]).toBe('multivitaminico')
    }
  })

  it('devuelve una lista vacía si no hay productos disponibles en ninguna categoría sugerida', () => {
    const current = makeProduct({ id: 'creatina-solo', type: 'creatinas' })
    const suggestions = getSuggestedProducts(current, [current])
    expect(suggestions).toEqual([])
  })
})
