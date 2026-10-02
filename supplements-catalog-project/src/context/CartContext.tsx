import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CartItem, Product } from '../types/product'
import { getProductPrice } from '../utils/pricing'

interface CartContextValue {
  items: CartItem[]
  addItem: (product: Product, quantity: number, size?: string) => void
  removeItem: (productId: string, size?: string) => void
  setQuantity: (productId: string, quantity: number, size?: string) => void
  clear: () => void
  total: number
  count: number
}

const sameLine = (item: CartItem, productId: string, size?: string) =>
  item.productId === productId && item.size === size

const CartContext = createContext<CartContextValue | undefined>(undefined)
const STORAGE_KEY = 'supplements-catalog-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as CartItem[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (product: Product, quantity: number, size?: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => sameLine(i, product.id, size))
      if (existing) {
        return prev.map((i) =>
          sameLine(i, product.id, size) ? { ...i, quantity: i.quantity + quantity } : i,
        )
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: getProductPrice(product, size),
          image: product.images[0] ?? '',
          quantity,
          size,
        },
      ]
    })
  }

  const removeItem = (productId: string, size?: string) => {
    setItems((prev) => prev.filter((i) => !sameLine(i, productId, size)))
  }

  const setQuantity = (productId: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeItem(productId, size)
      return
    }
    setItems((prev) =>
      prev.map((i) => (sameLine(i, productId, size) ? { ...i, quantity } : i)),
    )
  }

  const clear = () => setItems([])

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  )
  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, setQuantity, clear, total, count }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}
