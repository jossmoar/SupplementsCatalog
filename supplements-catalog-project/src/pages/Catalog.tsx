import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useProducts } from '../hooks/useProducts'
import { ProductCircleCard } from '../components/ProductCircleCard'
import { PRODUCT_TYPE_LABELS, type Gender, type ProductType } from '../types/product'

const GENDER_TABS: Array<Gender | 'todos'> = ['todos', 'unisex', 'hombres', 'mujeres']
type Sort = 'recommended' | 'price-asc' | 'price-desc'

export function Catalog() {
  const { t } = useTranslation()
  const { products, loading } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const [sort, setSort] = useState<Sort>('recommended')

  const gender = (searchParams.get('genero') as Gender | 'todos') ?? 'todos'
  const type = searchParams.get('tipo') as ProductType | null

  const pickType = (pt: ProductType | null) => {
    const next = new URLSearchParams(searchParams)
    if (pt) next.set('tipo', pt)
    else next.delete('tipo')
    setSearchParams(next)
  }

  const pickGender = (g: Gender | 'todos') => {
    const next = new URLSearchParams(searchParams)
    if (g === 'todos') next.delete('genero')
    else next.set('genero', g)
    setSearchParams(next)
  }

  const filtered = useMemo(() => {
    const list = products.filter((p) => {
      if (gender !== 'todos' && p.gender !== gender) return false
      if (type && p.type !== type) return false
      return true
    })
    if (sort === 'price-asc') return [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') return [...list].sort((a, b) => b.price - a.price)
    return list
  }, [products, gender, type, sort])

  const categoryLabel = (pt: ProductType) => t(`productType.${pt}`)

  const categoryChip = (pt: ProductType | null, active: boolean) => (
    <button
      key={pt ?? 'todo'}
      onClick={() => pickType(pt)}
      className={`flex-none rounded-full px-4 py-2.25 text-xs tracking-wide ${
        active ? 'bg-ink text-cream' : 'border border-beige-dark text-ink'
      }`}
    >
      {pt ? categoryLabel(pt) : t('catalog.allCategories')}
    </button>
  )

  const sortSelect = (
    <select
      value={sort}
      onChange={(e) => setSort(e.target.value as Sort)}
      className="bg-transparent text-[12.5px] text-ink"
    >
      <option value="recommended">{t('catalog.sortRecommended')}</option>
      <option value="price-asc">{t('catalog.sortPriceAsc')}</option>
      <option value="price-desc">{t('catalog.sortPriceDesc')}</option>
    </select>
  )

  return (
    <div className="pb-10">
      <div className="mx-auto max-w-360 px-5 pt-5 pb-3 md:px-14 md:pt-11 md:pb-5">
        <p className="text-[11px] tracking-[0.14em] text-taupe uppercase md:hidden">{t('catalog.breadcrumb')}</p>
        <h1 className="mt-2 font-serif text-[28px] text-ink md:mt-3 md:text-[44px]">{t('catalog.title')}</h1>
      </div>

      <div className="mx-auto max-w-360 px-5 pb-10 md:grid md:grid-cols-[210px_1fr] md:gap-14 md:px-14 md:pb-18">
        <div>
          {/* Filtros — chips con scroll horizontal en móvil */}
          <div className="md:hidden">
            <div className="scrollbar-none flex gap-2 overflow-x-auto pb-3">
              {categoryChip(null, !type)}
              {(Object.keys(PRODUCT_TYPE_LABELS) as ProductType[]).map((pt) => categoryChip(pt, type === pt))}
            </div>
            <div className="scrollbar-none flex gap-2 overflow-x-auto pb-5">
              {GENDER_TABS.map((g) => (
                <button
                  key={g}
                  onClick={() => pickGender(g)}
                  className={`flex-none rounded-full border px-3 py-1.5 text-[11px] ${
                    gender === g ? 'border-ink text-ink' : 'border-beige-dark text-taupe'
                  }`}
                >
                  {t(`gender.${g}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Filtros — sidebar fijo desde md, sin tocar */}
          <div className="hidden md:block">
            <p className="border-b border-hairline-strong pb-2.5 text-[10px] tracking-[0.2em] text-taupe uppercase">
              {t('catalog.category')}
            </p>
            <div className="mb-8 flex flex-col gap-0.5 pt-2">
              {[null, ...(Object.keys(PRODUCT_TYPE_LABELS) as ProductType[])].map((pt) => {
                const active = pt ? type === pt : !type
                return (
                  <button
                    key={pt ?? 'todo'}
                    onClick={() => pickType(pt)}
                    className={`flex items-center justify-between py-2.25 text-[13.5px] ${
                      active ? 'text-ink' : 'text-ink/55'
                    }`}
                  >
                    <span>{pt ? categoryLabel(pt) : t('catalog.allCategories')}</span>
                    <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-olive' : ''}`} />
                  </button>
                )
              })}
            </div>

            <p className="border-b border-hairline-strong pb-2.5 text-[10px] tracking-[0.2em] text-taupe uppercase">
              {t('catalog.gender')}
            </p>
            <div className="flex flex-col gap-0.5 pt-2">
              {GENDER_TABS.map((g) => (
                <button
                  key={g}
                  onClick={() => pickGender(g)}
                  className={`flex items-center justify-between py-2.25 text-[13.5px] ${
                    gender === g ? 'text-ink' : 'text-ink/55'
                  }`}
                >
                  <span>{t(`gender.${g}`)}</span>
                  <span className={`h-1.5 w-1.5 rounded-full ${gender === g ? 'bg-olive' : ''}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div
            className="mb-8 flex items-center justify-between md:mb-12"
            style={{ fontSize: 13, color: '#5D6472', paddingBottom: 6, borderBottom: '1px solid rgba(20,24,51,.12)' }}
          >
            <span>{t(filtered.length === 1 ? 'catalog.countOne' : 'catalog.count', { count: filtered.length })}</span>
            {sortSelect}
          </div>

          {loading ? (
            <p className="mt-16 text-center text-taupe">{t('catalog.loading')}</p>
          ) : filtered.length === 0 ? (
            <p className="mt-16 text-center text-taupe">{t('catalog.empty')}</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 md:gap-x-13 md:gap-y-21">
              {filtered.map((p, i) => (
                <ProductCircleCard key={p.id} product={p} aosDelay={(i % 3) * 60} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
