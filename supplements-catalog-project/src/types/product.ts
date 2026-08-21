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
  recommended?: boolean
  createdAt?: number
}

export interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
}
