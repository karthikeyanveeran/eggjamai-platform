import { useState } from 'react'
import { mediatorAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './ParentMediator.css'

function ParentMediator() {
  const { user } = useAuth()
  const userId = user?.id || 'demo-user-123'
  const [originalMessage, setOriginalMessage] = useState('')
  const [improvedMessage, setImprovedMessage] = useState('')
  const [toneAnalysis, setToneAnalysis] = useState(null)
  const [showTemplates, setShowTemplates] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  const templates = [
    {
      id: 1,
      situation: 'Discussing Grades',
      original: "My grades are bad and it's your fault for pressuring me!",
      improved: "I'm struggling with my grades and feeling overwhelmed by the pressure. Can we talk about what support I need?"
    },
    {
      id: 2,
      situation: 'Setting Boundaries',
      original: "Stop controlling everything I do!",
      improved: "I appreciate your concern, but I'd like more independence in some areas. Can we discuss which decisions I can make on my own?"
    },
    {
      id: 3,
      situation: 'Asking for Help',
      original: "I can't handle this anymore.",
      improved: "I'm feeling really stressed and could use your support. Can we talk about what's been difficult for me?"
    }
  ]

  const analyzeMessage = async () => {
    if (!originalMessage.trim()) return

    try {
      const [toneResult, improveResult] = await Promise.all([
        mediatorAPI.analyzeTone(originalMessage),
        mediatorAPI.improveMessage(originalMessage)
      ])

      setToneAnalysis({
        tone: toneResult,
        improvements: improveResult.changes,
        suggestions: improveResult.improved
      })
      setImprovedMessage(improveResult.improved)
    } catch (error) {
      console.error("Using offline analysis fallback", error)
      // Fallback to local logic
      const analysis = {
        tone: detectTone(originalMessage),
        improvements: [
          'Add empathy markers',
          'Soften absolute language',
          'Use "I feel" statements'
        ],
        suggestions: generateImprovedVersion(originalMessage)
      }
  
      setToneAnalysis(analysis)
      setImprovedMessage(analysis.suggestions)
    }
  }

  const detectTone = (text) => {
    const aggressive = ['fault', 'never', 'always', 'hate', 'stupid']
    const defensive = ['but', 'not my fault', 'you said']
    const open = ['feel', 'need', 'help', 'understand', 'together']

    const lowerText = text.toLowerCase()
    
    if (aggressive.some(word => lowerText.includes(word))) {
      return { type: 'aggressive', color: '#ef4444', label: '🔴 Aggressive' }
    } else if (defensive.some(word => lowerText.includes(word))) {
      return { type: 'defensive', color: '#f59e0b', label: '🟡 Defensive' }
    } else if (open.some(word => lowerText.includes(word))) {
      return { type: 'constructive', color: '#10b981', label: '🟢 Constructive' }
    }
    
    return { type: 'neutral', color: '#6b7280', label: '⚪ Neutral' }
  }

  const generateImprovedVersion = (text) => {
    // Simple transformation rules
    let improved = text
    improved = improved.replace(/your fault/gi, 'the situation')
    improved = improved.replace(/you never/gi, 'sometimes I notice')
    improved = improved.replace(/you always/gi, 'often')
    improved = improved.replace(/I hate/gi, 'I find it challenging')
    
    // Add "I feel" if not present
    if (!improved.toLowerCase().includes('i feel')) {
      improved = `I feel ${improved}`
    }
    
    return improved
  }

  const useTemplate = (template) => {
    setOriginalMessage(template.original)
    setImprovedMessage(template.improved)
    setToneAnalysis(detectTone(template.original))
    setSelectedTemplate(template)
    setShowTemplates(false)
  }

  const sendToParent = () => {
    alert('Message sent to parent!')
    setOriginalMessage('')
    setImprovedMessage('')
    setToneAnalysis(null)
  }

  return (
    <div className="parent-mediator-container">
      <header className="mediator-header">
        <h1 className="text-gradient">💬 Parent Communication Helper</h1>
        <p className="mediator-subtitle">
          Express your feelings to parents in a way that gets heard
        </p>
      </header>

      <div className="how-it-works glass-panel">
        <h3>How This Works</h3>
        <div className="steps-grid">
          <div className="step">
            <div className="step-icon">1️⃣</div>
            <p><strong>Write</strong> what you really want to say</p>
          </div>
          <div className="step">
            <div className="step-icon">2️⃣</div>
            <p><strong>AI improves</strong> tone while keeping your message</p>
          </div>
          <div className="step">
            <div className="step-icon">3️⃣</div>
            <p><strong>Review</strong> and adjust as needed</p>
          </div>
          <div className="step">
            <div className="step-icon">4️⃣</div>
            <p><strong>Send</strong> directly or use as a guide</p>
          </div>
        </div>
      </div>

      <div className="main-content">
        {/* Original Message */}
        <div className="message-section glass-panel">
          <div className="section-header">
            <h3>What You Want to Say</h3>
            <button className="templates-btn" onClick={() => setShowTemplates(!showTemplates)}>
              📋 Use Template
            </button>
          </div>
          
          <textarea
            value={originalMessage}
            onChange={(e) => setOriginalMessage(e.target.value)}
            placeholder="Write exactly what you're thinking... be honest, we'll help refine it."
            rows="6"
            className="message-input"
          />

          {toneAnalysis && (
            <div className="tone-indicator" style={{backgroundColor: toneAnalysis.tone.color + '20', borderColor: toneAnalysis.tone.color}}>
              <strong>Current Tone:</strong> {toneAnalysis.tone.label}
            </div>
          )}

          <button 
            className="improve-btn"
            onClick={analyzeMessage}
            disabled={!originalMessage.trim()}
          >
            ✨ Improve My Message
          </button>
        </div>

        {/* Improved Message */}
        {improvedMessage && (
          <div className="improved-section glass-panel">
            <h3>Improved Version</h3>
            <div className="comparison">
              <div className="before">
                <h4>Before:</h4>
                <p className="before-text">{originalMessage}</p>
              </div>
              <div className="arrow">→</div>
              <div className="after">
                <h4>After:</h4>
                <p className="after-text">{improvedMessage}</p>
              </div>
            </div>

            {toneAnalysis && toneAnalysis.improvements && (
              <div className="improvements-made">
                <h4>What We Changed:</h4>
                <ul>
                  {toneAnalysis.improvements.map((imp, idx) => (
                    <li key={idx}>✓ {imp}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="improved-actions">
              <textarea
                value={improvedMessage}
                onChange={(e) => setImprovedMessage(e.target.value)}
                rows="6"
                className="edit-improved"
                placeholder="Edit if needed..."
              />

              <div className="action-buttons">
                <button className="preview-btn">
                  👁️ Preview
                </button>
                <button className="send-btn" onClick={sendToParent}>
                  📤 Send to Parent
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Templates Modal */}
      {showTemplates && (
        <div className="modal-overlay" onClick={() => setShowTemplates(false)}>
          <div className="templates-modal glass-panel" onClick={(e) => e.stopPropagation()}>
            <h2>Message Templates</h2>
            <p>Common situations - click to use</p>
            <div className="templates-list">
              {templates.map(template => (
                <div key={template.id} className="template-card" onClick={() => useTemplate(template)}>
                  <h4>{template.situation}</h4>
                  <div className="template-preview">
                    <div className="template-before">
                      <strong>Before:</strong>
                      <p>{template.original}</p>
                    </div>
                    <div className="template-after">
                      <strong>After:</strong>
                      <p>{template.improved}</p>
                    </div>
                  </div>
                  <button className="use-template-btn">Use This</button>
                </div>
              ))}
            </div>
            <button className="close-modal-btn" onClick={() => setShowTemplates(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Parent Education */}
      <div className="parent-education glass-panel">
        <h3>📚 Why Communication Matters</h3>
        <div className="education-grid">
          <div className="education-card">
            <h4>For You</h4>
            <ul>
              <li>Reduces conflict</li>
              <li>Gets your needs met</li>
              <li>Builds trust</li>
              <li>Teaches life skills</li>
            </ul>
          </div>
          <div className="education-card">
            <h4>For Parents</h4>
            <ul>
              <li>Helps them understand</li>
              <li>Reduces their anxiety</li>
              <li>Shows maturity</li>
              <li>Opens dialogue</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="communication-tips glass-panel">
        <h3>💡 Communication Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">🎯</div>
            <h4>Be Specific</h4>
            <p>"I need help with math homework" vs "You never help me"</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">💙</div>
            <h4>Use "I" Statements</h4>
            <p>"I feel stressed when..." vs "You make me stressed"</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🕐</div>
            <h4>Pick the Right Time</h4>
            <p>Not when they're busy or stressed</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🤝</div>
            <h4>Show Appreciation</h4>
            <p>Start with something positive</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParentMediator
