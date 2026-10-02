import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { LanguageSwitcher } from './LanguageSwitcher'
import { PRODUCT_TYPE_LABELS, type ProductType } from '../types/product'
import logoAmaru from '../assets/logo-amaru.png'
import logoAmaruLight from '../assets/logo-amaru-light.png'

export function Navbar() {
  const { t } = useTranslation()
  const { user, isAdmin, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const categories = Object.keys(PRODUCT_TYPE_LABELS) as ProductType[]

  useEffect(() => {
    if (!menuOpen) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
    <header className="sticky top-0 z-40 border-b border-hairline bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-3 lg:px-14 lg:py-5">
        <div className="flex items-center gap-3.5 md:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={t('nav.menu')}
            className="flex h-8 w-8 items-center justify-center text-ink"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>

        <Link to="/" className="flex flex-col items-start leading-none">
          <img src={logoAmaru} alt="RM" className="h-7 w-auto md:h-8" />
          <span className="mt-0.5 block text-[9px] tracking-[0.18em] text-taupe uppercase md:hidden">
            {t('nav.subtitle')}
          </span>
        </Link>

        <nav className="hidden items-center gap-4 md:flex lg:gap-8">
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

        <div className="flex items-center gap-2.5 lg:gap-4">
          <Link
            to="/buscar"
            aria-label={t('nav.search')}
            className="hidden items-center gap-2 border-b border-beige-dark pb-1 text-taupe md:flex md:w-25 lg:w-37.5"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" />
              <path d="M16.5 16.5 21 21" />
            </svg>
            <span className="text-[12.5px]">{t('nav.search')}</span>
          </Link>

          <Link to="/buscar" aria-label={t('nav.search')} className="text-ink md:hidden">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" />
              <path d="M16.5 16.5 21 21" />
            </svg>
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className="hidden text-[12px] tracking-widest text-olive uppercase hover:text-olive-dark md:block"
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

    {menuOpen &&
      createPortal(
        <div className="fixed inset-0 z-50 flex flex-col md:hidden" style={{ background: '#141833' }}>
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <img src={logoAmaruLight} alt="RM" className="h-8 w-auto" />
            <button
              type="button"
              onClick={closeMenu}
              aria-label={t('nav.close')}
              className="flex h-9 w-9 items-center justify-center"
              style={{ color: '#FAF8F4' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center gap-1 px-8">
            {categories.map((c) => (
              <Link
                key={c}
                to={`/catalogo?tipo=${c}`}
                onClick={closeMenu}
                className="font-serif py-2.5 text-[28px]"
                style={{ color: '#FAF8F4' }}
              >
                {t(`productType.${c}`)}
              </Link>
            ))}
          </nav>

          <div
            className="flex flex-col gap-4 px-8 pt-5 pb-10"
            style={{ borderTop: '1px solid rgba(250,248,244,.15)' }}
          >
            <Link
              to={user ? '/cuenta' : '/login'}
              onClick={closeMenu}
              className="text-[13px] uppercase"
              style={{ letterSpacing: '.14em', color: '#BBA391' }}
            >
              {user ? t('nav.account') : t('login.signIn')}
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={closeMenu}
                className="text-[13px] uppercase"
                style={{ letterSpacing: '.14em', color: '#BBA391' }}
              >
                {t('nav.admin')}
              </Link>
            )}
            {user && (
              <button
                onClick={() => {
                  logout()
                  closeMenu()
                  navigate('/')
                }}
                className="text-left text-[13px] uppercase"
                style={{ letterSpacing: '.14em', color: '#BBA391' }}
              >
                {t('nav.logout')}
              </button>
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
