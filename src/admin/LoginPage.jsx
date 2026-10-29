import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import '../styles/Login.css'

export default function LoginPage() {
  const { isAuthed, loading, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const from = location.state?.from
  const redirectTo = from?.startsWith('/admin') ? from : '/admin'
  if (!loading && isAuthed) return <Navigate to={redirectTo} replace />

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await login(form.email.trim(), form.password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="login">
      <form className="login-card" onSubmit={submit} noValidate>
        <div className="login-brand">
          <span>METRO</span>
          <small>JEWELLERS</small>
        </div>

        <h1>Admin sign in</h1>
        <p>Enter your details to manage the website.</p>

        {error && <div className="login-error" role="alert">{error}</div>}

        <label className="login-field">
          <span>Email</span>
          <input
            type="email"
            autoComplete="username"
            value={form.email}
            onChange={set('email')}
            placeholder="admin@example.com"
            required
            autoFocus
          />
        </label>

        <label className="login-field">
          <span>Password</span>
          <div className="login-password">
            <input
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              value={form.password}
              onChange={set('password')}
              placeholder="Your password"
              required
            />
            <button type="button" onClick={() => setShow((v) => !v)} aria-pressed={show}>
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>

        <button type="submit" className="login-submit" disabled={busy || !form.email || !form.password}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>

        <a className="login-back" href="/">← Back to website</a>
      </form>
    </main>
  )
}
