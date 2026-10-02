import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useProducts } from '../hooks/useProducts'
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
      <section className="pt-11 pb-12" style={{ background: '#EFE7DC' }}>
        <CategoryRail products={products} />
      </section>

      {/* Hero — Hero B: una sola superficie tan, sin costura 50/50 */}
      <section className="overflow-hidden" style={{ background: '#BBA391' }}>
        <div
          className="mx-auto grid grid-cols-1 items-center gap-10 px-5 py-14 md:grid-cols-[minmax(0,1fr)_minmax(0,400px)] md:gap-22 md:px-10 md:pt-26 md:pb-28"
          style={{ maxWidth: 1120 }}
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
              className="font-serif text-[36px] md:text-[54px]"
              style={{ fontWeight: 400, lineHeight: 1.1, color: '#141833', margin: '0 0 26px' }}
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
            <div className="flex flex-col gap-3 md:flex-row md:gap-3.5" data-aos="fade-up" data-aos-delay="300">
              <Link
                to="/catalogo"
                className="text-center"
                style={{ background: '#141833', color: '#F7F4EE', padding: '11px 34px', fontSize: 15, borderRadius: 4 }}
              >
                {t('landing.cta')}
              </Link>
              <a
                href="#ritual"
                className="text-center"
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
                className="absolute flex items-start"
                style={{
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: 22,
                  gap: 12,
                  fontSize: 13,
                  letterSpacing: '.06em',
                  color: '#4A4640',
                  minHeight: 40,
                }}
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

      {/* Rutina — 3 pasos, en columna en móvil y horizontal desde md */}
      <section id="ritual" className="scroll-mt-24" style={{ background: '#EAE3D9' }}>
        <div className="mx-auto px-5 pt-14 pb-16 md:px-10 md:pt-18 md:pb-20" style={{ maxWidth: 1120 }}>
          <div
            className="mb-6 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between"
            data-aos="fade-up"
          >
            <div>
              <span
                className="block uppercase"
                style={{ fontSize: 12, letterSpacing: '.28em', color: '#95847D', marginBottom: 20 }}
              >
                {t('landing.routineEyebrow')}
              </span>
              <h2 className="font-serif text-[30px] md:text-[44px]" style={{ fontWeight: 400, color: '#141833', margin: 0 }}>
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

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-15">
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

      <section className="bg-cream">
        <div className="px-6 py-12 text-center md:px-14 md:py-18" data-aos="fade-up">
          <p className="mx-auto max-w-xl font-serif text-[22px] leading-[1.35] text-ink italic md:text-[30px] md:leading-[1.3]">
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
