import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'

export function Account() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, profile, isAdmin, logout, updateUserProfile } = useAuth()
  const [name, setName] = useState(profile?.name ?? '')
  const [phone, setPhone] = useState(profile?.phone ?? '')
  const [address, setAddress] = useState(profile?.address ?? '')
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await updateUserProfile({ name, phone, address })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <span className="eyebrow" data-aos="fade-up">{t('account.eyebrow')}</span>
      <h1 className="section-title mt-2" data-aos="fade-up">{t('account.title')}</h1>
      <p className="mt-2 text-sm text-taupe" data-aos="fade-up">{user?.email}</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4" data-aos="fade-up" data-aos-delay="100">
        <div>
          <label className="text-[9.5px] tracking-[0.18em] text-taupe uppercase">{t('account.name')}</label>
          <input className="input-field mt-1" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="text-[9.5px] tracking-[0.18em] text-taupe uppercase">{t('account.phone')}</label>
          <input className="input-field mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label className="text-[9.5px] tracking-[0.18em] text-taupe uppercase">{t('account.address')}</label>
          <textarea
            className="input-field mt-1"
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <button className="btn-primary w-full">{saved ? t('account.saved') : t('account.save')}</button>
      </form>

      <div className="mt-10 flex flex-col" data-aos="fade-up" data-aos-delay="150">
        {isAdmin && (
          <Link
            to="/admin"
            className="flex items-center justify-between border-t border-hairline py-3.5 text-sm text-olive"
          >
            <span>{t('nav.admin')}</span>
            <span>›</span>
          </Link>
        )}
        <button
          onClick={() => {
            logout()
            navigate('/')
          }}
          className="flex items-center justify-between border-t border-b border-hairline py-3.5 text-sm text-taupe"
        >
          <span>{t('nav.logout')}</span>
          <span>›</span>
        </button>
      </div>
    </div>
  )
}
