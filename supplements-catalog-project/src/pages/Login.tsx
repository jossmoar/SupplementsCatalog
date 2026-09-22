import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'

type Mode = 'login' | 'signup' | 'reset'

export function Login() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const { login, signup, resetPassword } = useAuth()
  const navigate = useNavigate()

  const switchMode = (next: Mode) => {
    setMode(next)
    setError('')
    setResetSent(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
        navigate('/catalogo')
      } else if (mode === 'signup') {
        await signup(name, email, password)
        navigate('/catalogo')
      } else {
        await resetPassword(email)
        setResetSent(true)
      }
    } catch (err) {
      setError(mode === 'reset' ? t('login.resetError') : t('login.error'))
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <span className="eyebrow text-center" data-aos="fade-up">
        {mode === 'login'
          ? t('login.welcomeBack')
          : mode === 'signup'
            ? t('login.createAccount')
            : t('login.resetEyebrow')}
      </span>
      <h1 className="section-title mt-2 text-center" data-aos="fade-up">
        {mode === 'login' ? t('login.signIn') : mode === 'signup' ? t('login.signUp') : t('login.resetTitle')}
      </h1>

      {mode === 'reset' && resetSent ? (
        <div className="mt-8 text-center" data-aos="fade-up">
          <p className="text-sm text-ink">{t('login.resetSent')}</p>
          <button
            className="mt-6 text-center text-xs uppercase tracking-widest text-taupe hover:text-ink"
            onClick={() => switchMode('login')}
          >
            {t('login.backToLogin')}
          </button>
        </div>
      ) : (
        <>
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
            {mode !== 'reset' && (
              <input
                className="input-field"
                type="password"
                placeholder={t('login.password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            )}
            {mode === 'login' && (
              <button
                type="button"
                onClick={() => switchMode('reset')}
                className="block text-xs text-taupe hover:text-ink"
              >
                {t('login.forgotPassword')}
              </button>
            )}
            {error && <p className="text-sm text-red-700">{error}</p>}
            <button className="btn-primary w-full" disabled={loading}>
              {loading
                ? t('login.processing')
                : mode === 'login'
                  ? t('login.enter')
                  : mode === 'signup'
                    ? t('login.createAccountBtn')
                    : t('login.sendResetLink')}
            </button>
          </form>

          <button
            className="mt-6 text-center text-xs uppercase tracking-widest text-taupe hover:text-ink"
            onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
          >
            {mode === 'signup' ? t('login.haveAccount') : mode === 'reset' ? t('login.backToLogin') : t('login.noAccount')}
          </button>
        </>
      )}
    </div>
  )
}
