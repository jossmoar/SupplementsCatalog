import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Product } from '../types/product'
import { money } from '../utils/whatsapp'
import { getProductPrice } from '../utils/pricing'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

interface Props {
  product: Product
  aosDelay?: number
}

export function ProductCircleCard({ product, aosDelay = 0 }: Props) {
  const { t } = useTranslation()
  const { items, addItem, setQuantity } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const detailUrl = `/catalogo/${product.id}`
  const defaultSize = product.sizes?.[0]?.label
  const quantity = items.find((i) => i.productId === product.id && i.size === defaultSize)?.quantity ?? 0
  const meta = [t(`productType.${product.type}`), product.presentation].filter(Boolean).join(' · ')

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      navigate('/login')
      return
    }
    addItem(product, 1, defaultSize)
  }

  const handleStep = (e: React.MouseEvent, delta: number) => {
    e.preventDefault()
    e.stopPropagation()
    setQuantity(product.id, quantity + delta, defaultSize)
  }

  return (
    <article className="text-center" data-aos="fade-up" data-aos-delay={aosDelay}>
      <div className="relative" style={{ paddingBottom: 26 }}>
        <Link
          to={detailUrl}
          className="block aspect-square overflow-hidden rounded-full transition-[transform,box-shadow] duration-300 ease-out hover:scale-[1.025] hover:shadow-[0_26px_48px_-30px_rgba(20,24,51,0.55)]"
          style={{ background: '#EAE3D9' }}
        >
          {product.images[0] ? (
            <img src={product.images[0]} alt={product.name} className="block h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs" style={{ color: '#95847D' }}>
              {t('product.noPhoto')}
            </div>
          )}
        </Link>

        <div
          className="absolute flex items-center justify-center"
          style={{ left: '50%', bottom: 0, transform: 'translateX(-50%)' }}
        >
          {quantity > 0 ? (
            <div
              className="flex items-center"
              style={{
                gap: 6,
                height: 52,
                padding: '0 8px',
                borderRadius: 26,
                background: '#141833',
                color: '#F7F4EE',
                boxShadow: '0 10px 24px -14px rgba(20,24,51,0.5)',
              }}
            >
              <button
                type="button"
                onClick={(e) => handleStep(e, -1)}
                aria-label={t('product.removeOne')}
                className="flex items-center justify-center rounded-full"
                style={{ width: 36, height: 36, background: 'transparent', color: '#F7F4EE', fontSize: 19 }}
              >
                −
              </button>
              <span aria-live="polite" className="text-center" style={{ minWidth: 22, fontSize: 16 }}>
                {quantity}
              </span>
              <button
                type="button"
                onClick={(e) => handleStep(e, 1)}
                aria-label={t('product.addOne')}
                className="flex items-center justify-center rounded-full"
                style={{ width: 36, height: 36, background: 'transparent', color: '#F7F4EE', fontSize: 19 }}
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              aria-label={t('product.addNamed', { name: product.name })}
              className="flex items-center justify-center rounded-full transition-colors duration-200"
              style={{
                width: 52,
                height: 52,
                border: '1px solid rgba(20,24,51,.18)',
                background: '#FAF8F4',
                color: '#141833',
                fontSize: 22,
                boxShadow: '0 10px 24px -14px rgba(20,24,51,0.5)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#141833'
                e.currentTarget.style.color = '#F7F4EE'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FAF8F4'
                e.currentTarget.style.color = '#141833'
              }}
            >
              +
            </button>
          )}
        </div>
      </div>

      <h3 style={{ fontSize: 18, marginTop: 36, color: '#141833' }}>{product.name}</h3>
      {meta && (
        <p style={{ fontSize: 13, fontWeight: 300, letterSpacing: '.06em', color: '#95847D', marginTop: 8 }}>
          {meta}
        </p>
      )}
      <p className="font-serif" style={{ fontSize: 20, marginTop: 14, color: '#141833' }}>
        {money(getProductPrice(product, defaultSize))}
      </p>
      <Link
        to={detailUrl}
        className="inline-block transition-colors duration-200"
        style={{
          marginTop: 16,
          fontSize: 13,
          letterSpacing: '.1em',
          color: '#5D6472',
          borderBottom: '1px solid rgba(20,24,51,.28)',
          paddingBottom: 4,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#6E7551')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#5D6472')}
      >
        {t('product.viewDetail')} →
      </Link>
    </article>
  )
}
