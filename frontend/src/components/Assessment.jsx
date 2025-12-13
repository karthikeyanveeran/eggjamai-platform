import { useState } from 'react'
import { assessmentAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { sounds } from '../utils/soundManager'
import './Assessment.css'

const assessmentTypes = {
  phq9: {
    title: 'PHQ-9 Depression Screening',
    description: 'This questionnaire helps assess symptoms of depression over the past 2 weeks.',
    icon: '💭'
  },
  gad7: {
    title: 'GAD-7 Anxiety Screening',
    description: 'This questionnaire helps assess symptoms of anxiety over the past 2 weeks.',
    icon: '😰'
  }
}

function Assessment() {
  const [selectedType, setSelectedType] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Get user from auth context
  const { user } = useAuth()
  const userId = user?.id || 'demo-user-123'
  
  // Get toast notifications
  const { showSuccess, showError, showWarning } = useToast()

  const startAssessment = async (type) => {
    sounds.click()
    setLoading(true)
    setError(null)
    try {
      const questionsData = await assessmentAPI.getQuestions(type)
      setQuestions(questionsData)
      setSelectedType(type)
      setAnswers({})
      setResult(null)
      sounds.whoosh()
    } catch (err) {
      console.error('Error loading questions:', err)
      const errorMsg = 'Failed to load assessment questions. Please try again.'
      setError(errorMsg)
      showError(errorMsg)
      sounds.error()
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionId, score) => {
    sounds.click()
    setAnswers(prev => ({
      ...prev,
      [questionId]: score
    }))
  }

  const submitAssessment = async () => {
    // Validate all questions answered
    if (Object.keys(answers).length !== questions.length) {
      const errorMsg = 'Please answer all questions'
      setError(errorMsg)
      showWarning(errorMsg)
      sounds.error()
      return
    }

    sounds.click()
    setLoading(true)
    setError(null)
    try {
      const answersArray = Object.entries(answers).map(([questionId, score]) => ({
        question_id: parseInt(questionId),
        score: score
      }))

      const resultData = await assessmentAPI.submitAssessment(
        userId,
        selectedType,
        answersArray
      )

      setResult(resultData)
      sounds.success()
      showSuccess('Assessment completed successfully!')
    } catch (err) {
      console.error('Error submitting assessment:', err)
      const errorMsg = 'Failed to submit assessment. Please try again.'
      setError(errorMsg)
      showError(errorMsg)
      sounds.error()
    } finally {
      setLoading(false)
    }
  }

  const resetAssessment = () => {
    setSelectedType(null)
    setQuestions([])
    setAnswers({})
    setResult(null)
    setError(null)
  }

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'severe': return '#dc2626'
      case 'moderately_severe': return '#ea580c'
      case 'moderate': return '#f59e0b'
      case 'mild': return '#eab308'
      default: return '#10b981'
    }
  }

  // Assessment selection screen
  if (!selectedType && !result) {
    return (
      <div className="assessment-container">
        <header className="assessment-header">
          <h1 className="text-gradient">Mental Health Assessment</h1>
          <p className="subtitle">
            Take a quick, confidential assessment to understand your mental wellbeing
          </p>
        </header>

        <div className="assessment-cards">
          {Object.entries(assessmentTypes).map(([key, info]) => (
            <div key={key} className="assessment-card glass-panel" onClick={() => startAssessment(key)}>
              <div className="card-icon">{info.icon}</div>
              <h3>{info.title}</h3>
              <p>{info.description}</p>
              <button className="start-button">Start Assessment →</button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Assessment questions screen
  if (selectedType && !result) {
    const currentInfo = assessmentTypes[selectedType]
    const allAnswered = Object.keys(answers).length === questions.length

    return (
      <div className="assessment-container">
        <div className="assessment-progress glass-panel">
          <button className="back-button" onClick={resetAssessment}>← Back</button>
          <div className="progress-info">
            <h2>{currentInfo.title}</h2>
            <p>Question {Object.keys(answers).length} of {questions.length}</p>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
          </div>
        )}

        <div className="questions-container">
          {questions.map((q) => (
            <div key={q.id} className="question-card glass-panel">
              <h3 className="question-text">{q.question}</h3>
              <div className="options-grid">
                {q.options.map((option, index) => (
                  <button
                    key={index}
                    className={`option-button ${answers[q.id] === index ? 'selected' : ''}`}
                    onClick={() => handleAnswerChange(q.id, index)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="submit-container">
          <button 
            className="submit-button"
            onClick={submitAssessment}
            disabled={!allAnswered || loading}
          >
            {loading ? 'Submitting...' : 'Submit Assessment'}
          </button>
        </div>
      </div>
    )
  }

  // Results screen
  if (result) {
    return (
      <div className="assessment-container">
        <div className="result-card glass-panel">
          <div className="result-header">
            <h2>Your Results</h2>
            <div 
              className="severity-badge" 
              style={{ backgroundColor: getSeverityColor(result.severity_level) }}
            >
              {result.severity_level.replace('_', ' ').toUpperCase()}
            </div>
          </div>

          <div className="score-display">
            <div className="score-number">{result.total_score}</div>
            <p className="score-label">Total Score</p>
          </div>

          <div className="interpretation-section">
            <h3>What This Means</h3>
            <p>{result.interpretation}</p>
          </div>

          <div className="recommendations-section">
            <h3>Recommendations</h3>
            <ul className="recommendations-list">
              {result.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>

          {result.needs_professional_help && (
            <div className="help-alert">
              <span>⚠️</span>
              <div>
                <strong>Professional support recommended</strong>
                <p>Based on your responses, we strongly encourage you to speak with a mental health professional.</p>
              </div>
            </div>
          )}

          <div className="result-actions">
            <button className="primary-button" onClick={resetAssessment}>
              Take Another Assessment
            </button>
            <button className="secondary-button">
              Talk to EggJam AI
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default Assessment
