import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="mt-24 border-t border-beige-dark bg-beige/60 py-10">
      <div
        className="mx-auto max-w-[1440px] px-6 text-center text-xs uppercase tracking-widest text-taupe"
        data-aos="fade-up"
      >
        {t('footer.tagline')}
      </div>
    </footer>
  )
}
