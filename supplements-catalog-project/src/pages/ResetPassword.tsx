import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'

type Status = 'verifying' | 'invalid' | 'form' | 'success'

export function ResetPassword() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { verifyResetCode, confirmReset } = useAuth()

  const oobCode = searchParams.get('oobCode')

  const [status, setStatus] = useState<Status>('verifying')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!oobCode) {
      setStatus('invalid')
      return
    }
    verifyResetCode(oobCode)
      .then((verifiedEmail) => {
        setEmail(verifiedEmail)
        setStatus('form')
      })
      .catch(() => setStatus('invalid'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oobCode])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError(t('resetPassword.weakError'))
      return
    }
    if (password !== confirmPassword) {
      setError(t('resetPassword.mismatchError'))
      return
    }

    setLoading(true)
    try {
      await confirmReset(oobCode as string, password)
      setStatus('success')
    } catch (err) {
      setError(t('resetPassword.genericError'))
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <span className="eyebrow text-center" data-aos="fade-up">
        {t('resetPassword.eyebrow')}
      </span>
      <h1 className="section-title mt-2 text-center" data-aos="fade-up">
        {status === 'success'
          ? t('resetPassword.successTitle')
          : status === 'invalid'
            ? t('resetPassword.invalidTitle')
            : t('resetPassword.title')}
      </h1>

      {status === 'verifying' && (
        <p className="mt-8 text-center text-sm text-taupe" data-aos="fade-up">
          {t('resetPassword.verifying')}
        </p>
      )}

      {status === 'invalid' && (
        <div className="mt-8 text-center" data-aos="fade-up">
          <p className="text-sm text-ink">{t('resetPassword.invalidMessage')}</p>
          <button className="btn-primary mt-6" onClick={() => navigate('/login')}>
            {t('resetPassword.requestNewLink')}
          </button>
        </div>
      )}

      {status === 'form' && (
        <>
          {email && (
            <p className="mt-4 text-center text-xs text-taupe" data-aos="fade-up" data-aos-delay="50">
              {email}
            </p>
          )}
          <form onSubmit={handleSubmit} className="mt-8 space-y-4" data-aos="fade-up" data-aos-delay="100">
            <input
              className="input-field"
              type="password"
              placeholder={t('resetPassword.passwordLabel')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
            <input
              className="input-field"
              type="password"
              placeholder={t('resetPassword.confirmPasswordLabel')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
              required
            />
            {error && <p className="text-sm text-red-700">{error}</p>}
            <button className="btn-primary w-full" disabled={loading}>
              {loading ? t('resetPassword.processing') : t('resetPassword.submit')}
            </button>
          </form>
        </>
      )}

      {status === 'success' && (
        <div className="mt-8 text-center" data-aos="fade-up">
          <p className="text-sm text-ink">{t('resetPassword.successMessage')}</p>
          <button className="btn-primary mt-6" onClick={() => navigate('/login')}>
            {t('resetPassword.goToLogin')}
          </button>
        </div>
      )}
    </div>
  )
}
