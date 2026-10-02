import { useState, type FormEvent } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
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

const emptyForm = {
  name: '',
  gender: 'unisex' as Gender,
  type: 'proteinas' as ProductType,
  price: '',
  benefits: '',
  presentation: '',
  sizes: [] as ProductSize[],
  usage: '',
  stock: '',
  recommended: false,
}

export function Admin() {
  const { t } = useTranslation()
  const { products } = useProducts()
  const [form, setForm] = useState(emptyForm)
  const [sizeInput, setSizeInput] = useState('')
  const [sizePriceInput, setSizePriceInput] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const sizeOptions = SIZE_OPTIONS[form.type]

  const addSize = () => {
    const label = sizeInput.trim()
    const price = Number(sizePriceInput)
    if (!label || !sizePriceInput || Number.isNaN(price) || price <= 0) return
    if (form.sizes.some((s) => s.label === label)) return
    setForm({ ...form, sizes: [...form.sizes, { label, price }] })
    setSizeInput('')
    setSizePriceInput('')
  }

  const removeSize = (label: string) => {
    setForm({ ...form, sizes: form.sizes.filter((s) => s.label !== label) })
  }

  const resetForm = () => {
    setForm(emptyForm)
    setSizeInput('')
    setSizePriceInput('')
    setFile(null)
    setEditingId(null)
  }

  const handleEdit = (p: Product) => {
    setEditingId(p.id)
    setSizeInput('')
    setSizePriceInput('')
    setForm({
      name: p.name,
      gender: p.gender,
      type: p.type,
      price: String(p.price),
      benefits: p.benefits.join('\n'),
      presentation: p.presentation,
      sizes: p.sizes ?? [],
      usage: p.usage,
      stock: String(p.stock),
      recommended: !!p.recommended,
    })
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('admin.confirmDelete'))) return
    await deleteDoc(doc(db, 'products', id))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    const usesSizes = !!sizeOptions
    if (usesSizes && form.sizes.length === 0) {
      setError(t('admin.sizesRequiredError'))
      return
    }

    setSaving(true)
    try {
      let imageUrl = ''
      if (file) {
        imageUrl = await uploadProductImage(file)
      }

      const data = {
        name: form.name,
        gender: form.gender,
        type: form.type,
        price: usesSizes ? form.sizes[0].price : Number(form.price),
        benefits: form.benefits.split('\n').filter(Boolean),
        presentation: form.presentation,
        sizes: usesSizes ? form.sizes : [],
        usage: form.usage,
        stock: Number(form.stock),
        recommended: form.recommended,
        ...(imageUrl ? { images: [imageUrl] } : {}),
      }

      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), data)
      } else {
        await addDoc(collection(db, 'products'), {
          ...data,
          images: imageUrl ? [imageUrl] : [],
          createdAt: Date.now(),
        })
      }
      resetForm()
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
          onChange={(e) => setForm({ ...form, type: e.target.value as ProductType })}
        >
          {Object.keys(PRODUCT_TYPE_LABELS).map((k) => (
            <option key={k} value={k}>
              {t(`productType.${k}`)}
            </option>
          ))}
        </select>
        <select
          className="input-field"
          value={form.presentation}
          onChange={(e) => setForm({ ...form, presentation: e.target.value })}
          required
        >
          <option value="" disabled>
            {t('admin.presentationPlaceholder')}
          </option>
          {PRESENTATION_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {sizeOptions && (
          <div className="md:col-span-2">
            <label className="text-xs uppercase tracking-widest text-taupe">
              {t('admin.sizesLabel')}
            </label>
            <div className="mt-1 flex gap-2">
              <ComboBox
                className="input-field flex-1"
                options={sizeOptions}
                value={sizeInput}
                onChange={setSizeInput}
                placeholder={t('admin.sizePlaceholder')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addSize()
                  }
                }}
              />
              <input
                className="input-field w-36"
                type="number"
                step="0.01"
                placeholder={t('admin.sizePricePlaceholder')}
                value={sizePriceInput}
                onChange={(e) => setSizePriceInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addSize()
                  }
                }}
              />
              <button type="button" onClick={addSize} className="btn-secondary px-5">
                {t('admin.addSize')}
              </button>
            </div>
            {form.sizes.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-2">
                {form.sizes.map((s) => (
                  <span
                    key={s.label}
                    className="flex items-center gap-1.5 rounded-full border border-beige-dark px-3 py-1.5 text-xs text-ink"
                  >
                    {s.label} — {money(s.price)}
                    <button
                      type="button"
                      onClick={() => removeSize(s.label)}
                      aria-label={t('admin.removeSize', { size: s.label })}
                      className="text-taupe hover:text-red-700"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
        <input
          className="input-field"
          type="number"
          placeholder={t('admin.stockPlaceholder')}
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          required
        />
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
            {t('admin.photoLabel')}
          </label>
          <input
            className="input-field mt-1"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
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
                  {t(`gender.${p.gender}`)} · {t(`productType.${p.type}`)} · {t('admin.stock')}: {p.stock}
                </p>
              </div>
              <p className="text-sm text-ink">{money(p.price)}</p>
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
    </div>
  )
}
