import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CartItem, Product } from '../types/product'
import { getFlavorImage, getProductPrice } from '../utils/pricing'

interface CartContextValue {
  items: CartItem[]
  addItem: (product: Product, quantity: number, size?: string, flavor?: string) => void
  removeItem: (productId: string, size?: string, flavor?: string) => void
  setQuantity: (productId: string, quantity: number, size?: string, flavor?: string) => void
  clear: () => void
  total: number
  count: number
}

const sameLine = (item: CartItem, productId: string, size?: string, flavor?: string) =>
  item.productId === productId && item.size === size && item.flavor === flavor

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

  const addItem = (product: Product, quantity: number, size?: string, flavor?: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => sameLine(i, product.id, size, flavor))
      if (existing) {
        return prev.map((i) =>
          sameLine(i, product.id, size, flavor) ? { ...i, quantity: i.quantity + quantity } : i,
        )
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: getProductPrice(product, size),
          image: getFlavorImage(product, flavor),
          quantity,
          size,
          flavor,
        },
      ]
    })
  }

  const removeItem = (productId: string, size?: string, flavor?: string) => {
    setItems((prev) => prev.filter((i) => !sameLine(i, productId, size, flavor)))
  }

  const setQuantity = (productId: string, quantity: number, size?: string, flavor?: string) => {
    if (quantity <= 0) {
      removeItem(productId, size, flavor)
      return
    }
    setItems((prev) =>
      prev.map((i) => (sameLine(i, productId, size, flavor) ? { ...i, quantity } : i)),
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
