import type { Product } from '../types/product'

/** Precio más bajo entre los tamaños; es el que se guarda como `price` del producto. */
export function getLowestPrice(sizes: { price: number }[]): number {
  return Math.min(...sizes.map((s) => s.price))
}

/** Tamaño que se elige por defecto: el más barato. */
export function getDefaultSize(product: Product): string | undefined {
  const sizes = product.sizes
  if (!sizes || sizes.length === 0) return undefined
  return sizes.reduce((min, s) => (s.price < min.price ? s : min)).label
}

/** Sabor que se elige por defecto: el primero de la lista. */
export function getDefaultFlavor(product: Product): string | undefined {
  return product.flavors?.[0]?.name
}

/** Hay que entrar al detalle para elegir sabor cuando el producto tiene más de uno. */
export function needsFlavorChoice(product: Product): boolean {
  return (product.flavors?.length ?? 0) > 1
}

/** Foto del sabor elegido; si no tiene, la foto principal del producto. */
export function getFlavorImage(product: Product, flavor?: string): string {
  const match = product.flavors?.find((f) => f.name === flavor)
  return match?.image || product.images[0] || ''
}

/** Precio del tamaño elegido (o del más barato si no se eligió); si el producto no maneja tamaños, el precio base. */
export function getProductPrice(product: Product, size?: string): number {
  if (product.sizes && product.sizes.length > 0) {
    const match = product.sizes.find((s) => s.label === size)
    return match ? match.price : getLowestPrice(product.sizes)
  }
  return product.price
}
