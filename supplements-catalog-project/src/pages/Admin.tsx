import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  updateDoc,
} from 'firebase/firestore'
import { useTranslation } from 'react-i18next'
import { db } from '../firebase/config'
import { uploadProductImage } from '../utils/cloudinary'
import { useProducts } from '../hooks/useProducts'
import { ComboBox } from '../components/ComboBox'
import {
  GENDER_LABELS,
  PRESENTATION_OPTIONS,
  PRODUCT_TYPE_LABELS,
  SIZE_OPTIONS,
  type Gender,
  type Product,
  type ProductSize,
  type ProductType,
} from '../types/product'
import { money } from '../utils/whatsapp'
import { getLowestPrice, getProductPrice } from '../utils/pricing'
import { normalizePresentation } from '../utils/presentation'

/** Una foto ya subida (URL) o una nueva que se sube al guardar. */
type Photo = { kind: 'url'; url: string } | { kind: 'file'; file: File; preview: string }

type Toast = { message: string; kind: 'success' | 'error' }

/** Sabor en el formulario. `photo` apunta a una foto del formulario (su URL o su vista previa). */
type FormFlavor = { name: string; photo: string }

const emptyForm = {
  name: '',
  gender: 'unisex' as Gender,
  type: 'proteinas' as ProductType,
  price: '',
  benefits: '',
  presentation: '',
  sizes: [] as ProductSize[],
  flavors: [] as FormFlavor[],
  usage: '',
  recommended: false,
}

const isValidPrice = (v: string) => v.trim() !== '' && Number.isFinite(Number(v)) && Number(v) > 0
/** "2 lb", "2 LB" y "2lb" cuentan como el mismo tamaño. */
const sizeKey = (label: string) => label.toLowerCase().replace(/\s+/g, '')

const photoSrc = (p: Photo) => (p.kind === 'url' ? p.url : p.preview)
const revokePhoto = (p: Photo) => {
  if (p.kind === 'file') URL.revokeObjectURL(p.preview)
}

