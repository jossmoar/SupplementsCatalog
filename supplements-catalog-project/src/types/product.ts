export type Gender = 'unisex' | 'hombres' | 'mujeres'

export type ProductType =
  | 'proteinas'
  | 'creatinas'
  | 'vitaminas'
  | 'colageno'
  | 'bienestar'
  | 'accesorios'

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  proteinas: 'Proteínas',
  creatinas: 'Creatinas',
  vitaminas: 'Vitaminas',
  colageno: 'Colágeno',
  bienestar: 'Bienestar',
  accesorios: 'Accesorios',
}

export const GENDER_LABELS: Record<Gender, string> = {
  unisex: 'Unisex',
  hombres: 'Hombres',
  mujeres: 'Mujeres',
}

export interface ProductSize {
  label: string
  price: number
}

export interface Product {
  id: string
  name: string
  gender: Gender
  type: ProductType
  price: number
  images: string[]
  benefits: string[]
  presentation: string
  usage: string
  stock: number
  sizes?: ProductSize[]
  recommended?: boolean
  createdAt?: number
}

/** Los tamaños disponibles solo aplican a proteínas (libras) y creatinas (gramos). */
export const SIZE_OPTIONS: Partial<Record<ProductType, string[]>> = {
  proteinas: ['1 lb', '2 lb', '3 lb', '4 lb', '5 lb'],
  creatinas: ['100 g', '200 g', '300 g', '400 g', '500 g', '600 g', '700 g'],
}

export const PRESENTATION_OPTIONS = [
  'Dosis en polvo',
  'Dosis en cápsula',
  'Bebida en presentación individual',
] as const

export interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  size?: string
}
