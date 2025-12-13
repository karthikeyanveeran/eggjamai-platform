import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { moodAPI } from '../services/api'
import { sounds } from '../utils/soundManager'
import './MoodTracker.css'

const moodEmojis = [
  { value: 1, emoji: '😢', label: 'Very Bad', color: '#dc2626' },
  { value: 2, emoji: '😟', label: 'Bad', color: '#ea580c' },
  { value: 3, emoji: '😕', label: 'Not Great', color: '#f59e0b' },
  { value: 4, emoji: '😐', label: 'Okay', color: '#eab308' },
  { value: 5, emoji: '🙂', label: 'Fine', color: '#84cc16' },
  { value: 6, emoji: '😊', label: 'Good', color: '#22c55e' },
  { value: 7, emoji: '😄', label: 'Great', color: '#10b981' },
  { value: 8, emoji: '😁', label: 'Very Good', color: '#14b8a6' },
  { value: 9, emoji: '🤩', label: 'Excellent', color: '#06b6d4' },
  { value: 10, emoji: '🥳', label: 'Amazing', color: '#3b82f6' }
]

const emotionOptions = [
  { id: 'happy', emoji: '😊', label: 'Happy' },
  { id: 'sad', emoji: '😢', label: 'Sad' },
  { id: 'anxious', emoji: '😰', label: 'Anxious' },
  { id: 'angry', emoji: '😠', label: 'Angry' },
  { id: 'stressed', emoji: '😫', label: 'Stressed' },
  { id: 'calm', emoji: '😌', label: 'Calm' },
  { id: 'energetic', emoji: '⚡', label: 'Energetic' },
  { id: 'tired', emoji: '😴', label: 'Tired' }
]

function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState(null)
  const [selectedEmotions, setSelectedEmotions] = useState([])
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Get user from auth context
  const { user } = useAuth()
  const userId = user?.id || 'demo-user-123'
  
  // Get toast notifications
  const { showSuccess, showError } = useToast()

  const handleEmotionToggle = (emotionId) => {
    sounds.click()
    setSelectedEmotions(prev => 
      prev.includes(emotionId)
        ? prev.filter(id => id !== emotionId)
        : [...prev, emotionId]
    )
  }
  
  const handleMoodSelect = (moodValue) => {
    sounds.click()
    setSelectedMood(moodValue)
  }

  const handleSubmit = async () => {
    if (!selectedMood) return

    setLoading(true)
    sounds.click()
    
    const moodEntry = {
      user_id: userId,
      mood_score: selectedMood,
      emotions: selectedEmotions,
      notes,
      timestamp: new Date().toISOString()
    }

    try {
      // Save to backend
      await moodAPI.logMood(
        userId,
        selectedMood,
        selectedEmotions,
        notes
      )
      
      sounds.moodLog()
      showSuccess('Mood logged successfully! 🎉')
      setSubmitted(true)

      // Reset form after 2 seconds
      setTimeout(() => {
        setSelectedMood(null)
        setSelectedEmotions([])
        setNotes('')
        setSubmitted(false)
      }, 2000)
    } catch (err) {
      console.error('Error logging mood:', err)
      showError('Failed to log mood. Please try again.')
      sounds.error()
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="mood-tracker-container">
        <div className="success-message glass-panel">
          <div className="success-icon">✓</div>
          <h2>Mood Logged Successfully!</h2>
          <p>Keep tracking your mood daily to see your progress</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mood-tracker-container">
      <header className="mood-header">
        <h1 className="text-gradient">Daily Mood Check-In</h1>
        <p className="subtitle">How are you feeling today?</p>
      </header>

      {/* Mood Selection */}
      <div className="mood-selection glass-panel">
        <h2>Select Your Mood</h2>
        <div className="mood-grid">
          {moodEmojis.map((mood) => (
            <button
              key={mood.value}
              className={`mood-option ${selectedMood === mood.value ? 'selected' : ''}`}
              onClick={() => handleMoodSelect(mood.value)}
              style={{
                borderColor: selectedMood === mood.value ? mood.color : 'transparent'
              }}
            >
              <div className="mood-emoji">{mood.emoji}</div>
              <div className="mood-label">{mood.label}</div>
              <div className="mood-number">{mood.value}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Emotion Tags */}
      {selectedMood && (
        <div className="emotion-tags glass-panel">
          <h2>What emotions are you experiencing?</h2>
          <div className="emotion-grid">
            {emotionOptions.map((emotion) => (
              <button
                key={emotion.id}
                className={`emotion-tag ${selectedEmotions.includes(emotion.id) ? 'selected' : ''}`}
                onClick={() => handleEmotionToggle(emotion.id)}
              >
                <span className="emotion-emoji">{emotion.emoji}</span>
                <span className="emotion-label">{emotion.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {selectedMood && (
        <div className="mood-notes glass-panel">
          <h2>Any thoughts to share? (Optional)</h2>
          <textarea
            className="notes-input"
            placeholder="Write about your day, what made you feel this way, or anything on your mind..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="5"
          />
        </div>
      )}

      {/* Submit Button */}
      {selectedMood && (
        <div className="submit-section">
          <button 
            className="submit-mood-button"
            onClick={handleSubmit}
          >
            Log My Mood
          </button>
        </div>
      )}
    </div>
  )
}

export default MoodTracker
