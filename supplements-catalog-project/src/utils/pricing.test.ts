import { describe, expect, it } from 'vitest'
import type { Product } from '../types/product'
import {
  getDefaultFlavor,
  getDefaultSize,
  getFlavorImage,
  getLowestPrice,
  getProductPrice,
  needsFlavorChoice,
} from './pricing'

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

  it('cae al tamaño más barato si no se eligió ninguno o no existe', () => {
    const product = makeProduct({
      sizes: [
        { label: '5 lb', price: 59900 },
        { label: '1 lb', price: 18000 },
        { label: '2 lb', price: 29900 },
      ],
    })
    expect(getProductPrice(product)).toBe(18000)
    expect(getProductPrice(product, 'talla-inexistente')).toBe(18000)
  })
})

describe('getLowestPrice', () => {
  it('devuelve el precio más bajo sin importar el orden', () => {
    expect(getLowestPrice([{ price: 28000 }, { price: 20900 }, { price: 35000 }])).toBe(20900)
  })
})

describe('getDefaultSize', () => {
  it('elige el tamaño más barato', () => {
    const product = makeProduct({
      sizes: [
        { label: '5 lb', price: 59900 },
        { label: '1 lb', price: 18000 },
        { label: '2 lb', price: 29900 },
      ],
    })
    expect(getDefaultSize(product)).toBe('1 lb')
  })

  it('no elige tamaño si el producto no maneja tamaños', () => {
    expect(getDefaultSize(makeProduct())).toBeUndefined()
  })
})

describe('sabores', () => {
  const product = makeProduct({
    images: ['foto-uva.jpg', 'foto-sandia.jpg'],
    flavors: [
      { name: 'Grape', image: 'foto-uva.jpg' },
      { name: 'Watermelon', image: 'foto-sandia.jpg' },
      { name: 'Frozen Bombsicle' },
    ],
  })

  it('elige el primer sabor por defecto', () => {
    expect(getDefaultFlavor(product)).toBe('Grape')
    expect(getDefaultFlavor(makeProduct())).toBeUndefined()
  })

  it('pide elegir sabor solo cuando hay más de uno', () => {
    expect(needsFlavorChoice(product)).toBe(true)
    expect(needsFlavorChoice(makeProduct({ flavors: [{ name: 'Vainilla' }] }))).toBe(false)
    expect(needsFlavorChoice(makeProduct())).toBe(false)
  })

  it('usa la foto del sabor, o la principal si el sabor no tiene', () => {
    expect(getFlavorImage(product, 'Watermelon')).toBe('foto-sandia.jpg')
    expect(getFlavorImage(product, 'Frozen Bombsicle')).toBe('foto-uva.jpg')
    expect(getFlavorImage(makeProduct())).toBe('')
  })
})
