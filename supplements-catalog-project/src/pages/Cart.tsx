import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { buildWhatsAppOrderLink, money } from '../utils/whatsapp'

export function Cart() {
  const { t } = useTranslation()
  const { items, removeItem, setQuantity, total, clear } = useCart()
  const { profile } = useAuth()
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const handleSend = async () => {
    setError('')
    setSending(true)
    try {
      const { url } = await buildWhatsAppOrderLink(items, profile?.name ?? '')
      window.open(url, '_blank')
      clear()
    } catch (err) {
      setError(t('cart.error'))
      console.error(err)
    } finally {
      setSending(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <span className="font-serif text-2xl text-ink" data-aos="fade-up">
          {t('cart.empty')}
        </span>
        <p className="mt-3 text-[12.5px] leading-relaxed text-taupe" data-aos="fade-up" data-aos-delay="100">
          {t('cart.emptyHint')}
        </p>
        <Link to="/catalogo" className="btn-primary mt-8 inline-flex">
          {t('nav.catalog')}
        </Link>
      </div>
    )
  }

  return (
    <div className="pb-28 md:pb-16">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-3.5 border-b border-hairline px-5 py-4">
          <h1 className="flex-1 font-serif text-[21px] text-ink">{t('cart.title')}</h1>
          <span className="text-[11.5px] text-taupe">
            {t(items.length === 1 ? 'cart.countOne' : 'cart.count', { count: items.length })}
          </span>
        </div>

        <div className="px-5">
          {items.map((item, i) => (
            <div
              key={`${item.productId}-${item.size ?? ''}`}
              className="flex gap-3.5 border-b border-hairline py-4.5"
              data-aos="fade-up"
              data-aos-delay={i * 50}
            >
              <div className="h-23.5 w-19.5 shrink-0 overflow-hidden bg-beige">
                {item.image && (
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex flex-1 flex-col">
                <p className="text-[13px] leading-snug text-ink">{item.name}</p>
                {item.size && <p className="mt-0.5 text-[11.5px] text-taupe">{item.size}</p>}
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center border border-beige-dark">
                    <button
                      className="flex h-7.5 w-7.5 items-center justify-center text-ink"
                      onClick={() => setQuantity(item.productId, item.quantity - 1, item.size)}
                    >
                      −
                    </button>
                    <span className="w-5.5 text-center text-[12.5px] text-ink">{item.quantity}</span>
                    <button
                      className="flex h-7.5 w-7.5 items-center justify-center text-ink"
                      onClick={() => setQuantity(item.productId, item.quantity + 1, item.size)}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-ink">{money(item.price * item.quantity)}</span>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.productId, item.size)}
                className="self-start text-taupe hover:text-red-700"
                aria-label={t('cart.remove')}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="px-5 pt-5">
          <div className="flex justify-between border-t border-hairline pt-3.5 text-[16px] text-ink">
            <span className="font-serif text-[19px]">{t('cart.total')}</span>
            <span>{money(total)}</span>
          </div>
        </div>

        {error && <p className="mt-4 px-5 text-sm text-red-700">{error}</p>}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-cream/96 px-5 py-3.5 pb-7 backdrop-blur md:static md:mt-8 md:border-t-0 md:bg-transparent md:px-0 md:pb-0 md:backdrop-blur-none">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={handleSend}
            disabled={sending}
            className="flex h-12 w-full items-center justify-center rounded-xs bg-ink text-[13px] tracking-widest text-cream uppercase disabled:opacity-60"
          >
            {sending ? t('cart.verifying') : t('cart.sendOrder')}
          </button>
          <p className="mt-2.5 text-center text-[11px] text-taupe">{t('cart.whatsappHint')}</p>
        </div>
      </div>
    </div>
  )
}
