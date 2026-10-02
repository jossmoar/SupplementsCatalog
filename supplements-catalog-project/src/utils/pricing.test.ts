import { describe, expect, it } from 'vitest'
import type { Product } from '../types/product'
import { getProductPrice } from './pricing'

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'p1',
    name: 'Producto',
    gender: 'unisex',
    type: 'proteinas',
    price: 10000,
    images: [],
    benefits: [],
    presentation: '1 unidad',
    usage: '',
    stock: 10,
    ...overrides,
  }
}

describe('getProductPrice', () => {
  it('usa el precio base cuando el producto no tiene tamaños', () => {
    const product = makeProduct({ price: 15000 })
    expect(getProductPrice(product)).toBe(15000)
  })

  it('usa el precio del tamaño elegido', () => {
    const product = makeProduct({
      price: 18000,
      sizes: [
        { label: '1 lb', price: 18000 },
        { label: '2 lb', price: 29900 },
        { label: '5 lb', price: 59900 },
      ],
    })
    expect(getProductPrice(product, '2 lb')).toBe(29900)
    expect(getProductPrice(product, '5 lb')).toBe(59900)
  })

  it('cae al primer tamaño si no se eligió ninguno o no existe', () => {
    const product = makeProduct({
      sizes: [
        { label: '1 lb', price: 18000 },
        { label: '2 lb', price: 29900 },
      ],
    })
    expect(getProductPrice(product)).toBe(18000)
    expect(getProductPrice(product, 'talla-inexistente')).toBe(18000)
  })
})
