import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useProducts } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { money } from '../utils/whatsapp'
import { RelatedProductCard } from '../components/RelatedProductCard'
import { getSuggestedProducts } from '../utils/productSuggestions'
import { useScrollRail } from '../hooks/useScrollRail'
import { RailNavButton } from '../components/RailNavButton'

const RELATED_CARD_WIDTH = 240
const RELATED_GAP = 36

type AccordionKey = 'benefits' | 'usage' | 'presentation'

export function ProductDetail() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, loading } = useProducts()
  const { addItem } = useCart()
  const { user } = useAuth()

  const [qty, setQty] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [added, setAdded] = useState(false)
  const [openKey, setOpenKey] = useState<AccordionKey | null>('benefits')
  const imgRef = useRef<HTMLImageElement>(null)
  const { railRef, canScrollLeft, canScrollRight, scrollByCards } = useScrollRail(RELATED_CARD_WIDTH, RELATED_GAP)

  const product = products.find((p) => p.id === id)

  const related = useMemo(() => {
    if (!product) return []
    return getSuggestedProducts(product, products, 4)
  }, [products, product])

  // Parallax suave de la imagen del panel sticky, respetando prefers-reduced-motion.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const onScroll = () => {
      const node = imgRef.current
      if (!node) return
      const parent = node.parentElement
      const slack = parent ? Math.max(0, (node.offsetHeight - parent.clientHeight) / 2) : 40
      const y = window.scrollY || 0
      const d = Math.max(-slack, Math.min(slack, -y * 0.04))
      node.style.transform = `translate3d(0, ${d}px, 0)`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [product?.id])

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

  const images = product.images
  const crumb = `${t('nav.catalog').toUpperCase()} / ${t(`productType.${product.type}`).toUpperCase()}`
  const nameWords = product.name.split(' ')
  const titleLine1 = nameWords[0] ?? product.name
  const titleLine2 = nameWords.slice(1).join(' ')

  const facts: Array<{ value: string; label: string }> = [
    { value: t(`productType.${product.type}`), label: t('product.factCategory') },
    { value: t(`gender.${product.gender}`), label: t('product.factFor') },
    { value: String(product.stock), label: t('product.factStock') },
    { value: product.presentation.split('·')[0].trim() || '—', label: t('product.presentation') },
  ]

  const leadHeadline = product.benefits[0] ?? product.name
  const leadBody = product.benefits.slice(1).join('. ')

  const accordionItems: Array<{ key: AccordionKey; title: string; body: string }> = [
    product.benefits.length > 0 && { key: 'benefits' as const, title: t('product.benefits'), body: product.benefits.join('\n') },
    product.usage && { key: 'usage' as const, title: t('product.usage'), body: product.usage },
    product.presentation && { key: 'presentation' as const, title: t('product.presentation'), body: product.presentation },
  ].filter((item): item is { key: AccordionKey; title: string; body: string } => !!item)

  const handleAdd = () => {
    if (!user) {
      navigate('/login')
      return
    }
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  const cellClass = (i: number) => {
    const desktop = i > 0 ? 'pl-8 border-l border-l-[rgba(20,24,51,0.12)]' : ''
    const mobileReset = 'max-sm:border-l-0 max-sm:pl-0'
    const mobileRight = i % 2 === 1 ? 'max-sm:border-l max-sm:border-l-[rgba(20,24,51,0.12)] max-sm:pl-6' : ''
    return `flex-1 py-6.5 max-sm:py-5 ${desktop} ${mobileReset} ${mobileRight}`.trim()
  }

  return (
    <div>
      <section
        className="relative mx-auto grid grid-cols-[460px_minmax(0,1fr)] max-lg:block"
        style={{ maxWidth: 1120 }}
      >
        {/* Panel de imagen — sticky */}
        <div className="sticky top-[77px] flex h-[calc(100vh-77px)] items-center justify-center overflow-hidden bg-[#EAE3D9] px-16 py-14 max-xl:px-12 max-lg:static max-lg:h-[62vh] max-lg:px-10 max-lg:py-8 max-sm:px-6">
          <div
            className="pdp-spin pointer-events-none absolute"
            style={{ left: '-20%', top: '-14%', width: '140%', height: '128%' }}
          >
            <div
              className="absolute rounded-full"
              style={{
                left: '8%',
                top: '6%',
                width: '62%',
                height: '62%',
                background: 'radial-gradient(circle at 42% 38%, rgba(250,248,244,.95), rgba(250,248,244,0) 70%)',
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                right: '6%',
                bottom: '10%',
                width: '46%',
                height: '46%',
                background: 'radial-gradient(circle at 50% 50%, rgba(187,163,145,.55), rgba(187,163,145,0) 70%)',
              }}
            />
          </div>
          <div
            className="pdp-spin-rev pointer-events-none absolute"
            style={{ left: '-10%', top: '-8%', width: '120%', height: '116%' }}
          >
            <div
              className="absolute rounded-full"
              style={{
                left: '50%',
                top: '2%',
                transform: 'translateX(-50%)',
                width: '76%',
                height: '76%',
                border: '1px solid rgba(250,248,244,.7)',
              }}
            />
          </div>
          <div
            className="pdp-float pointer-events-none absolute rounded-full"
            style={{ left: '12%', top: '16%', width: 88, height: 88, background: 'rgba(250,248,244,.55)' }}
          />

          {images[activeImage] && (
            <img
              ref={imgRef}
              src={images[activeImage]}
              alt={product.name}
              className="relative block h-full max-h-125 w-full max-w-90 rounded-[999px_999px_14px_14px] object-cover object-[center_45%] shadow-[0_46px_80px_-38px_rgba(20,24,51,0.6)] max-lg:max-w-80"
            />
          )}

          <div className="absolute uppercase" style={{ left: 44, top: 36, fontSize: 12, letterSpacing: '.26em', color: '#95847D' }}>
            {crumb}
          </div>

          {product.presentation && (
            <div className="absolute flex items-center" style={{ left: 44, bottom: 40, gap: 14, color: '#5D6472' }}>
              <span style={{ width: 44, height: 1, background: 'rgba(20,24,51,.3)' }} />
              <span className="uppercase" style={{ fontSize: 12, letterSpacing: '.26em' }}>
                {product.presentation}
              </span>
            </div>
          )}

          {images.length > 1 && (
            <div className="absolute flex" style={{ right: 40, bottom: 40, gap: 9 }}>
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  aria-label={`${i + 1}`}
                  className="rounded-full"
                  style={{ width: 9, height: 9, background: i === activeImage ? '#141833' : 'rgba(20,24,51,.28)' }}
                />
              ))}
            </div>
          )}

          <div className="absolute max-lg:hidden" style={{ right: 0, top: 0, bottom: 0, width: 1, background: 'rgba(20,24,51,.12)' }} />
        </div>

        {/* Contenido */}
        <div className="pt-10 pl-12 pr-7 max-xl:px-11 max-xl:pt-14 max-lg:px-10 max-lg:pt-12 max-sm:px-6 max-sm:pt-9">
          <div>
            <h1
              data-aos="fade-up"
              className="text-[52px] leading-[1.04] tracking-[-0.015em] font-serif font-normal max-xl:text-[42px] max-sm:text-[28px]"
              style={{ color: '#141833', margin: '0 0 8px' }}
            >
              {titleLine1}
              {titleLine2 && (
                <>
                  <br />
                  <em style={{ color: '#5C6540', fontStyle: 'italic' }}>{titleLine2}</em>
                </>
              )}
            </h1>

            <div
              data-aos="fade-up"
              className="mt-10 flex border-t border-b border-t-[rgba(20,24,51,0.18)] border-b-[rgba(20,24,51,0.18)] max-sm:grid max-sm:grid-cols-2"
            >
              {facts.map((f, i) => (
                <div key={f.label} className={cellClass(i)}>
                  <div className="font-serif max-xl:text-[19px]" style={{ fontSize: 23, color: '#141833' }}>
                    {f.value}
                  </div>
                  <div className="mt-2 uppercase" style={{ fontSize: 8, letterSpacing: '.2em', color: '#95847D' }}>
                    {f.label}
                  </div>
                </div>
              ))}
            </div>

            <div data-aos="fade-up" className="mt-10 ">
              <p className="font-serif" style={{ fontSize: 26, lineHeight: 1.35, color: '#141833' }}>
                {leadHeadline}
              </p>
              {leadBody && (
                <p className="mt-6.5" style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.8, color: '#5D6472' }}>
                  {leadBody}
                </p>
              )}
            </div>

            {accordionItems.length > 0 && (
              <div data-aos="fade-up" className="mt-14 pb-27.5">
                {accordionItems.map((item, i) => {
                  const isOpen = openKey === item.key
                  const isLast = i === accordionItems.length - 1
                  return (
                    <div key={item.key}>
                      <button
                        type="button"
                        onClick={() => setOpenKey(isOpen ? null : item.key)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between border-t border-t-[rgba(20,24,51,0.18)] py-6 text-left text-[16px]"
                        style={{ color: '#141833' }}
                      >
                        <span>{item.title}</span>
                        <span style={{ fontSize: 22, color: '#95847D' }}>{isOpen ? '−' : '+'}</span>
                      </button>
                      {isOpen && (
                        <div
                          className="pb-7 whitespace-pre-line"
                          style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.7, color: '#5D6472' }}
                        >
                          {item.body}
                        </div>
                      )}
                      {isLast && <div className="border-b border-b-[rgba(20,24,51,0.18)]" />}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="pt-9">
            <div className="font-serif" style={{ fontSize: 36, lineHeight: 1, marginBottom: 10, color: '#141833' }}>
              {money(product.price)}
            </div>
            {product.presentation && (
              <div className="border-b pb-6.5" style={{ fontSize: 14, fontWeight: 300, color: '#5D6472', borderColor: 'rgba(20,24,51,.14)' }}>
                {product.presentation}
              </div>
            )}

            <div className="mt-6.5 flex items-center gap-3.5 max-sm:flex-col max-sm:items-stretch">
              <div
                className="flex items-center gap-1"
                style={{ height: 56, padding: '0 6px', border: '1px solid rgba(20,24,51,.2)', borderRadius: 4 }}
              >
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label={t('product.removeOne')}
                  className="flex items-center justify-center"
                  style={{ width: 40, height: 40, fontSize: 19, color: '#141833' }}
                >
                  −
                </button>
                <span aria-live="polite" className="text-center" style={{ minWidth: 26, fontSize: 16, color: '#141833' }}>
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
                  aria-label={t('product.addOne')}
                  className="flex items-center justify-center"
                  style={{ width: 40, height: 40, fontSize: 19, color: '#141833' }}
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={handleAdd}
                disabled={product.stock <= 0}
                className="flex-1 transition-colors duration-300 disabled:opacity-40"
                style={{
                  height: 56,
                  border: 'none',
                  background: added ? '#6E7551' : '#141833',
                  color: '#F7F4EE',
                  fontSize: 15,
                  letterSpacing: '.02em',
                  borderRadius: 4,
                }}
              >
                {added ? t('product.added') : `${t('product.addToCart')} · ${money(product.price * qty)}`}
              </button>
            </div>

            {product.stock <= 0 && (
              <p className="mt-3 text-xs" style={{ color: '#95847D' }}>
                {t('product.outOfStock')}
              </p>
            )}

            <div className="mt-8.5 flex flex-col gap-3" style={{ fontSize: 14, fontWeight: 300, color: '#5D6472' }}>
              {[t('product.guarantee1'), t('product.guarantee2'), t('product.guarantee3')].map((g) => (
                <div key={g} className="flex items-start gap-2.5">
                  <span style={{ color: '#6E7551' }}>—</span>
                  <span>{g}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section style={{ background: '#FAF8F4' }} className="pt-14 pb-16">
          <div className="mx-auto px-10 max-sm:px-5" style={{ maxWidth: 1120 }}>
            <header
              className="mb-9 flex flex-wrap items-baseline justify-between gap-3 pb-3.5"
              style={{ borderBottom: '1px solid rgba(26,26,26,.12)' }}
            >
              <div>
                <p style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300, fontSize: 11, letterSpacing: '.16em', color: '#6F6250' }}>
                  {t('product.relatedEyebrow')}
                </p>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: 28, color: '#1A1A1A', marginTop: 4 }}>
                  {t('product.combinesWith')}
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  to="/catalogo"
                  className="uppercase transition-colors duration-200"
                  style={{ fontFamily: 'Jost, sans-serif', fontSize: 11, letterSpacing: '.16em', color: '#1A1A1A' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#6F6250')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#1A1A1A')}
                >
                  {t('product.viewAllLink')} →
                </Link>
                <div className="flex items-center gap-2">
                  <RailNavButton
                    direction={-1}
                    onClick={() => scrollByCards(-1)}
                    disabled={!canScrollLeft}
                    ariaLabel={t('landing.categoryPrev')}
                    ink="#1A1A1A"
                    bg="#FAF8F4"
                  />
                  <RailNavButton
                    direction={1}
                    onClick={() => scrollByCards(1)}
                    disabled={!canScrollRight}
                    ariaLabel={t('landing.categoryNext')}
                    ink="#1A1A1A"
                    bg="#FAF8F4"
                  />
                </div>
              </div>
            </header>

            <div
              ref={railRef}
              className="scroll-rail flex"
              style={{
                gap: RELATED_GAP,
                overflowX: 'auto',
                overflowY: 'hidden',
                scrollBehavior: 'smooth',
                scrollSnapType: 'x mandatory',
                padding: '0 4px 16px',
                margin: '0 -4px',
              }}
            >
              {related.map((p) => (
                <div key={p.id} style={{ flex: '0 0 auto', width: RELATED_CARD_WIDTH, scrollSnapAlign: 'start' }}>
                  <RelatedProductCard product={p} />
                </div>
              ))}
            </div>

            <p
              className="mt-11"
              style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300, fontSize: 12, lineHeight: 1.6, color: '#6F6250' }}
            >
              {t('product.combineDisclaimer')}
            </p>
          </div>
        </section>
      )}
    </div>
  )
}
