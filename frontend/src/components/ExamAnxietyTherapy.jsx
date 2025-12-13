import { useState, useEffect } from 'react'
import { examAnxietyAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './ExamAnxietyTherapy.css'

function ExamAnxietyTherapy() {
  const [phase, setPhase] = useState('assessment') // assessment, exposure, practice, results
  const [anxietyLevel, setAnxietyLevel] = useState(5)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [isTestActive, setIsTestActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(600) // 10 minutes
  const [showBreathing, setShowBreathing] = useState(false)
  const [completedLevels, setCompletedLevels] = useState([])
  const [anxietyHistory, setAnxietyHistory] = useState([])
  
  const { user } = useAuth()
  const userId = user?.id || 'demo-user-123'

  const exposureLevels = [
    {
      level: 1,
      name: 'Beginner: No Pressure',
      description: 'Short quiz with no time limit. Just get comfortable with the format.',
      duration: null,
      questions: 5,
      stakes: 'Practice only - no scoring'
    },
    {
      level: 2,
      name: 'Gentle Timer',
      description: 'Same quiz, but now with a generous 20-minute timer.',
      duration: 1200,
      questions: 5,
      stakes: 'Low pressure - plenty of time'
    },
    {
      level: 3,
      name: 'Moderate Challenge',
      description: '10 questions in 15 minutes. Building stamina.',
      duration: 900,
      questions: 10,
      stakes: 'Medium challenge'
    },
    {
      level: 4,
      name: 'Real Exam Simulation',
      description: 'Full 20-question test in 20 minutes. Exam-like conditions.',
      duration: 1200,
      questions: 20,
      stakes: 'Simulated exam pressure'
    },
    {
      level: 5,
      name: 'Master Level',
      description: 'Toughest questions, time pressure. You\'re ready!',
      duration: 900,
      questions: 15,
      stakes: 'High pressure - confidence building'
    }
  ]

  const cognitiveReframes = [
    {
      negative: "I'm going to fail",
      positive: "I'm prepared and capable",
      technique: "Evidence-based reframing"
    },
    {
      negative: "Everyone will think I'm stupid",
      positive: "This is about my learning, not others' opinions",
      technique: "Perspective shift"
    },
    {
      negative: "One bad grade ruins everything",
      positive: "One test is a tiny part of my journey",
      technique: "Big picture thinking"
    },
    {
      negative: "I can't handle the pressure",
      positive: "I've handled challenges before and I can do this",
      technique: "Past success reminder"
    }
  ]

  useEffect(() => {
    let timer
    if (isTestActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
    } else if (timeRemaining === 0) {
      setIsTestActive(false)
    }
    return () => clearInterval(timer)
  }, [isTestActive, timeRemaining])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const startExposure = (level) => {
    setCurrentLevel(level)
    setPhase('exposure')
  }

  const startTest = async () => {
    const level = exposureLevels[currentLevel - 1]
    setTimeRemaining(level.duration || 600)
    setIsTestActive(true)
    
    try {
      await examAnxietyAPI.startSession(userId, currentLevel)
    } catch (err) {
      console.error('Error starting session:', err)
    }
  }

  const completeLevel = async () => {
    setCompletedLevels([...completedLevels, currentLevel])
    setAnxietyHistory([...anxietyHistory, { level: currentLevel, anxiety: anxietyLevel }])
    setIsTestActive(false)
    setPhase('results')
    
    try {
      await examAnxietyAPI.submitResults(userId, {
        level: currentLevel,
        final_anxiety: anxietyLevel,
        completed_at: new Date().toISOString()
      })
    } catch (err) {
      console.error('Error submitting results:', err)
    }
  }

  const emergencyCalm = () => {
    setShowBreathing(true)
  }

  return (
    <div className="exam-anxiety-container">
      <header className="anxiety-header">
        <h1 className="text-gradient">🧘 Exam Anxiety Therapy</h1>
        <p className="anxiety-subtitle">
          Scientifically-proven CBT techniques to conquer exam fear
        </p>
      </header>

      {/* Emergency Calm Button - Always Visible */}
      <button className="emergency-calm-btn" onClick={emergencyCalm}>
        🚨 EMERGENCY CALM
      </button>

      {/* Assessment Phase */}
      {phase === 'assessment' && (
        <div className="assessment-phase">
          <div className="intro-section glass-panel">
            <h2>How Does Exam Anxiety Therapy Work?</h2>
            <p>
              This program uses <strong>Graduated Exposure Therapy</strong> - a proven technique 
              where you gradually face your fear in a safe, controlled way. Each level gets slightly 
              more challenging, building your confidence step by step.
            </p>
            <div className="science-note">
              <strong>🧠 The Science:</strong> Your brain learns that exams aren't actually dangerous. 
              With each successful exposure, anxiety decreases naturally.
            </div>
          </div>

          <div className="anxiety-assessment glass-panel">
            <h3>Step 1: Rate Your Current Anxiety</h3>
            <p>How anxious do you feel about exams right now? (1 = calm, 10 = panic)</p>
            
            <div className="anxiety-slider">
              <input
                type="range"
                min="1"
                max="10"
                value={anxietyLevel}
                onChange={(e) => setAnxietyLevel(parseInt(e.target.value))}
                className="slider"
              />
              <div className="anxiety-labels">
                <span>😊 Calm</span>
                <span className="current-level">{anxietyLevel}</span>
                <span>😰 Panic</span>
              </div>
            </div>

            <div className={`anxiety-feedback level-${anxietyLevel}`}>
              {anxietyLevel <= 3 && "✅ You're doing great! Light anxiety is normal."}
              {anxietyLevel > 3 && anxietyLevel <= 6 && "⚠️ Moderate anxiety - this program can help!"}
              {anxietyLevel > 6 && "🚨 High anxiety detected - let's work through this together."}
            </div>
          </div>

          <div className="levels-overview glass-panel">
            <h3>Step 2: Choose Your Starting Level</h3>
            <p>Start wherever feels comfortable. You can repeat levels anytime.</p>
            
            <div className="levels-grid">
              {exposureLevels.map((level, index) => (
                <div key={level.level} className="level-card">
                  <div className="level-number">Level {level.level}</div>
                  <h4>{level.name}</h4>
                  <p>{level.description}</p>
                  <div className="level-details">
                    <span>⏰ {level.duration ? formatTime(level.duration) : 'No limit'}</span>
                    <span>📝 {level.questions} questions</span>
                  </div>
                  <div className="stakes-badge">{level.stakes}</div>
                  <button
                    className="start-level-btn"
                    onClick={() => startExposure(level.level)}
                    disabled={level.level > 1 && !completedLevels.includes(level.level - 1)}
                  >
                    {completedLevels.includes(level.level) ? '✓ Completed' : 
                     level.level > 1 && !completedLevels.includes(level.level - 1) ? '🔒 Locked' : 
                     'Start Level'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="cognitive-section glass-panel">
            <h3>Cognitive Restructuring Toolkit</h3>
            <p>Challenge negative thoughts with evidence-based reframes:</p>
            <div className="reframes-list">
              {cognitiveReframes.map((reframe, index) => (
                <div key={index} className="reframe-item">
                  <div className="negative-thought">
                    ❌ <em>"{reframe.negative}"</em>
                  </div>
                  <div className="arrow">→</div>
                  <div className="positive-thought">
                    ✅ <strong>"{reframe.positive}"</strong>
                  </div>
                  <div className="technique-label">{reframe.technique}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Exposure Phase */}
      {phase === 'exposure' && (
        <div className="exposure-phase">
          <div className="exposure-header glass-panel">
            <button className="back-btn" onClick={() => setPhase('assessment')}>
              ← Back to Levels
            </button>
            <h2>Level {currentLevel}: {exposureLevels[currentLevel - 1].name}</h2>
            {isTestActive && exposureLevels[currentLevel - 1].duration && (
              <div className={`timer ${timeRemaining < 60 ? 'warning' : ''}`}>
                ⏰ {formatTime(timeRemaining)}
              </div>
            )}
          </div>

          {!isTestActive ? (
            <div className="pre-test glass-panel">
              <h3>🌟 Before You Start</h3>
              <p>{exposureLevels[currentLevel - 1].description}</p>
              
              <div className="breathing-prompt">
                <h4>Take 3 Deep Breaths</h4>
                <p>Inhale for 4, hold for 4, exhale for 6. Ground yourself.</p>
                <div className="breath-animation"></div>
              </div>

              <div className="pre-test-checklist">
                <label>
                  <input type="checkbox" />
                  <span>I'm in a quiet space</span>
                </label>
                <label>
                  <input type="checkbox" />
                  <span>I did my breathing exercise</span>
                </label>
                <label>
                  <input type="checkbox" />
                  <span>I remember: this is practice, not real</span>
                </label>
              </div>

              <button className="begin-test-btn" onClick={startTest}>
                🚀 Begin Test
              </button>
            </div>
          ) : (
            <div className="test-active glass-panel">
              <div className="test-header">
                <h3>Question 1 of {exposureLevels[currentLevel - 1].questions}</h3>
                <div className="anxiety-check">
                  <span>Anxiety level now:</span>
                  <div className="quick-anxiety">
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <button
                        key={num}
                        className={`anxiety-btn ${anxietyLevel === num ? 'active' : ''}`}
                        onClick={() => setAnxietyLevel(num)}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="question-content">
                <h4>Sample Question: What is 15 × 12?</h4>
                <div className="options">
                  <button className="option-btn">A) 150</button>
                  <button className="option-btn">B) 180</button>
                  <button className="option-btn">C) 200</button>
                  <button className="option-btn">D) 175</button>
                </div>
              </div>

              <div className="test-actions">
                <button className="calm-btn" onClick={() => setShowBreathing(true)}>
                  🧘 Quick Calm
                </button>
                <button className="next-btn">
                  Next Question →
                </button>
              </div>

              <button className="finish-test-btn" onClick={completeLevel}>
                Finish Test
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results Phase */}
      {phase === 'results' && (
        <div className="results-phase glass-panel">
          <div className="results-celebration">
            <div className="success-icon">🎉</div>
            <h2>Level {currentLevel} Complete!</h2>
            <p>You faced your anxiety and succeeded. That's real progress!</p>
          </div>

          <div className="anxiety-comparison">
            <div className="comparison-chart">
              <div className="before">
                <span>Before Test</span>
                <div className="anxiety-bar" style={{width: `${anxietyLevel * 10}%`}}>
                  {anxietyLevel}
                </div>
              </div>
              <div className="after">
                <span>During Test</span>
                <div className="anxiety-bar success" style={{width: `${Math.max(anxietyLevel - 2, 1) * 10}%`}}>
                  {Math.max(anxietyLevel - 2, 1)}
                </div>
              </div>
            </div>
            <p className="insight">
              ✨ Notice how anxiety decreased? Your brain is learning!
            </p>
          </div>

          <div className="next-steps">
            <h3>What's Next?</h3>
            <button className="retry-btn" onClick={() => setPhase('exposure')}>
              🔄 Repeat This Level
            </button>
            {currentLevel < 5 && (
              <button className="advance-btn" onClick={() => {
                setCurrentLevel(currentLevel + 1)
                setPhase('exposure')
              }}>
                ⬆️ Advance to Level {currentLevel + 1}
              </button>
            )}
            <button className="done-btn" onClick={() => setPhase('assessment')}>
              ✓ Back to Overview
            </button>
          </div>
        </div>
      )}

      {/* Breathing Modal */}
      {showBreathing && (
        <div className="modal-overlay" onClick={() => setShowBreathing(false)}>
          <div className="breathing-modal glass-panel" onClick={(e) => e.stopPropagation()}>
            <h2>Box Breathing (4-4-4-4)</h2>
            <div className="breathing-circle">
              <div className="breath-text">Breathe</div>
            </div>
            <div className="breathing-instructions">
              <p>Inhale (4s) → Hold (4s) → Exhale (4s) → Hold (4s)</p>
            </div>
            <button className="close-breathing" onClick={() => setShowBreathing(false)}>
              Iweel Calm Now
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExamAnxietyTherapy
