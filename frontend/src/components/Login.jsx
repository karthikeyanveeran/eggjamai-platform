import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { sounds } from '../utils/soundManager'
import './Auth.css'

function Login({ onNavigate }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useAuth()
  const { showSuccess, showError } = useToast()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    sounds.click()

    try {
      await login(email, password)
      sounds.success()
      showSuccess('Welcome back!')
    } catch (err) {
      const errorMsg = err.message || 'Invalid email or password'
      setError(errorMsg)
      showError(errorMsg)
      sounds.error()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box glass-panel">
        <div className="auth-header">
          <h1 className="text-gradient">Welcome Back! 👋</h1>
          <p>Login to continue your growth journey</p>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="forgot-password-btn"
              onClick={() => alert('Password reset email sent!')}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account?</p>
          <button
            className="switch-btn"
            onClick={() => onNavigate('register')}
            disabled={loading}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
