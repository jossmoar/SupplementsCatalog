import { doc, getDoc } from 'firebase/firestore'
import { db, WHATSAPP_NUMBER } from '../firebase/config'
import i18n from '../i18n/config'
import type { CartItem } from '../types/product'

const money = (n: number) =>
  n.toLocaleString('es-CR', { style: 'currency', currency: 'CRC' })

/**
 * Antes de armar el mensaje, vuelve a leer el precio real de cada producto
 * directo desde Firestore (no el que quedó guardado en el navegador).
 * Así, aunque alguien manipule el carrito local, el pedido que llega por
 * WhatsApp siempre refleja el precio verdadero que puso el admin.
 */
export async function buildWhatsAppOrderLink(
  items: CartItem[],
  customerName: string,
) {
  const verifiedItems = await Promise.all(
    items.map(async (item) => {
      const snap = await getDoc(doc(db, 'products', item.productId))
      const realPrice = snap.exists() ? (snap.data().price as number) : item.price
      return { ...item, price: realPrice }
    }),
  )

  const lines = verifiedItems.map((i) => {
    const sizeLabel = i.size ? ` (${i.size})` : ''
    return `• ${i.name}${sizeLabel} x${i.quantity} — ${money(i.price * i.quantity)}`
  })
  const total = verifiedItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const message = [
    i18n.t('whatsapp.greeting', {
      name: customerName || i18n.t('whatsapp.defaultName'),
    }),
    '',
    ...lines,
    '',
    i18n.t('whatsapp.total', { total: money(total) }),
    '',
    i18n.t('whatsapp.closing'),
  ].join('\n')

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  return { url, total, verifiedItems }
}

export { money }
