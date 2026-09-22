import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useProducts } from '../hooks/useProducts'
import { money } from '../utils/whatsapp'
import { PRODUCT_TYPE_LABELS, type ProductType } from '../types/product'
import { CategoryRail } from '../components/CategoryRail'

export function Landing() {
  const { t } = useTranslation()
  const { products } = useProducts()

  const banner = products.find((p) => p.recommended) ?? products[0]
  const essentials = products.filter((p) => p.recommended).slice(0, 6)
  const featured = essentials.length > 0 ? essentials : products.slice(0, 6)

  const heroSlides = (featured.length > 0 ? featured : banner ? [banner] : []).filter((p) => p.images[0])
  const [heroIndex, setHeroIndex] = useState(0)

  useEffect(() => {
    if (heroSlides.length < 2) return
    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroSlides.length)
    }, 4000)
    return () => clearInterval(id)
  }, [heroSlides.length])

  const heroProduct = heroSlides[heroIndex] ?? banner
  const heroCaption = heroProduct
    ? [heroProduct.name, heroProduct.presentation].filter(Boolean).join(' · ')
    : ''

  const steps = [1, 2, 3] as const

  return (
    <div className="bg-beige ">
      <section className="px-5 pt-4.5 md:hidden" data-aos="fade-up">
        <Link
          to="/buscar"
          className="flex items-center gap-2.5 rounded-xs bg-cream px-3.5 py-3.25 text-taupe"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="7" />
            <path d="M16.5 16.5 21 21" />
          </svg>
          <span className="text-[13px]">{t('landing.searchPlaceholder')}</span>
        </Link>
      </section>

      <section className="scrollbar-none flex gap-2 overflow-x-auto px-5 pt-4 pb-0.5 md:hidden">
        {(Object.keys(PRODUCT_TYPE_LABELS) as ProductType[]).map((type) => (
          <Link
            key={type}
            to={`/catalogo?tipo=${type}`}
            className="flex-none rounded-full border border-beige-dark bg-cream/55 px-4 py-2.25 text-xs text-ink"
          >
            {t(`productType.${type}`)}
          </Link>
        ))}
      </section>

      {banner && (
        <section className="px-5 pt-5 md:hidden" data-aos="fade-up">
          <Link
            to={`/catalogo/${banner.id}`}
            className="relative flex min-h-[190px] overflow-hidden bg-cream"
          >
            <div className="flex flex-1 flex-col justify-center gap-2.5 p-5.5">
              <span className="text-[9.5px] tracking-[0.2em] text-olive uppercase">{t('landing.bannerEyebrow')}</span>
              <span className="font-serif text-[26px] leading-[1.1] text-ink">{banner.name}</span>
              {banner.benefits[0] && <span className="text-xs text-ink/55">{banner.benefits[0]}</span>}
              <span className="mt-1 inline-flex self-start rounded-xs bg-ink px-5 py-2.75 text-xs text-cream">
                {t('landing.discover')}
              </span>
            </div>
            <div className="w-37.5 bg-beige">
              {banner.images[0] && (
                <img src={banner.images[0]} alt={banner.name} className="h-full w-full object-cover" />
              )}
            </div>
          </Link>
        </section>
      )}

      {featured.length > 0 && (
        <section className="pt-7.5 md:hidden">
          <div className="flex items-baseline justify-between px-5">
            <span className="font-serif text-[23px] text-ink">{t('landing.essentials')}</span>
            <Link to="/catalogo" className="text-[11px] tracking-wide text-taupe uppercase">
              {t('landing.viewAll')}
            </Link>
          </div>
          <div className="scrollbar-none flex gap-3.5 overflow-x-auto px-5 pt-4 pb-1.5">
            {featured.map((p, i) => (
              <div key={p.id} className="w-43.5 flex-none" data-aos="fade-up" data-aos-delay={i * 60}>
                <div className="flex flex-col gap-2.5 bg-cream p-3">
                  <Link to={`/catalogo/${p.id}`} className="aspect-square overflow-hidden bg-beige">
                    {p.images[0] && <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />}
                  </Link>
                  <p className="min-h-8.5 text-[12.5px] leading-snug text-ink">{p.name}</p>
                  {p.benefits[0] && <p className="text-[11px] text-olive">{p.benefits[0]}</p>}
                  <div className="mt-0.5 flex items-center justify-between">
                    <span className="text-sm text-ink">{money(p.price)}</span>
                    <Link
                      to={`/catalogo/${p.id}`}
                      className="bg-ink px-3 py-2 text-[11px] tracking-wide text-cream"
                    >
                      {t('landing.add')}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-7 bg-cream p-7 md:hidden" data-aos="fade-up">
        <span className="text-[9.5px] tracking-[0.2em] text-taupe uppercase">{t('landing.routineEyebrow')}</span>
        <p className="mt-2 font-serif text-[26px] text-ink">{t('landing.routineTitle')}</p>
        <div className="mt-4.5 flex flex-col">
          {steps.map((n) => (
            <div key={n} className="flex gap-3.5 border-t border-hairline py-3.5">
              <span className="w-5 font-serif text-lg text-olive">{n}</span>
              <div className="flex-1">
                <p className="text-[13.5px] text-ink">{t(`landing.step${n}Title`)}</p>
                <p className="mt-1 text-xs leading-snug text-ink/55">{t(`landing.step${n}Text`)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Desktop-only: Categorías first */}
      <section className="hidden pt-11 pb-12 md:block" style={{ background: '#EFE7DC' }}>
        <CategoryRail products={products} />
      </section>

      {/* Desktop-only hero */}
      {/* Desktop-only hero — Hero B: una sola superficie tan, sin costura 50/50 */}
      <section className="hidden md:block" style={{ background: '#BBA391' }}>
        <div
          className="mx-auto grid items-center"
          style={{
            maxWidth: 1120,
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 400px)',
            gap: 88,
            padding: '104px 40px 112px',
          }}
        >
          <div style={{ maxWidth: 620 }}>
            <span
              className="block uppercase"
              style={{ fontSize: 12, letterSpacing: '.28em', color: '#6B5C55', marginBottom: 26 }}
              data-aos="fade-up"
            >
              {t('landing.eyebrow')}
            </span>
            <h1
              className="font-serif"
              style={{ fontWeight: 400, fontSize: 54, lineHeight: 1.1, color: '#141833', margin: '0 0 26px' }}
              data-aos="fade-up"
              data-aos-delay="100"
            >
              {t('landing.titleLine1')}
              <br />
              <em style={{ color: '#5C6540', fontStyle: 'italic' }}>{t('landing.titleLine2')}</em>
              <br />
              {t('landing.titleLine3')}
            </h1>
            <p
              style={{ fontSize: 16, lineHeight: 1.75, color: '#4A4640', maxWidth: 420, margin: '0 0 40px' }}
              data-aos="fade-up"
              data-aos-delay="200"
            >
              {t('landing.subtitle')}
            </p>
            <div className="flex" style={{ gap: 14 }} data-aos="fade-up" data-aos-delay="300">
              <Link
                to="/catalogo"
                style={{ background: '#141833', color: '#F7F4EE', padding: '11px 34px', fontSize: 15, borderRadius: 4 }}
              >
                {t('landing.cta')}
              </Link>
              <a
                href="#ritual"
                style={{
                  border: '1px solid rgba(20,24,51,.35)',
                  padding: '11px 34px',
                  fontSize: 15,
                  color: '#141833',
                  borderRadius: 4,
                }}
              >
                {t('landing.buildRitual')}
              </a>
            </div>
          </div>

          <div className="relative" data-aos="fade-up" data-aos-delay="150">
            <div
              className="absolute"
              style={{ left: -54, top: -40, width: 250, height: 250, borderRadius: '50%', background: 'rgba(250,248,244,.20)' }}
            />
            <div
              className="absolute"
              style={{
                right: -70,
                bottom: -56,
                width: 150,
                height: 150,
                borderRadius: '50%',
                border: '1px solid rgba(250,248,244,.35)',
              }}
            />
            {heroSlides.length > 0 && (
              <div
                className="relative block w-full overflow-hidden"
                style={{
                  aspectRatio: '4 / 5',
                  borderRadius: '250px 250px 16px 16px',
                  boxShadow: '0 40px 72px -30px rgba(20,24,51,.55)',
                }}
              >
                {heroSlides.map((p, i) => (
                  <img
                    key={p.id}
                    src={p.images[0]}
                    alt=""
                    className="absolute inset-0 h-full w-full transition-opacity duration-700"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center 45%',
                      opacity: i === heroIndex ? 1 : 0,
                    }}
                  />
                ))}
              </div>
            )}
            {heroCaption && (
              <div
                className="relative flex items-start"
                style={{ marginTop: 22, gap: 12, fontSize: 13, letterSpacing: '.06em', color: '#4A4640', minHeight: 40 }}
              >
                <span style={{ width: 26, height: 1, marginTop: 9, flexShrink: 0, background: 'rgba(20,24,51,.35)' }} />
                <span
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {heroCaption}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Desktop-only rutina — 3 columnas horizontales, sin imagen */}
      <section id="ritual" className="hidden scroll-mt-24 md:block" style={{ background: '#EAE3D9' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 40px 80px' }}>
          <div
            className="flex items-end justify-between"
            style={{ gap: 40, marginBottom: 24 }}
            data-aos="fade-up"
          >
            <div>
              <span
                className="block uppercase"
                style={{ fontSize: 12, letterSpacing: '.28em', color: '#95847D', marginBottom: 20 }}
              >
                {t('landing.routineEyebrow')}
              </span>
              <h2 className="font-serif" style={{ fontWeight: 400, fontSize: 44, color: '#141833', margin: 0 }}>
                {t('landing.routineTitle')}
              </h2>
            </div>
            <Link
              to="/catalogo"
              style={{ fontSize: 15, color: '#141833', borderBottom: '1px solid rgba(20,24,51,.4)', paddingBottom: 5 }}
            >
              {t('landing.start')}
            </Link>
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 60 }}>
            {steps.map((n, i) => (
              <div
                key={n}
                style={{ borderTop: '1px solid rgba(20,24,51,.2)', paddingTop: 24 }}
                data-aos="fade-up"
                data-aos-delay={i * 80}
              >
                <div className="font-serif" style={{ fontSize: 24, color: '#95847D', marginBottom: 2 }}>
                  {n}
                </div>
                <div style={{ fontSize: 19, marginBottom: 2, color: '#141833' }}>{t(`landing.step${n}Title`)}</div>
                <div style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.65, color: '#5D6472' }}>
                  {t(`landing.step${n}Text`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hidden bg-cream md:block">
        <div className="px-14 py-18 text-center" data-aos="fade-up">
          <p className="mx-auto max-w-xl font-serif text-[32px] leading-[1.3] text-ink italic">
            {t('landing.quote')}
          </p>
          <p className="mt-5 text-[11px] tracking-[0.16em] text-taupe uppercase">
            {t('landing.quoteAuthor')}
          </p>
        </div>
      </section>
    </div>
  )
}
