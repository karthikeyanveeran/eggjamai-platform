import { useState } from 'react'
import './InputArea.css'
import { sounds } from '../utils/soundManager'
import { useToast } from '../contexts/ToastContext'

function InputArea({ onSendMessage, disabled = false }) {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const { showInfo } = useToast()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message)
      setMessage('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const toggleRecording = () => {
    sounds.click()
    if (!isRecording) {
      showInfo('Voice recording coming soon! 🎤')
    }
    setIsRecording(!isRecording)
  }

  return (
    <div className="input-area glass-panel">
      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-container">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share what's on your mind..."
            rows="1"
            className="message-input"
            disabled={disabled}
          />
          
          <div className="input-actions">
            <button
              type="button"
              className={`voice-button ${isRecording ? 'recording' : ''}`}
              onClick={toggleRecording}
              title={isRecording ? 'Stop recording' : 'Start voice conversation'}
              disabled={disabled}
            >
              {isRecording ? (
                <svg className="recording-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              )}
            </button>

            <button
              type="submit"
              className="send-button"
              disabled={!message.trim() || disabled}
              title="Send message"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>

        {isRecording && (
          <div className="voice-visualizer">
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <span className="recording-text">Listening...</span>
          </div>
        )}
      </form>
    </div>
  )
}

export default InputArea
