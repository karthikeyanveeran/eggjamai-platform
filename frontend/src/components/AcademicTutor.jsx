import { useState } from 'react'
import { tutorAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './AcademicTutor.css'

function AcademicTutor() {
  const [subject, setSubject] = useState('Math')
  const [gradeLevel, setGradeLevel] = useState(10)
  const [question, setQuestion] = useState('')
  const [conversation, setConversation] = useState([])
  const [loading, setLoading] = useState(false)
  const [isVoiceRecording, setIsVoiceRecording] = useState(false)
  
  const { user } = useAuth()
  const userId = user?.id || 'demo-user-123'

  const subjects = [
    { id: 'math', name: 'Mathematics', icon: '🔢' },
    { id: 'science', name: 'Science', icon: '🔬' },
    { id: 'english', name: 'English', icon: '📚' },
    { id: 'history', name: 'History', icon: '🏛️' },
    { id: 'geography', name: 'Geography', icon: '🌍' },
    { id: 'physics', name: 'Physics', icon: '⚛️' },
    { id: 'chemistry', name: 'Chemistry', icon: '🧪' },
    { id: 'biology', name: 'Biology', icon: '🧬' }
  ]

  const askQuestion = async () => {
    if (!question.trim()) return

    const userMessage = {
      role: 'user',
      content: question,
      timestamp: new Date()
    }

    setConversation([...conversation, userMessage])
    setLoading(true)
    setQuestion('')

    try {
      const data = await tutorAPI.askQuestion(
        userId,
        subject,
        question,
        gradeLevel
      )

      const aiMessage = {
        role: 'assistant',
        content: data.response,
        gaps: data.identified_gaps,
        practice: data.suggested_practice,
        encouragement: data.encouragement,
        timestamp: new Date()
      }

      setConversation(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error:', error)
      // Mock response for demo
      const mockResponse = {
        role: 'assistant',
        content: `Great question about ${subject}! Let's think about this together. What do you already know about this topic? Let's start from there and build up your understanding step by step.`,
        encouragement: "You're asking great questions - that's how real learning happens!",
        timestamp: new Date()
      }
      setConversation(prev => [...prev, mockResponse])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      askQuestion()
    }
  }

  const toggleVoiceRecording = () => {
    setIsVoiceRecording(!isVoiceRecording)
    // Voice recording logic would go here
    if (!isVoiceRecording) {
      // Start recording
      console.log('Starting voice recording...')
    } else {
      // Stop and process
      console.log('Processing voice...')
    }
  }

  const clearConversation = () => {
    setConversation([])
  }

  return (
    <div className="academic-tutor-container">
      <header className="tutor-header">
        <h1 className="text-gradient">🎓 AI Academic Tutor</h1>
        <p className="tutor-subtitle">
          Get personalized help with homework - I'll guide you to understand, not just get answers!
        </p>
      </header>

      <div className="tutor-layout">
        {/* Subject Selector */}
        <aside className="subject-sidebar glass-panel">
          <h3>Select Subject</h3>
          <div className="subject-list">
            {subjects.map(sub => (
              <button
                key={sub.id}
                className={`subject-btn ${subject === sub.name ? 'active' : ''}`}
                onClick={() => setSubject(sub.name)}
              >
                <span className="subject-icon">{sub.icon}</span>
                <span>{sub.name}</span>
              </button>
            ))}
          </div>

          <div className="grade-selector">
            <label>Grade Level:</label>
            <select value={gradeLevel} onChange={(e) => setGradeLevel(parseInt(e.target.value))}>
              {[6, 7, 8, 9, 10, 11, 12].map(grade => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>
          </div>

          {conversation.length > 0 && (
            <button className="clear-btn" onClick={clearConversation}>
              🗑️ Clear Chat
            </button>
          )}
        </aside>

        {/* Main Chat Area */}
        <main className="tutor-main">
          <div className="conversation-area glass-panel">
            {conversation.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h2>Ask me anything about {subject}!</h2>
                <p>I'll help you understand concepts, not just give you answers.</p>
                <div className="example-questions">
                  <p><strong>Try asking:</strong></p>
                  <ul>
                    <li>"Why do we need to learn quadratic equations?"</li>
                    <li>"Can you explain photosynthesis simply?"</li>
                    <li>"I don't understand how fractions work"</li>
                    <li>"Help me solve this problem step by step"</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="conversation-messages">
                {conversation.map((msg, index) => (
                  <div key={index} className={`message ${msg.role}`}>
                    <div className="message-avatar">
                      {msg.role === 'user' ? '👤' : '🤖'}
                    </div>
                    <div className="message-content">
                      <div className="message-text">{msg.content}</div>
                      
                      {msg.role === 'assistant' && msg.gaps && msg.gaps.length > 0 && (
                        <div className="concept-gaps">
                          <h4>💡 Concepts to Review:</h4>
                          {msg.gaps.map((gap, i) => (
                            <div key={i} className="gap-item">
                              <strong>{gap.missing_concept}</strong>
                              <p>{gap.why_needed}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {msg.role === 'assistant' && msg.practice && msg.practice.length > 0 && (
                        <div className="practice-suggestions">
                          <h4>📚 Suggested Practice:</h4>
                          <ul>
                            {msg.practice.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {msg.role === 'assistant' && msg.encouragement && (
                        <div className="encouragement">
                          ✨ {msg.encouragement}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="message assistant">
                    <div className="message-avatar">🤖</div>
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="input-section">
            <div className="input-box glass-panel">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask about ${subject}... (Shift+Enter for new line)`}
                rows="3"
                disabled={loading}
              />
              <div className="input-actions">
                <button
                  className={`voice-btn ${isVoiceRecording ? 'recording' : ''}`}
                  onClick={toggleVoiceRecording}
                  disabled={loading}
                >
                  {isVoiceRecording ? '⏹️ Stop' : '🎤 Voice'}
                </button>
                <button
                  className="send-btn"
                  onClick={askQuestion}
                  disabled={loading || !question.trim()}
                >
                  {loading ? '⏳' : '➤'} Ask
                </button>
              </div>
            </div>

            <div className="input-hints">
              <span>💡 Pro tip: I teach you HOW to solve, not just WHAT the answer is</span>
            </div>
          </div>
        </main>

        {/* Quick Help Panel */}
        <aside className="help-panel glass-panel">
          <h3>How It Works</h3>
          <div className="help-steps">
            <div className="help-step">
              <div className="step-number">1</div>
              <p><strong>Ask Your Question</strong><br/>Type or speak your question</p>
            </div>
            <div className="help-step">
              <div className="step-number">2</div>
              <p><strong>Think Together</strong><br/>I'll guide you with questions</p>
            </div>
            <div className="help-step">
              <div className="step-number">3</div>
              <p><strong>Discover the Answer</strong><br/>You'll learn by understanding</p>
            </div>
          </div>

          <div className="help-features">
            <h4>✨ Features</h4>
            <ul>
              <li>✓ Socratic method teaching</li>
              <li>✓ Identifies knowledge gaps</li>
              <li>✓ Practice suggestions</li>
              <li>✓ Voice input support</li>
              <li>✓ Step-by-step guidance</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default AcademicTutor
