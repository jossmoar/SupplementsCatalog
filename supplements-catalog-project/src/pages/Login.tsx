import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'

export function Login() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await signup(name, email, password)
      }
      navigate('/catalogo')
    } catch (err) {
      setError(t('login.error'))
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <span className="eyebrow text-center" data-aos="fade-up">
        {mode === 'login' ? t('login.welcomeBack') : t('login.createAccount')}
      </span>
      <h1 className="section-title mt-2 text-center" data-aos="fade-up">
        {mode === 'login' ? t('login.signIn') : t('login.signUp')}
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4" data-aos="fade-up" data-aos-delay="100">
        {mode === 'signup' && (
          <input
            className="input-field"
            placeholder={t('login.fullName')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          className="input-field"
          type="email"
          placeholder={t('login.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input-field"
          type="password"
          placeholder={t('login.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? t('login.processing') : mode === 'login' ? t('login.enter') : t('login.createAccountBtn')}
        </button>
      </form>

      <button
        className="mt-6 text-center text-xs uppercase tracking-widest text-taupe hover:text-ink"
        onClick={() => setMode((m) => (m === 'login' ? 'signup' : 'login'))}
      >
        {mode === 'login' ? t('login.noAccount') : t('login.haveAccount')}
      </button>
    </div>
  )
}
