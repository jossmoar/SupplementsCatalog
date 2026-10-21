import type { Product } from '../types/product'

/** Stock del tamaño elegido. Si el tamaño no tiene stock propio (productos viejos), se usa el stock general. */
export function getSizeStock(product: Product, size?: string): number {
  if (!product.sizes || product.sizes.length === 0) return product.stock
  if (size === undefined) return getTotalStock(product)
  const match = product.sizes.find((s) => s.label === size)
  if (!match) return 0
  return match.stock ?? product.stock
}

/** Stock total: la suma de los tamaños cuando todos tienen stock propio; si no, el stock general. */
export function getTotalStock(product: Product): number {
  const sizes = product.sizes
  if (sizes && sizes.length > 0 && sizes.every((s) => s.stock !== undefined)) {
    return sizes.reduce((sum, s) => sum + (s.stock ?? 0), 0)
  }
  return product.stock
}

/** Tamaño que se elige por defecto: el más barato con stock; si todos están agotados, el más barato. */
export function getDefaultSize(product: Product): string | undefined {
  const sizes = product.sizes
  if (!sizes || sizes.length === 0) return undefined
  const inStock = sizes.filter((s) => getSizeStock(product, s.label) > 0)
  const pool = inStock.length > 0 ? inStock : sizes
  return pool.reduce((min, s) => (s.price < min.price ? s : min)).label
}
