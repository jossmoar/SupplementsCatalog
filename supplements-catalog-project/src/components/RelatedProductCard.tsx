import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Product } from '../types/product'
import { money } from '../utils/whatsapp'
import { getProductPrice } from '../utils/pricing'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

interface Props {
  product: Product
}

export function RelatedProductCard({ product }: Props) {
  const { t } = useTranslation()
  const { addItem } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const detailUrl = `/catalogo/${product.id}`
  const defaultSize = product.sizes?.[0]?.label
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

  return (
    <article className="text-center">
      <div className="relative mx-auto mb-8.5 w-full" style={{ maxWidth: 240, aspectRatio: '1 / 1' }}>
        <Link
          to={detailUrl}
          className="block h-full w-full overflow-hidden rounded-full"
          style={{ background: '#EAE3D9' }}
        >
          {product.images[0] ? (
            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs" style={{ color: '#6F6250' }}>
              {t('product.noPhoto')}
            </div>
          )}
        </Link>
        <button
          type="button"
          onClick={handleAdd}
          aria-label={t('product.addNamed', { name: product.name })}
          className="absolute flex items-center justify-center rounded-full transition-colors duration-200"
          style={{
            left: '50%',
            bottom: -22,
            transform: 'translateX(-50%)',
            width: 44,
            height: 44,
            background: '#fff',
            border: '1px solid rgba(26,26,26,.1)',
            boxShadow: '0 6px 18px rgba(26,26,26,.12)',
            color: '#1A1A1A',
            fontSize: 19,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#1A1A1A'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#fff'
            e.currentTarget.style.color = '#1A1A1A'
          }}
        >
          +
        </button>
      </div>

      <h3
        style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 400,
          fontSize: 17,
          lineHeight: 1.3,
          color: '#1A1A1A',
          textWrap: 'pretty',
        }}
      >
        {product.name}
      </h3>
      {meta && (
        <p style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300, fontSize: 12, color: '#6F6250', marginTop: 8 }}>
          {meta}
        </p>
      )}
      <p
        style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 400,
          fontSize: 17,
          color: '#1A1A1A',
          marginTop: 10,
        }}
      >
        {money(getProductPrice(product, defaultSize))}
      </p>
      <Link
        to={detailUrl}
        className="mt-3 inline-block uppercase transition-colors duration-200"
        style={{
          fontSize: 11,
          letterSpacing: '.16em',
          color: '#1A1A1A',
          borderBottom: '1px solid rgba(26,26,26,.35)',
          paddingBottom: 3,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#6F6250')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#1A1A1A')}
      >
        {t('product.viewDetail')} →
      </Link>
    </article>
  )
}
