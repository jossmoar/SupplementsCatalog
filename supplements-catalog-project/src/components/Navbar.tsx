import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { LanguageSwitcher } from './LanguageSwitcher'
import { PRODUCT_TYPE_LABELS, type ProductType } from '../types/product'
import logoAmaru from '../assets/logo-amaru.png'

export function Navbar() {
  const { t } = useTranslation()
  const { user, isAdmin, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()

  const categories = Object.keys(PRODUCT_TYPE_LABELS) as ProductType[]

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-3 lg:px-14 lg:py-5">
        <Link to="/" className="flex flex-col items-start leading-none">
          <img src={logoAmaru} alt="RM" className="h-7 w-auto md:h-8" />
          <span className="mt-0.5 block text-[9px] tracking-[0.18em] text-taupe uppercase md:hidden">
            {t('nav.subtitle')}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {categories.map((c) => (
            <Link
              key={c}
              to={`/catalogo?tipo=${c}`}
              className="text-[15px] text-ink transition-opacity hover:opacity-55"
            >
              {t(`productType.${c}`)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to="/buscar"
            aria-label={t('nav.search')}
            className="hidden items-center gap-2 border-b border-beige-dark pb-1 text-taupe md:flex md:w-[150px]"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" />
              <path d="M16.5 16.5 21 21" />
            </svg>
            <span className="text-[12.5px]">{t('nav.search')}</span>
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className="text-[11px] tracking-widest text-olive uppercase hover:text-olive-dark md:text-[12px]"
            >
              {t('nav.admin')}
            </Link>
          )}

          <Link
            to={user ? '/cuenta' : '/login'}
            aria-label={t('nav.account')}
            className="hidden text-ink md:block"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <circle cx="12" cy="9" r="3.4" />
              <path d="M5.5 20c.6-3.6 3.3-5.4 6.5-5.4s5.9 1.8 6.5 5.4" />
            </svg>
          </Link>

          {user && (
            <button
              onClick={() => {
                logout()
                navigate('/')
              }}
              className="hidden text-[11px] tracking-widest text-taupe uppercase hover:text-ink md:block"
            >
              {t('nav.logout')}
            </button>
          )}

          <Link to="/carrito" aria-label={t('nav.cart')} className="relative">
            <span className="hidden h-9 w-9 items-center justify-center rounded-full bg-ink md:flex">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#FBF9F6" strokeWidth="1.4">
                <path d="M6 8h12l-1 12H7L6 8Z" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
            </span>
            <svg
              className="text-ink md:hidden"
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            >
              <path d="M6 8h12l-1 12H7L6 8Z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
            {count > 0 && (
              <span
                className="absolute flex items-center justify-center"
                style={{
                  top: -5,
                  right: -5,
                  minWidth: 19,
                  height: 19,
                  borderRadius: 10,
                  background: '#6E7551',
                  color: '#FAF8F4',
                  fontSize: 11,
                  padding: '0 5px',
                }}
              >
                {count}
              </span>
            )}
          </Link>

          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}
