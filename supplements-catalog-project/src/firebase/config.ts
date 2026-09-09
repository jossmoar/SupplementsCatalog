import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Nota: NO usamos Firebase Storage a propósito. Google cambió Storage para
// que necesite el plan de pago (Blaze) incluso para uso mínimo. Las fotos
// de producto se suben a Cloudinary (gratis, sin tarjeta) — ver
// src/utils/cloudinary.ts.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// Correos del panel de administración (solo estas cuentas ven /admin).
// Se admite una lista separada por comas en VITE_ADMIN_EMAIL.
export const ADMIN_EMAILS = (
  import.meta.env.VITE_ADMIN_EMAIL ??
  'jmonteroa1@ucenfotec.com,jmonteroa1@ucenfotec.ac.cr'
)
  .split(',')
  .map((email: string) => email.trim().toLowerCase())
  .filter(Boolean)

// Número de WhatsApp al que se envían los pedidos (formato wa.me, sin "+").
export const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP_NUMBER ?? '50263461211'