export function Admin() {
  const { t } = useTranslation()
  const { products } = useProducts()
  const [form, setForm] = useState(emptyForm)
  const [sizeInput, setSizeInput] = useState('')
  const [sizePriceInput, setSizePriceInput] = useState('')
  const [editingSizeIndex, setEditingSizeIndex] = useState<number | null>(null)
  const [sizeError, setSizeError] = useState('')
  const [flavorInput, setFlavorInput] = useState('')
  const [flavorPhotoInput, setFlavorPhotoInput] = useState('')
  const [flavorError, setFlavorError] = useState('')
  const [photos, setPhotos] = useState<Photo[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState<Toast | null>(null)

  const sizeOptions = SIZE_OPTIONS[form.type]
  const presentationOptions = PRESENTATION_OPTIONS[form.type]

  // Libera las vistas previas de fotos nuevas al salir de la página.
  const photosRef = useRef(photos)
  useEffect(() => {
    photosRef.current = photos
  }, [photos])
  useEffect(() => () => photosRef.current.forEach(revokePhoto), [])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(id)
  }, [toast])

  const clearSizeInputs = () => {
    setSizeInput('')
    setSizePriceInput('')
    setEditingSizeIndex(null)
    setSizeError('')
  }

  const saveSize = () => {
    setSizeError('')
    const raw = sizeInput.trim().replace(/\s+/g, ' ')
    if (!raw) return setSizeError(t('admin.sizeLabelError'))
    if (!isValidPrice(sizePriceInput)) return setSizeError(t('admin.priceError'))

    const key = sizeKey(raw)
    const label = sizeOptions?.find((o) => sizeKey(o) === key) ?? raw
    if (form.sizes.some((s, i) => i !== editingSizeIndex && sizeKey(s.label) === key)) {
      return setSizeError(t('admin.duplicateSizeError', { size: label }))
    }

    const size: ProductSize = { label, price: Number(sizePriceInput) }
    const sizes =
      editingSizeIndex === null
        ? [...form.sizes, size]
        : form.sizes.map((s, i) => (i === editingSizeIndex ? size : s))
    setForm({ ...form, sizes })
    clearSizeInputs()
  }

  const onSizeKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      saveSize()
    }
  }

  const editSize = (index: number) => {
    const s = form.sizes[index]
    setEditingSizeIndex(index)
    setSizeInput(s.label)
    setSizePriceInput(String(s.price))
    setSizeError('')
  }

  const moveSize = (index: number, delta: number) => {
    const target = index + delta
    if (target < 0 || target >= form.sizes.length) return
    const sizes = [...form.sizes]
    ;[sizes[index], sizes[target]] = [sizes[target], sizes[index]]
    setForm({ ...form, sizes })
    if (editingSizeIndex === index) setEditingSizeIndex(target)
    else if (editingSizeIndex === target) setEditingSizeIndex(index)
  }

  const removeSize = (index: number) => {
    setForm({ ...form, sizes: form.sizes.filter((_, i) => i !== index) })
    if (editingSizeIndex !== null) clearSizeInputs()
  }

  const handleTypeChange = (type: ProductType) => {
    if (type === form.type) return
    if (form.sizes.length > 0 && !window.confirm(t('admin.confirmTypeChange'))) return
    const options = PRESENTATION_OPTIONS[type]
    const keepPresentation = options?.some((o) => o === form.presentation)
    setForm({ ...form, type, sizes: [], presentation: keepPresentation ? form.presentation : '' })
    clearSizeInputs()
  }

  const addPhotos = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const added: Photo[] = Array.from(files).map((file) => ({
      kind: 'file',
      file,
      preview: URL.createObjectURL(file),
    }))
    setPhotos((prev) => [...prev, ...added])
  }

  const removePhoto = (index: number) => {
    const removed = photoSrc(photos[index])
    revokePhoto(photos[index])
    setPhotos(photos.filter((_, i) => i !== index))
    // Los sabores que usaban esa foto quedan sin foto.
    setForm((prev) => ({
      ...prev,
      flavors: prev.flavors.map((f) => (f.photo === removed ? { ...f, photo: '' } : f)),
    }))
    if (flavorPhotoInput === removed) setFlavorPhotoInput('')
  }

  const clearFlavorInputs = () => {
    setFlavorInput('')
    setFlavorPhotoInput('')
    setFlavorError('')
  }

  const addFlavor = () => {
    setFlavorError('')
    const name = flavorInput.trim().replace(/\s+/g, ' ')
    if (!name) return setFlavorError(t('admin.flavorNameError'))
    if (form.flavors.some((f) => f.name.toLowerCase() === name.toLowerCase())) {
      return setFlavorError(t('admin.duplicateFlavorError', { flavor: name }))
    }
    setForm({ ...form, flavors: [...form.flavors, { name, photo: flavorPhotoInput }] })
    clearFlavorInputs()
  }

  const setFlavorPhoto = (index: number, photo: string) => {
    setForm({ ...form, flavors: form.flavors.map((f, i) => (i === index ? { ...f, photo } : f)) })
  }

  const moveFlavor = (index: number, delta: number) => {
    const target = index + delta
    if (target < 0 || target >= form.flavors.length) return
    const flavors = [...form.flavors]
    ;[flavors[index], flavors[target]] = [flavors[target], flavors[index]]
    setForm({ ...form, flavors })
  }

  const removeFlavor = (index: number) => {
    setForm({ ...form, flavors: form.flavors.filter((_, i) => i !== index) })
  }

  const movePhoto = (index: number, delta: number) => {
    const target = index + delta
    if (target < 0 || target >= photos.length) return
    const next = [...photos]
    ;[next[index], next[target]] = [next[target], next[index]]
    setPhotos(next)
  }

  const resetForm = () => {
    setForm(emptyForm)
    clearSizeInputs()
    clearFlavorInputs()
    photos.forEach(revokePhoto)
    setPhotos([])
    setEditingId(null)
    setError('')
  }

  const handleEdit = (p: Product) => {
    photos.forEach(revokePhoto)
    setEditingId(p.id)
    clearSizeInputs()
    clearFlavorInputs()
    setError('')
    setPhotos(p.images.map((url) => ({ kind: 'url', url })))
    setForm({
      name: p.name,
      gender: p.gender,
      type: p.type,
      price: String(p.price),
      benefits: p.benefits.join('\n'),
      presentation: normalizePresentation(p.presentation),
      sizes: (p.sizes ?? []).map(({ label, price }) => ({ label, price })),
      flavors: (p.flavors ?? []).map((f) => ({
        name: f.name,
        photo: f.image && p.images.includes(f.image) ? f.image : '',
      })),
      usage: p.usage,
      recommended: !!p.recommended,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('admin.confirmDelete'))) return
    try {
      await deleteDoc(doc(db, 'products', id))
      if (editingId === id) resetForm()
      setToast({ message: t('admin.deleted'), kind: 'success' })
    } catch (err) {
      console.error(err)
      setToast({ message: t('admin.deleteError'), kind: 'error' })
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    const usesSizes = !!sizeOptions
    if (usesSizes) {
      if (form.sizes.length === 0) return setError(t('admin.sizesRequiredError'))
    } else if (!isValidPrice(form.price)) {
      return setError(t('admin.priceError'))
    }

    setSaving(true)
    try {
      const images = await Promise.all(
        photos.map((p) => (p.kind === 'url' ? p.url : uploadProductImage(p.file))),
      )
      // Cada sabor guarda la URL final de su foto (las fotos nuevas recién se subieron).
      const uploadedBySrc = new Map(photos.map((p, i) => [photoSrc(p), images[i]]))
      const flavors = form.flavors.map((f) => {
        const image = uploadedBySrc.get(f.photo)
        return image ? { name: f.name, image } : { name: f.name }
      })

      const data = {
        name: form.name.trim(),
        gender: form.gender,
        type: form.type,
        price: usesSizes ? getLowestPrice(form.sizes) : Number(form.price),
        benefits: form.benefits.split('\n').filter(Boolean),
        presentation: presentationOptions ? form.presentation : '',
        sizes: usesSizes ? form.sizes : [],
        flavors,
        usage: form.usage,
        recommended: form.recommended,
        images,
      }

      if (editingId) {
        // `stock: deleteField()` limpia el stock que guardaban los productos viejos.
        await updateDoc(doc(db, 'products', editingId), { ...data, stock: deleteField() })
      } else {
        await addDoc(collection(db, 'products'), { ...data, createdAt: Date.now() })
      }
      resetForm()
      setToast({ message: t('admin.saved'), kind: 'success' })
    } catch (err) {
      setError(t('admin.saveError'))
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <span className="eyebrow" data-aos="fade-up">{t('admin.eyebrow')}</span>
      <h1 className="section-title mt-2" data-aos="fade-up">{t('admin.title')}</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <input
          className="input-field"
          placeholder={t('admin.namePlaceholder')}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        {!sizeOptions && (
          <input
            className="input-field"
            type="number"
            min="0.01"
            step="0.01"
            placeholder={t('admin.pricePlaceholder')}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
        )}
        <select
          className="input-field"
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value as Gender })}
        >
          {Object.keys(GENDER_LABELS).map((k) => (
            <option key={k} value={k}>
              {t(`gender.${k}`)}
            </option>
          ))}
        </select>
        <select
          className="input-field"
          value={form.type}
          onChange={(e) => handleTypeChange(e.target.value as ProductType)}
        >
          {Object.keys(PRODUCT_TYPE_LABELS).map((k) => (
            <option key={k} value={k}>
              {t(`productType.${k}`)}
            </option>
          ))}
        </select>
        {presentationOptions && (
          <select
            className="input-field"
            value={form.presentation}
            onChange={(e) => setForm({ ...form, presentation: e.target.value })}
            required
          >
            <option value="" disabled>
              {t('admin.presentationPlaceholder')}
            </option>
            {presentationOptions.map((opt) => (
              <option key={opt} value={opt}>
                {t(`presentation.${opt}`)}
              </option>
            ))}
            {/* Presentación escrita a mano en productos viejos: se conserva para no perderla al editar. */}
            {form.presentation && !presentationOptions.some((o) => o === form.presentation) && (
              <option value={form.presentation}>{form.presentation}</option>
            )}
          </select>
        )}
        {sizeOptions && (
          <div className="md:col-span-2">
            <label className="text-xs uppercase tracking-widest text-taupe">
              {t('admin.sizesLabel')}
            </label>
            <div className="mt-1 flex flex-wrap gap-2">
              <div className="min-w-40 flex-1">
                <ComboBox
                  className="input-field w-full"
                  options={sizeOptions}
                  value={sizeInput}
                  onChange={setSizeInput}
                  placeholder={t('admin.sizePlaceholder')}
                  onKeyDown={onSizeKeyDown}
                />
              </div>
              <input
                className="input-field w-36"
                type="number"
                min="0.01"
                step="0.01"
                placeholder={t('admin.sizePricePlaceholder')}
                value={sizePriceInput}
                onChange={(e) => setSizePriceInput(e.target.value)}
                onKeyDown={onSizeKeyDown}
              />
              <button type="button" onClick={saveSize} className="btn-secondary px-5">
                {editingSizeIndex === null ? t('admin.addSize') : t('admin.updateSize')}
              </button>
              {editingSizeIndex !== null && (
                <button type="button" onClick={clearSizeInputs} className="px-2 text-xs text-taupe hover:underline">
                  {t('admin.cancelSizeEdit')}
                </button>
              )}
            </div>
            {sizeError && <p className="mt-1.5 text-xs text-red-700">{sizeError}</p>}
            {form.sizes.length > 0 && (
              <ul className="mt-2.5 divide-y divide-beige-dark border-y border-beige-dark">
                {form.sizes.map((s, i) => (
                  <li
                    key={s.label}
                    className={`flex items-center gap-3 px-2 py-2 text-xs text-ink ${editingSizeIndex === i ? 'bg-beige' : ''}`}
                  >
                    <span className="flex-1">
                      {s.label} — {money(s.price)}
                    </span>
                    <button type="button" onClick={() => editSize(i)} className="text-olive hover:underline">
                      {t('admin.edit')}
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSize(i, -1)}
                      disabled={i === 0}
                      aria-label={t('admin.moveSizeUp', { size: s.label })}
                      className="text-taupe hover:text-ink disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSize(i, 1)}
                      disabled={i === form.sizes.length - 1}
                      aria-label={t('admin.moveSizeDown', { size: s.label })}
                      className="text-taupe hover:text-ink disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSize(i)}
                      aria-label={t('admin.removeSize', { size: s.label })}
                      className="text-taupe hover:text-red-700"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <textarea
          className="input-field md:col-span-2"
          rows={3}
          placeholder={t('admin.benefitsPlaceholder')}
          value={form.benefits}
          onChange={(e) => setForm({ ...form, benefits: e.target.value })}
        />
        <textarea
          className="input-field md:col-span-2"
          rows={2}
          placeholder={t('admin.usagePlaceholder')}
          value={form.usage}
          onChange={(e) => setForm({ ...form, usage: e.target.value })}
        />
        <div className="md:col-span-2">
          <label className="text-xs uppercase tracking-widest text-taupe">
            {t('admin.photosLabel')}
          </label>
          {photos.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-3">
              {photos.map((p, i) => (
                <div key={photoSrc(p)} className="relative h-24 w-24 overflow-hidden bg-beige">
                  <img src={photoSrc(p)} alt="" className="h-full w-full object-cover" />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 bg-ink px-1.5 py-0.5 text-[10px] text-cream">
                      {t('admin.mainPhoto')}
                    </span>
                  )}
                  <div className="absolute right-0 bottom-0 left-0 flex justify-between bg-ink/60 px-1 text-cream">
                    <button
                      type="button"
                      onClick={() => movePhoto(i, -1)}
                      disabled={i === 0}
                      aria-label={t('admin.movePhotoLeft')}
                      className="px-1 disabled:opacity-30"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      aria-label={t('admin.removePhoto')}
                      className="px-1 hover:text-red-300"
                    >
                      ✕
                    </button>
                    <button
                      type="button"
                      onClick={() => movePhoto(i, 1)}
                      disabled={i === photos.length - 1}
                      aria-label={t('admin.movePhotoRight')}
                      className="px-1 disabled:opacity-30"
                    >
                      →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <input
            className="input-field mt-2"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              addPhotos(e.target.files)
              e.target.value = ''
            }}
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs uppercase tracking-widest text-taupe">
            {t('admin.flavorsLabel')}
          </label>
          <div className="mt-1 flex flex-wrap gap-2">
            <input
              className="input-field min-w-40 flex-1"
              placeholder={t('admin.flavorPlaceholder')}
              value={flavorInput}
              onChange={(e) => setFlavorInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addFlavor()
                }
              }}
            />
            {photos.length > 0 && (
              <select
                className="input-field w-40"
                value={flavorPhotoInput}
                onChange={(e) => setFlavorPhotoInput(e.target.value)}
                aria-label={t('admin.flavorPhotoLabel')}
              >
                <option value="">{t('admin.flavorNoPhoto')}</option>
                {photos.map((p, i) => (
                  <option key={photoSrc(p)} value={photoSrc(p)}>
                    {t('admin.flavorPhotoOption', { n: i + 1 })}
                  </option>
                ))}
              </select>
            )}
            <button type="button" onClick={addFlavor} className="btn-secondary px-5">
              {t('admin.addFlavor')}
            </button>
          </div>
          {flavorError && <p className="mt-1.5 text-xs text-red-700">{flavorError}</p>}
          {form.flavors.length > 0 && (
            <ul className="mt-2.5 divide-y divide-beige-dark border-y border-beige-dark">
              {form.flavors.map((f, i) => (
                <li key={f.name} className="flex items-center gap-3 px-2 py-2 text-xs text-ink">
                  <div className="h-9 w-9 shrink-0 overflow-hidden bg-beige">
                    {f.photo && <img src={f.photo} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <span className="flex-1">{f.name}</span>
                  {photos.length > 0 && (
                    <select
                      className="border border-beige-dark bg-transparent px-1.5 py-1 text-xs"
                      value={f.photo}
                      onChange={(e) => setFlavorPhoto(i, e.target.value)}
                      aria-label={t('admin.flavorPhotoFor', { flavor: f.name })}
                    >
                      <option value="">{t('admin.flavorNoPhoto')}</option>
                      {photos.map((p, pi) => (
                        <option key={photoSrc(p)} value={photoSrc(p)}>
                          {t('admin.flavorPhotoOption', { n: pi + 1 })}
                        </option>
                      ))}
                    </select>
                  )}
                  <button
                    type="button"
                    onClick={() => moveFlavor(i, -1)}
                    disabled={i === 0}
                    aria-label={t('admin.moveFlavorUp', { flavor: f.name })}
                    className="text-taupe hover:text-ink disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveFlavor(i, 1)}
                    disabled={i === form.flavors.length - 1}
                    aria-label={t('admin.moveFlavorDown', { flavor: f.name })}
                    className="text-taupe hover:text-ink disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFlavor(i)}
                    aria-label={t('admin.removeFlavor', { flavor: f.name })}
                    className="text-taupe hover:text-red-700"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <label className="flex items-center gap-2 text-sm text-ink md:col-span-2">
          <input
            type="checkbox"
            checked={form.recommended}
            onChange={(e) => setForm({ ...form, recommended: e.target.checked })}
          />
          {t('admin.showRecommended')}
        </label>

        {error && <p className="text-sm text-red-700 md:col-span-2">{error}</p>}

        <div className="flex gap-3 md:col-span-2">
          <button className="btn-primary" disabled={saving}>
            {saving ? t('admin.saving') : editingId ? t('admin.update') : t('admin.addProduct')}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              {t('admin.cancelEdit')}
            </button>
          )}
        </div>
      </form>

      <div className="mt-12" data-aos="fade-up">
        <h2 className="text-sm uppercase tracking-widest text-taupe">
          {t('admin.currentProducts', { count: products.length })}
        </h2>
        <div className="mt-4 divide-y divide-beige-dark border-y border-beige-dark">
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-4 py-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden bg-beige">
                {p.images[0] && (
                  <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-ink">{p.name}</p>
                <p className="text-xs text-taupe">
                  {t(`gender.${p.gender}`)} · {t(`productType.${p.type}`)}
                </p>
              </div>
              <p className="text-sm text-ink">{money(getProductPrice(p))}</p>
              <button onClick={() => handleEdit(p)} className="text-xs text-olive hover:underline">
                {t('admin.edit')}
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-xs text-taupe hover:text-red-700"
              >
                {t('admin.delete')}
              </button>
            </div>
          ))}
        </div>
      </div>

      {toast && (
        <div
          role={toast.kind === 'error' ? 'alert' : 'status'}
          className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 px-5 py-3 text-sm shadow-lg ${
            toast.kind === 'error' ? 'bg-red-700 text-white' : 'bg-ink text-cream'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}
