import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useProducts } from '../hooks/useProducts'
import { money } from '../utils/whatsapp'
import { PRODUCT_TYPE_LABELS, type ProductType } from '../types/product'

const CATEGORY_IMAGES: Record<ProductType, string> = {
  proteinas: 'https://images.unsplash.com/photo-1579722820258-58a08e14ba17?q=80&w=600&auto=format&fit=crop',
  creatinas: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',
  vitaminas: 'https://images.unsplash.com/photo-1550572017-edd951b55104?q=80&w=600&auto=format&fit=crop',
  colageno: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop',
  bienestar: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?q=80&w=600&auto=format&fit=crop',
  accesorios: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop',
}

export function Landing() {
  const { t } = useTranslation()
  const { products } = useProducts()

  const banner = products.find((p) => p.recommended) ?? products[0]
  const essentials = products.filter((p) => p.recommended).slice(0, 6)
  const featured = essentials.length > 0 ? essentials : products.slice(0, 6)

  const heroImages = featured.map((p) => p.images[0]).filter(Boolean) as string[]
  const [heroIndex, setHeroIndex] = useState(0)

  useEffect(() => {
    if (heroImages.length < 2) return
    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroImages.length)
    }, 4000)
    return () => clearInterval(id)
  }, [heroImages.length])

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
      <section className="hidden bg-beige pt-14 pb-16 md:block">
        <div className="mx-auto max-w-360 px-14">
          <h2 className="font-serif text-sm tracking-widest text-taupe uppercase" data-aos="fade-up">
            {t('landing.categories')}
          </h2>
          <div className="mt-7 grid grid-cols-6 gap-5">
            {(Object.keys(PRODUCT_TYPE_LABELS) as ProductType[]).map((type, i) => (
              <Link
                key={type}
                to={`/catalogo?tipo=${type}`}
                className="flex flex-col gap-3"
                data-aos="fade-up"
                data-aos-delay={i * 60}
              >
                <div className="aspect-square overflow-hidden bg-beige">
                  <img src={CATEGORY_IMAGES[type]} alt={t(`productType.${type}`)} className="h-full w-full object-cover" />
                </div>
                <span className="text-[13px] text-ink">{t(`productType.${type}`)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Desktop-only hero */}
      <section className="hidden bg-[#A78872]/70 md:block">
        <div className="mx-auto grid max-w-[1340px] grid-cols-2 px-14" style={{ minHeight: 440 }}>
          <div className="flex flex-col justify-center py-19.5">
            <span className="text-[10.5px] tracking-[0.22em] text-taupe uppercase" data-aos="fade-up">
              {t('landing.eyebrow')}
            </span>
            <h1
              className="mt-4.5 max-w-lg font-serif text-[44px] leading-[1.04] text-ink"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              {t('landing.titleLine1')}
              <br />
              <span className="text-olive italic">{t('landing.titleLine2')}</span>
              <br />
              {t('landing.titleLine3')}
            </h1>
            <p className="mt-5 max-w-sm text-[15px] leading-[1.65] text-ink/60" data-aos="fade-up" data-aos-delay="200">
              {t('landing.subtitle')}
            </p>
            <div className="mt-8 flex gap-3" data-aos="fade-up" data-aos-delay="300">
              <Link to="/catalogo" className="btn-primary text-[13.5px] font-normal tracking-normal normal-case">
                {t('landing.cta')}
              </Link>
              <a href="#ritual" className="btn-secondary text-[13.5px] font-normal tracking-normal normal-case">
                {t('landing.buildRitual')}
              </a>
            </div>
          </div>
          <div className="relative overflow-hidden bg-beige">
            {heroImages.length > 0 ? (
              heroImages.map((src, i) => (
                <img
                  key={src + i}
                  src={src}
                  alt=""
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                    i === heroIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))
            ) : (
              banner?.images[0] && (
                <img src={banner.images[0]} alt="" className="h-full w-full object-cover" />
              )
            )}
          </div>
        </div>
      </section>

      <section className="hidden bg-cream md:block">
        <div id="ritual" className="grid grid-cols-2 scroll-mt-24 bg-beige" data-aos="fade-up">
          <div className="min-h-95 overflow-hidden">
            <img
              src={CATEGORY_IMAGES.bienestar}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center px-14 py-16">
            <span className="text-[10.5px] tracking-[0.22em] text-taupe uppercase">{t('landing.routineEyebrow')}</span>
            <p className="mt-3.5 font-serif text-[38px] leading-[1.15] text-ink">{t('landing.routineTitle')}</p>
            <div className="mt-6.5">
              {steps.map((n) => (
                <div key={n} className="flex gap-5 border-t border-hairline-strong py-4.5">
                  <span className="w-6 font-serif text-[22px] text-olive">{n}</span>
                  <div className="flex-1">
                    <p className="text-[15px] text-ink">{t(`landing.step${n}Title`)}</p>
                    <p className="mt-1.5 text-[13px] leading-[1.55] text-ink/58">{t(`landing.step${n}Text`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

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
