import { describe, expect, it } from 'vitest'
import type { Product } from '../types/product'
import { getDefaultSize, getSizeStock, getTotalStock } from './stock'

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'p1',
    name: 'Producto',
    gender: 'unisex',
    type: 'proteinas',
    price: 10000,
    images: [],
    benefits: [],
    presentation: 'powder',
    usage: '',
    stock: 7,
    ...overrides,
  }
}

describe('getSizeStock', () => {
  it('usa el stock general cuando el producto no tiene tamaños', () => {
    expect(getSizeStock(makeProduct())).toBe(7)
  })

  it('usa el stock propio de cada tamaño', () => {
    const product = makeProduct({
      sizes: [
        { label: '2 lb', price: 20900, stock: 2 },
        { label: '5 lb', price: 28000, stock: 0 },
      ],
    })
    expect(getSizeStock(product, '2 lb')).toBe(2)
    expect(getSizeStock(product, '5 lb')).toBe(0)
    expect(getSizeStock(product, '9 lb')).toBe(0)
  })

  it('cae al stock general si el tamaño no tiene stock propio (productos viejos)', () => {
    const product = makeProduct({ stock: 4, sizes: [{ label: '2 lb', price: 20900 }] })
    expect(getSizeStock(product, '2 lb')).toBe(4)
  })
})

describe('getTotalStock', () => {
  it('suma los tamaños cuando todos tienen stock propio', () => {
    const product = makeProduct({
      stock: 99,
      sizes: [
        { label: '2 lb', price: 20900, stock: 2 },
        { label: '5 lb', price: 28000, stock: 3 },
      ],
    })
    expect(getTotalStock(product)).toBe(5)
  })

  it('usa el stock general si algún tamaño no tiene stock propio', () => {
    const product = makeProduct({ stock: 4, sizes: [{ label: '2 lb', price: 20900 }] })
    expect(getTotalStock(product)).toBe(4)
  })

  it('es 0 cuando todos los tamaños están agotados', () => {
    const product = makeProduct({
      sizes: [
        { label: '2 lb', price: 20900, stock: 0 },
        { label: '5 lb', price: 28000, stock: 0 },
      ],
    })
    expect(getTotalStock(product)).toBe(0)
  })
})

describe('getDefaultSize', () => {
  it('no devuelve nada si el producto no tiene tamaños', () => {
    expect(getDefaultSize(makeProduct())).toBeUndefined()
  })

  it('elige el más barato con stock, sin importar el orden', () => {
    const product = makeProduct({
      sizes: [
        { label: '5 lb', price: 28000, stock: 1 },
        { label: '1 lb', price: 12000, stock: 0 },
        { label: '2 lb', price: 20900, stock: 2 },
      ],
    })
    expect(getDefaultSize(product)).toBe('2 lb')
  })

  it('elige el más barato si todos están agotados', () => {
    const product = makeProduct({
      sizes: [
        { label: '5 lb', price: 28000, stock: 0 },
        { label: '2 lb', price: 20900, stock: 0 },
      ],
    })
    expect(getDefaultSize(product)).toBe('2 lb')
  })
})
