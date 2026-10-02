import type { Product } from '../types/product'

/** Precio del tamaño elegido (o del primer tamaño disponible); si el producto no maneja tamaños, el precio base. */
export function getProductPrice(product: Product, size?: string): number {
  if (product.sizes && product.sizes.length > 0) {
    const match = product.sizes.find((s) => s.label === size) ?? product.sizes[0]
    return match.price
  }
  return product.price
}
