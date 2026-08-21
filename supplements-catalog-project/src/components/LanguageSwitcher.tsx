import { useTranslation } from 'react-i18next'

const LANGUAGES = ['es', 'en'] as const

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const current = i18n.language.startsWith('en') ? 'en' : 'es'

  return (
    <div className="flex items-center gap-1 text-xs uppercase tracking-widest text-taupe">
      {LANGUAGES.map((lng, i) => (
        <span key={lng} className="flex items-center gap-1">
          {i > 0 && <span className="text-beige-dark">/</span>}
          <button
            onClick={() => i18n.changeLanguage(lng)}
            aria-current={current === lng}
            className={current === lng ? 'text-ink' : 'hover:text-ink'}
          >
            {lng}
          </button>
        </span>
      ))}
    </div>
  )
}
