import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Product } from '../types/product'
import { money } from '../utils/whatsapp'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

interface Props {
  product: Product
  aosDelay?: number
}

export function ProductCard({ product, aosDelay = 0 }: Props) {
  const { t } = useTranslation()
  const { addItem } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const teaser = product.benefits[0] ?? product.presentation

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }
    addItem(product, 1)
  }

  return (
    <Link
      to={`/catalogo/${product.id}`}
      className="flex flex-col gap-2"
      data-aos="fade-up"
      data-aos-delay={aosDelay}
    >
      <div className="relative aspect-4/5 w-full overflow-hidden bg-beige">
        {product.images[0] ? (
          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-taupe">
            {t('product.noPhoto')}
          </div>
        )}
        <button
          onClick={handleAdd}
          aria-label={t('product.addToCart')}
          className="absolute right-2 bottom-2 flex h-7.5 w-7.5 items-center justify-center rounded-full bg-cream text-base text-ink"
        >
          +
        </button>
      </div>
      <p className="text-[12.5px] leading-snug text-ink">{product.name}</p>
      {teaser && <p className="text-[11px] text-olive">{teaser}</p>}
      <p className="text-[13.5px] text-ink">{money(product.price)}</p>
    </Link>
  )
}
