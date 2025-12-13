import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { sounds } from '../utils/soundManager'
import { triggerConfetti } from '../utils/confetti'
import './Auth.css'

function Register({ onNavigate }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    age: '',
    grade_level: '',
    role: 'student'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { register } = useAuth()
  const { showSuccess, showError } = useToast()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      const errorMsg = 'Passwords do not match'
      setError(errorMsg)
      showError(errorMsg)
      sounds.error()
      return
    }

    if (formData.password.length < 6) {
      const errorMsg = 'Password must be at least 6 characters'
      setError(errorMsg)
      showError(errorMsg)
      sounds.error()
      return
    }

    setLoading(true)
    sounds.click()

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        age: parseInt(formData.age),
        grade_level: parseInt(formData.grade_level),
        role: formData.role
      }

      await register(userData)
      
      sounds.success()
      triggerConfetti()
      showSuccess('Account created successfully! Welcome to EggJam! 🎉')
    } catch (err) {
      const errorMsg = err.message || 'Registration failed. Please try again.'
      setError(errorMsg)
      showError(errorMsg)
      sounds.error()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box glass-panel large">
        <div className="auth-header">
          <h1 className="text-gradient">Join EggJam! 🎉</h1>
          <p>Start your journey to better mental health and growth</p>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Your name"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Age *</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="15"
                min="10"
                max="25"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Grade *</label>
              <select
                name="grade_level"
                value={formData.grade_level}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select grade</option>
                {[6,7,8,9,10,11,12].map(grade => (
                  <option key={grade} value={grade}>Grade {grade}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                minLength="6"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label>I am a:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="student">Student</option>
              <option value="parent">Parent</option>
              <option value="counselor">Counselor</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <div className="terms-checkbox">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account?</p>
          <button
            className="switch-btn"
            onClick={() => onNavigate('login')}
            disabled={loading}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default Register
