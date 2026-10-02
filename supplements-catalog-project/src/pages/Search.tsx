import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useProducts } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { money } from '../utils/whatsapp'
import { PRODUCT_TYPE_LABELS, type ProductType } from '../types/product'

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

const CATEGORY_SUGGESTIONS = Object.keys(PRODUCT_TYPE_LABELS) as ProductType[]

export function Search() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { products } = useProducts()
  const { addItem } = useCart()
  const { user } = useAuth()
  const [q, setQ] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<Set<ProductType>>(new Set())

  const nq = normalize(q.trim())
  const hasCategoryFilter = selectedTypes.size > 0
  const hasActiveFilter = nq !== '' || hasCategoryFilter

  const toggleType = (type: ProductType) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return next
    })
  }

  const results = useMemo(() => {
    // Entre categorías seleccionadas es OR (cualquiera de ellas); con el texto buscado es AND.
    let list = products
    if (hasCategoryFilter) {
      list = list.filter((p) => selectedTypes.has(p.type))
    }
    if (nq !== '') {
      list = list.filter((p) =>
        normalize(`${p.name} ${p.benefits.join(' ')} ${p.type} ${p.presentation}`).includes(nq),
      )
      return list
    }
    return hasCategoryFilter ? list : list.slice(0, 4)
  }, [products, nq, selectedTypes, hasCategoryFilter])

  const handleAdd = (productId: string) => {
    if (!user) {
      navigate('/login')
      return
    }
    const product = products.find((p) => p.id === productId)
    if (product) addItem(product, 1)
  }

  return (
    <div className="mx-auto max-w-3xl px-5 pt-4 pb-16 md:px-14 md:pt-9">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2.5 rounded-xs bg-beige px-3.5 py-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14120F" strokeWidth="1.5">
            <circle cx="11" cy="11" r="7" />
            <path d="M16.5 16.5 21 21" />
          </svg>
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('search.placeholder')}
            className="flex-1 bg-transparent text-[13.5px] text-ink placeholder:text-taupe focus:outline-none"
          />
        </div>
        <button onClick={() => navigate(-1)} className="text-[12.5px] text-taupe hover:text-ink">
          {t('search.cancel')}
        </button>
      </div>

      <div className="mt-5.5">
        <p className="eyebrow">{t('search.suggestions')}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {CATEGORY_SUGGESTIONS.map((type) => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`chip ${selectedTypes.has(type) ? 'chip-active' : ''}`}
            >
              {t(`productType.${type}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6.5">
        <p className="eyebrow">
          {!hasActiveFilter
            ? t('search.popular')
            : t(results.length === 1 ? 'search.oneResult' : 'search.results', { count: results.length })}
        </p>
        <div className="mt-2">
          {results.map((p) => (
            <div key={p.id} className="flex items-center gap-3.5 border-b border-hairline py-3.5">
              <Link to={`/catalogo/${p.id}`} className="h-19 w-16 flex-none overflow-hidden bg-beige">
                {p.images[0] && <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />}
              </Link>
              <Link to={`/catalogo/${p.id}`} className="flex-1">
                <div className="text-[13px] leading-snug text-ink">{p.name}</div>
                <div className="mt-1 text-[11.5px] text-taupe">{p.presentation}</div>
                <div className="mt-1.75 text-[13.5px] text-ink">{money(p.price)}</div>
              </Link>
              <button
                onClick={() => handleAdd(p.id)}
                aria-label={t('product.addToCart')}
                className="flex h-7.5 w-7.5 flex-none items-center justify-center rounded-full border border-ink text-base text-ink"
              >
                +
              </button>
            </div>
          ))}
        </div>
        {hasActiveFilter && results.length === 0 && (
          <div className="py-10 text-center">
            <p className="font-serif text-[22px] text-ink">{t('search.empty')}</p>
            <p className="mt-2 text-[12.5px] text-taupe">{t('search.emptyHint')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
