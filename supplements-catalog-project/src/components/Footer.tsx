import { useTranslation } from 'react-i18next'
import logoAmaruLight from '../assets/logo-amaru-light.png'

const WHATSAPP_DISPLAY = '+506 8886 5324'
const WHATSAPP_LINK = 'https://wa.me/50688865324'
const PHONE_LINK = 'tel:+50688865324'
const EMAIL = 'avolioj@yahoo.com'

export function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden" style={{ background: '#141833', color: '#FAF8F4' }}>
      {/* 1. Logo */}
      <div className="px-18 pt-4 text-center max-lg:px-10 max-sm:px-6" data-aos="fade-up">
        <img
          src={logoAmaruLight}
          alt={t('footer.logoAlt')}
          className="mx-auto block h-27 w-auto max-w-[62%] max-lg:h-21 max-[780px]:h-17"
          style={{ filter: 'drop-shadow(0 18px 34px rgba(0,0,0,.45))' }}
        />
      </div>

      

      {/* 3a. Frase de contacto */}
      <div
        data-aos="fade-up"
        className="px-18 pt-4 text-center max-lg:px-10 max-sm:px-6"
        style={{ fontSize: 13, fontWeight: 300, color: '#E4DFD6' }}
      >
        {t('footer.contactPrefix')} <a href={PHONE_LINK} className="footer-phone-link">{WHATSAPP_DISPLAY}</a>
      </div>

      {/* 3b. Botones de contacto */}
      <div
        data-aos="fade-up"
        className="flex items-center justify-center gap-3.5 px-18 pt-4 pb-4 max-lg:px-10 max-sm:flex-col max-sm:px-6"
      >
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener"
          className="footer-pill max-sm:w-full max-sm:max-w-80 max-sm:justify-center"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.13h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.21-8.24 8.21Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.71-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z" />
          </svg>
          <span>{WHATSAPP_DISPLAY}</span>
        </a>
        <a href={`mailto:${EMAIL}`} className="footer-pill max-sm:w-full max-sm:max-w-80 max-sm:justify-center">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
            <path d="m3 6.5 9 6.2 9-6.2" />
          </svg>
          <span style={{ fontSize: 13 }}>{EMAIL}</span>
        </a>
      </div>

      {/* 4. Barra legal */}
      <div
        className="flex items-center justify-between px-18 pt-3 pb-3 max-lg:px-10 max-sm:flex-col max-sm:gap-2 max-sm:px-6 max-sm:text-center"
        style={{ borderTop: '1px solid rgba(250,248,244,.12)', fontSize: 11, fontWeight: 300, color: '#A8A29A' }}
      >
        <span>{t('footer.copyright', { year })}</span>
        <span>{t('footer.hours')}</span>
      </div>
    </footer>
  )
}
