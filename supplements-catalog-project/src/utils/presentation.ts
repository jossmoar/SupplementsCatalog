import type { TFunction } from 'i18next'
import type { PresentationKey } from '../types/product'

/** Antes la presentación se guardaba como texto en español; se mapea a la clave nueva para poder traducirla. */
const LEGACY_PRESENTATIONS: Record<string, PresentationKey> = {
  'Dosis en polvo': 'powder',
  'Dosis en cápsula': 'capsule',
  'Bebida en presentación individual': 'drink',
}

const KEYS: PresentationKey[] = ['powder', 'capsule', 'drink']

/** Devuelve la clave de presentación, o el texto original si no corresponde a ninguna opción conocida. */
export function normalizePresentation(value: string): string {
  if ((KEYS as string[]).includes(value)) return value
  return LEGACY_PRESENTATIONS[value] ?? value
}

/** Texto traducido de la presentación; los valores libres antiguos se muestran tal cual. */
export function presentationLabel(value: string, t: TFunction): string {
  if (!value) return ''
  const key = normalizePresentation(value)
  return (KEYS as string[]).includes(key) ? t(`presentation.${key}`) : value
}
