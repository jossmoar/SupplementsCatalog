import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useProducts } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { money } from '../utils/whatsapp'
import { ProductCard } from '../components/ProductCard'

export function ProductDetail() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, loading } = useProducts()
  const { addItem } = useCart()
  const { user } = useAuth()
  const [qty, setQty] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  const product = products.find((p) => p.id === id)

  const related = useMemo(() => {
    if (!product) return []
    return products.filter((p) => p.id !== product.id && p.type === product.type).slice(0, 3)
  }, [products, product])

  if (loading) {
    return <p className="py-24 text-center text-taupe">{t('common.loading')}</p>
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="section-title">{t('product.notFound')}</h1>
        <Link to="/catalogo" className="btn-secondary mt-6 inline-flex">
          {t('nav.catalog')}
        </Link>
      </div>
    )
  }

  const images = product.images.length > 0 ? product.images : [undefined]
  const total = money(product.price * qty)

  const handleAdd = () => {
    if (!user) {
      navigate('/login')
      return
    }
    addItem(product, qty)
  }

  return (
    <div className="pb-28 md:pb-16">
      <div className="mx-auto max-w-[1440px] md:grid md:grid-cols-[1fr_460px] md:gap-14 md:px-14 md:pt-9">
        {/* Gallery */}
        <div>
          <div className="hidden px-14 pb-4 text-[11px] tracking-[0.14em] text-taupe uppercase md:block md:px-0">
            <Link to="/catalogo" className="hover:text-ink">
              {t('nav.catalog')}
            </Link>{' '}
            / {t(`productType.${product.type}`)}
          </div>

          <div className="relative h-[400px] bg-beige md:hidden">
            {images[activeImage] && (
              <img src={images[activeImage]} alt={product.name} className="h-full w-full object-cover" />
            )}
            <button
              onClick={() => navigate(-1)}
              aria-label={t('common.back')}
              className="absolute top-16 left-4.5 flex h-9 w-9 items-center justify-center rounded-full bg-cream/90"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#14120F" strokeWidth="1.5">
                <path d="M14 6l-6 6 6 6" />
              </svg>
            </button>
          </div>

          <div className="hidden gap-3.5 md:grid md:grid-cols-[74px_1fr]">
            {images.length > 1 && (
              <div className="flex flex-col gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`aspect-4/5 overflow-hidden bg-beige ${i === activeImage ? 'outline outline-ink' : ''}`}
                  >
                    {img && <img src={img} alt="" className="h-full w-full object-cover" />}
                  </button>
                ))}
              </div>
            )}
            <div className={`aspect-4/5 overflow-hidden bg-beige ${images.length === 1 ? 'col-span-2' : ''}`}>
              {images[activeImage] && (
                <img src={images[activeImage]} alt={product.name} className="h-full w-full object-cover" />
              )}
            </div>
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 px-5 pt-3 md:hidden">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-15 w-13 overflow-hidden bg-beige ${i === activeImage ? 'outline outline-ink' : ''}`}
                >
                  {img && <img src={img} alt="" className="h-full w-full object-cover" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-5 pt-5.5 md:px-0 md:pt-11" data-aos="fade-up">
          <span className="eyebrow">{t(`productType.${product.type}`)}</span>
          <h1 className="mt-2 font-serif text-[32px] leading-[1.08] text-ink md:text-[46px] md:leading-[1.06]">
            {product.name}
          </h1>
          <div className="mt-3.5 flex items-baseline gap-3">
            <div className="text-[22px] text-ink md:text-[26px]">{money(product.price)}</div>
          </div>
          {product.presentation && (
            <p className="mt-3.5 text-[13.5px] leading-[1.65] text-ink/62 md:text-[14.5px] md:leading-[1.7]">
              {product.presentation}
            </p>
          )}

          <div className="mt-6.5 hidden items-center gap-3.5 md:flex">
            <div className="flex items-center rounded-xs border border-beige-dark">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-12.5 w-10.5 items-center justify-center text-ink"
              >
                −
              </button>
              <div className="w-7 text-center text-[15px] text-ink">{qty}</div>
              <button
                onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
                className="flex h-12.5 w-10.5 items-center justify-center text-ink"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={product.stock <= 0}
              className="flex h-12.5 flex-1 items-center justify-center gap-2.5 rounded-xs bg-ink text-[13.5px] tracking-wide text-cream disabled:opacity-40"
            >
              <span>{t('product.addToCart')}</span>
              <span className="opacity-55">·</span>
              <span>{total}</span>
            </button>
          </div>

          {product.stock <= 0 && (
            <p className="mt-3 text-xs text-taupe">{t('product.outOfStock')}</p>
          )}

          {product.benefits.length > 0 && (
            <div className="mt-6.5">
              <p className="eyebrow mb-1.5">{t('product.benefits')}</p>
              {product.benefits.map((b, i) => (
                <div key={i} className="flex gap-3 border-t border-hairline py-2.75">
                  <div className="mt-1.75 h-1.25 w-1.25 flex-none rounded-full bg-olive" />
                  <div className="flex-1 text-[13px] leading-[1.5] text-ink md:text-[13.5px]">{b}</div>
                </div>
              ))}
            </div>
          )}

          {(product.presentation || product.usage) && (
            <div className="mt-6.5 flex gap-6.5 bg-beige p-5">
              {product.presentation && (
                <div className="flex-1">
                  <p className="text-[9.5px] tracking-[0.18em] text-taupe uppercase">{t('product.presentation')}</p>
                  <p className="mt-1.75 text-[13px] leading-[1.5] text-ink md:text-[13.5px]">{product.presentation}</p>
                </div>
              )}
              {product.usage && (
                <div className="flex-1">
                  <p className="text-[9.5px] tracking-[0.18em] text-taupe uppercase">{t('product.usage')}</p>
                  <p className="mt-1.75 text-[13px] leading-[1.5] text-ink md:text-[13.5px]">{product.usage}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-8 px-5 md:px-14 md:pt-18">
          <p className="eyebrow mb-3.5 md:hidden">{t('product.combinesWith')}</p>
          <p className="hidden font-serif text-[32px] text-ink md:mb-6.5 md:block">{t('product.combinesWith')}</p>
          <div className="-mx-5 flex gap-3 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-3 md:gap-6.5 md:overflow-visible md:px-0">
            {related.map((p) => (
              <div key={p.id} className="w-32.5 flex-none md:w-auto">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-hairline bg-cream/96 px-5 py-3.5 pb-7 backdrop-blur md:hidden">
        <div className="flex items-center rounded-xs border border-beige-dark">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-11.5 w-9.5 items-center justify-center text-ink"
          >
            −
          </button>
          <div className="w-6.5 text-center text-sm text-ink">{qty}</div>
          <button
            onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
            className="flex h-11.5 w-9.5 items-center justify-center text-ink"
          >
            +
          </button>
        </div>
        <button
          onClick={handleAdd}
          disabled={product.stock <= 0}
          className="flex h-11.5 flex-1 items-center justify-center gap-2.5 rounded-xs bg-ink text-[13px] tracking-wide text-cream disabled:opacity-40"
        >
          <span>{t('product.addToCart')}</span>
          <span className="opacity-60">·</span>
          <span>{total}</span>
        </button>
      </div>
    </div>
  )
}
