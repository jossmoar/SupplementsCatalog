import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export function BottomTabBar() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const { user, isAdmin } = useAuth()
  const { count } = useCart()

  const hidden = pathname === '/carrito' || /^\/catalogo\/[^/]+$/.test(pathname)
  if (hidden) return null

  const tabs = [
    {
      to: '/',
      label: t('nav.home'),
      active: pathname === '/',
      icon: (color: string) => (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4">
          <path d="M4 11 12 4l8 7v9H4z" />
        </svg>
      ),
    },
    {
      to: '/buscar',
      label: t('nav.search'),
      active: pathname === '/buscar',
      icon: (color: string) => (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4">
          <circle cx="11" cy="11" r="7" />
          <path d="M16.5 16.5 21 21" />
        </svg>
      ),
    },
    {
      to: '/carrito',
      label: t('nav.cart'),
      active: pathname === '/carrito',
      badge: count,
      icon: (color: string) => (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4">
          <path d="M6 8h12l-1 12H7L6 8Z" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" />
        </svg>
      ),
    },
    {
      to: user ? '/cuenta' : '/login',
      label: t('nav.account'),
      active: pathname === '/cuenta' || pathname === '/login',
      icon: (color: string) => (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4">
          <circle cx="12" cy="9" r="3.4" />
          <path d="M5.5 20c.6-3.6 3.3-5.4 6.5-5.4s5.9 1.8 6.5 5.4" />
        </svg>
      ),
    },
    ...(isAdmin
      ? [
          {
            to: '/admin',
            label: t('nav.admin'),
            active: pathname === '/admin',
            icon: (color: string) => (
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ),
          },
        ]
      : []),
  ]

  return (
    <nav className="sticky bottom-0 z-40 flex justify-around border-t border-hairline bg-cream/95 px-0 pt-3 pb-6 backdrop-blur md:hidden">
      {tabs.map((tab) => {
        const color = tab.active ? '#14120F' : '#8B7A6A'
        return (
          <Link key={tab.to} to={tab.to} className="relative flex flex-col items-center gap-1">
            {tab.icon(color)}
            <span className="text-[9.5px]" style={{ color }}>
              {tab.label}
            </span>
            {!!tab.badge && (
              <span className="absolute -top-1 right-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-olive px-1 text-[9px] text-white">
                {tab.badge}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
