import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Product } from '../types/product'
import { PRODUCT_TYPE_LABELS, type ProductType } from '../types/product'
import { useScrollRail } from '../hooks/useScrollRail'
import { RailNavButton } from './RailNavButton'

const CATEGORY_IMAGES: Record<ProductType, string> = {
  proteinas: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=600&auto=format&fit=crop',
  creatinas: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',
  vitaminas: 'https://images.unsplash.com/photo-1550572017-edd951b55104?q=80&w=600&auto=format&fit=crop',
  colageno: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop',
  bienestar: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?q=80&w=600&auto=format&fit=crop',
  accesorios: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop',
}

const CARD_WIDTH = 164
const GAP = 28

interface Props {
  products: Product[]
}

export function CategoryRail({ products }: Props) {
  const { t } = useTranslation()
  const { railRef, canScrollLeft, canScrollRight, scrollByCards } = useScrollRail(CARD_WIDTH, GAP)

  const types = Object.keys(PRODUCT_TYPE_LABELS) as ProductType[]

  return (
    <div className="mx-auto px-10 max-sm:px-5" style={{ maxWidth: 1120 }}>
      <div className="flex items-baseline justify-between" style={{ marginBottom: 26 }} data-aos="fade-up">
        <span
          className="uppercase"
          style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400, fontSize: 11, letterSpacing: '.22em', color: '#8A7C66' }}
        >
          {t('landing.categories')}
        </span>
        <div className="flex items-center gap-2">
          <RailNavButton
            direction={-1}
            onClick={() => scrollByCards(-1)}
            disabled={!canScrollLeft}
            ariaLabel={t('landing.categoryPrev')}
            ink="#1A1A1A"
            bg="#EFE7DC"
          />
          <RailNavButton
            direction={1}
            onClick={() => scrollByCards(1)}
            disabled={!canScrollRight}
            ariaLabel={t('landing.categoryNext')}
            ink="#1A1A1A"
            bg="#EFE7DC"
          />
        </div>
      </div>

      <div
        ref={railRef}
        className="scroll-rail flex"
        style={{
          gap: GAP,
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollBehavior: 'smooth',
          scrollSnapType: 'x mandatory',
          padding: '0 4px 16px',
          margin: '0 -4px',
        }}
      >
        {types.map((type, i) => {
          const count = products.filter((p) => p.type === type).length
          return (
            <Link
              key={type}
              to={`/catalogo?tipo=${type}`}
              className="flex flex-col items-center text-center"
              style={{ flex: '0 0 auto', width: CARD_WIDTH, scrollSnapAlign: 'start' }}
              data-aos="fade-up"
              data-aos-delay={i * 60}
            >
              <div
                className="overflow-hidden"
                style={{ width: CARD_WIDTH, height: CARD_WIDTH, borderRadius: '50%', background: '#E3D8C9', marginBottom: 16 }}
              >
                <img
                  src={CATEGORY_IMAGES[type]}
                  alt={t(`productType.${type}`)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 400,
                  fontSize: 16,
                  lineHeight: 1.25,
                  color: '#1A1A1A',
                }}
              >
                {t(`productType.${type}`)}
              </span>
              <span
                className="uppercase"
                style={{
                  fontFamily: 'Jost, sans-serif',
                  fontWeight: 400,
                  fontSize: 11,
                  letterSpacing: '.12em',
                  color: '#8A7C66',
                  marginTop: 6,
                }}
              >
                {t(count === 1 ? 'landing.categoryCountOne' : 'landing.categoryCount', { count })}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
