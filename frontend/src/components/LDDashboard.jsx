import { useState, useEffect } from 'react'
import { ldAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './LDDashboard.css'

function LDDashboard() {
  const { user } = useAuth()
  const userId = user?.id || 'demo-user-123'
  const [phase, setPhase] = useState('intro') // intro, tests, results
  const [testResults, setTestResults] = useState(null)
  const [currentTest, setCurrentTest] = useState(null)

  useEffect(() => {
    const fetchScreening = async () => {
      try {
        const userId = user?.id || 1
        const results = await ldAPI.getScreening(userId)
        if (results) {
          setTestResults(results)
          // If we have results, we might want to show them, but maybe let user choose to retake?
          // For now, let's just store them. If we want to auto-show, we'd set phase('results')
          // setPhase('results') 
        }
      } catch (error) {
        console.error('Error fetching screening results:', error)
      }
    }
    fetchScreening()
  }, [user])

  const screeningResults = {
    adhd_probability: 0.45,
    dyslexia_probability: 0.62,
    dyscalculia_probability: 0.28,
    processing_disorder_probability: 0.35,
    overall_recommendation: "moderate_concern"
  }

  const cognitiveTests = [
    {
      id: 'memory',
      name: 'Working Memory Game',
      icon: '🧠',
      description: 'Remember and repeat patterns',
      duration: '5 min',
      fun_factor: '⭐⭐⭐⭐⭐'
    },
    {
      id: 'attention',
      name: 'Focus Challenge',
      icon: '🎯',
      description: 'Track moving objects',
      duration: '3 min',
      fun_factor: '⭐⭐⭐⭐'
    },
    {
      id: 'processing',
      name: 'Speed Test',
      icon: '⚡',
      description: 'Quick decision making',
      duration: '4 min',
      fun_factor: '⭐⭐⭐⭐⭐'
    }
  ]

  const startTest = (test) => {
    setCurrentTest(test)
    // In production, launch actual test
    alert(`Starting ${test.name}...`)
    
    // Simulate test completion and API submission
    setTimeout(async () => {
      try {
        const userId = user?.id || 1
        // Mock results for the specific test
        const mockTestResult = {
          test_id: test.id,
          score: Math.random() * 100,
          completion_time: 180
        }
        
        await ldAPI.submitCognitiveTest(userId, mockTestResult)
        
        setCurrentTest(null)
        setPhase('results')
        setTestResults(screeningResults) // In real app, this would come from the API response or updated screening
      } catch (error) {
        console.error('Error submitting test:', error)
        // Fallback
        setCurrentTest(null)
        setPhase('results')
        setTestResults(screeningResults)
      }
    }, 2000)
  }

  const getProbabilityLevel = (prob) => {
    if (prob < 0.3) return { level: 'low', color: '#10b981', text: 'Low likelihood' }
    if (prob < 0.6) return { level: 'moderate', color: '#f59e0b', text: 'Moderate markers' }
    return { level: 'high', color: '#ef4444', text: 'Significant markers' }
  }

  const downloadReport = () => {
    alert('Downloading professional screening report PDF...')
  }

  return (
    <div className="ld-dashboard-container">
      <header className="ld-header">
        <h1 className="text-gradient">🧩 Learning Style Screening</h1>
        <p className="ld-subtitle">
          Fun brain games that help identify your unique learning profile
        </p>
      </header>

      {/* Important Disclaimer */}
      <div className="disclaimer glass-panel">
        <div className="disclaimer-icon">⚠️</div>
        <div className="disclaimer-content">
          <h3>IMPORTANT: This is NOT a Medical Diagnosis</h3>
          <p>
            These are screening tools that identify patterns. <strong>Only qualified  professionals 
            (psychologists, neuropsychologists) can diagnose learning disabilities.</strong> If results 
            show concerns, we recommend professional evaluation.
          </p>
        </div>
      </div>

      {/* Intro Phase */}
      {phase === 'intro' && (
        <div className="intro-section">
          <div className="what-is-ld glass-panel">
            <h2>What Are We Screening For?</h2>
            <div className="ld-types-grid">
              <div className="ld-type-card">
                <h4>🎯 ADHD/Attention</h4>
                <p>Difficulty focusing, staying organized, or controlling impulses</p>
              </div>
              <div className="ld-type-card">
                <h4>📖 Dyslexia</h4>
                <p>Challenges with reading, spelling, or decoding words</p>
              </div>
              <div className="ld-type-card">
                <h4>🔢 Dyscalculia</h4>
                <p>Difficulty understanding numbers and math concepts</p>
              </div>
              <div className="ld-type-card">
                <h4>⚡ Processing Speed</h4>
                <p>Taking longer to process and respond to information</p>
              </div>
            </div>
          </div>

          <div className="benefits glass-panel">
            <h2>Why Early Identification Helps</h2>
            <div className="benefits-list">
              <div className="benefit-item">
                <span className="benefit-icon">✅</span>
                <div>
                  <strong>Accommodations</strong>
                  <p>Get extra time, different teaching methods, or assistive technology</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">✅</span>
                <div>
                  <strong>Understanding</strong>
                  <p>Know it's not about being "lazy" or "stupid" - your brain works differently</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">✅</span>
                <div>
                  <strong>Support</strong>
                  <p>Access specialized resources and strategies that work for you</p>
                </div>
              </div>
            </div>
          </div>

          <div className="tests-overview glass-panel">
            <h2>Fun Brain Games</h2>
            <p>Play these games - they're designed to assess cognitive skills!</p>
            <div className="tests-grid">
              {cognitiveTests.map(test => (
                <div key={test.id} className="test-card">
                  <div className="test-icon">{test.icon}</div>
                  <h3>{test.name}</h3>
                  <p>{test.description}</p>
                  <div className="test-meta">
                    <span>⏱️ {test.duration}</span>
                    <span>{test.fun_factor}</span>
                  </div>
                  <button className="play-test-btn" onClick={() => startTest(test)}>
                    🎮 Play Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button className="skip-to-results-btn" onClick={() => {
            setTestResults(screeningResults)
            setPhase('results')
          }}>
            View Sample Results
          </button>
        </div>
      )}

      {/* Results Phase */}
      {phase === 'results' && testResults && (
        <div className="results-section">
          <div className="results-header glass-panel">
            <h2>Your Screening Results</h2>
            <p>Based on your performance across multiple assessments</p>
            <button className="download-report-btn" onClick={downloadReport}>
              📥 Download Professional Report
            </button>
          </div>

          {/* Probability Scores */}
          <div className="probabilities-section glass-panel">
            <h3>Marker Probabilities</h3>
            <div className="probabilities-grid">
              <div className="probability-card">
                <h4>ADHD/Attention Markers</h4>
                <div className="probability-circle" style={{
                  background: `conic-gradient(${getProbabilityLevel(testResults.adhd_probability).color} ${testResults.adhd_probability * 360}deg, var(--color-surface) 0deg)`
                }}>
                  <div className="circle-inner">
                    {Math.round(testResults.adhd_probability * 100)}%
                  </div>
                </div>
                <div className="probability-label" style={{color: getProbabilityLevel(testResults.adhd_probability).color}}>
                  {getProbabilityLevel(testResults.adhd_probability).text}
                </div>
              </div>

              <div className="probability-card">
                <h4>Dyslexia Markers</h4>
                <div className="probability-circle" style={{
                  background: `conic-gradient(${getProbabilityLevel(testResults.dyslexia_probability).color} ${testResults.dyslexia_probability * 360}deg, var(--color-surface) 0deg)`
                }}>
                  <div className="circle-inner">
                    {Math.round(testResults.dyslexia_probability * 100)}%
                  </div>
                </div>
                <div className="probability-label" style={{color: getProbabilityLevel(testResults.dyslexia_probability).color}}>
                  {getProbabilityLevel(testResults.dyslexia_probability).text}
                </div>
              </div>

              <div className="probability-card">
                <h4>Dyscalculia Markers</h4>
                <div className="probability-circle" style={{
                  background: `conic-gradient(${getProbabilityLevel(testResults.dyscalculia_probability).color} ${testResults.dyscalculia_probability * 360}deg, var(--color-surface) 0deg)`
                }}>
                  <div className="circle-inner">
                    {Math.round(testResults.dyscalculia_probability * 100)}%
                  </div>
                </div>
                <div className="probability-label" style={{color: getProbabilityLevel(testResults.dyscalculia_probability).color}}>
                  {getProbabilityLevel(testResults.dyscalculia_probability).text}
                </div>
              </div>

              <div className="probability-card">
                <h4>Processing Speed</h4>
                <div className="probability-circle" style={{
                  background: `conic-gradient(${getProbabilityLevel(testResults.processing_disorder_probability).color} ${testResults.processing_disorder_probability * 360}deg, var(--color-surface) 0deg)`
                }}>
                  <div className="circle-inner">
                    {Math.round(testResults.processing_disorder_probability * 100)}%
                  </div>
                </div>
                <div className="probability-label" style={{color: getProbabilityLevel(testResults.processing_disorder_probability).color}}>
                  {getProbabilityLevel(testResults.processing_disorder_probability).text}
                </div>
              </div>
            </div>
          </div>

          {/* What This Means */}
          <div className="interpretation glass-panel">
            <h3>What Does This Mean?</h3>
            <div className="interpretation-content">
              <div className="interpretation-item">
                <strong>Dyslexia Markers (62%):</strong>
                <p>
                  You showed some patterns associated with dyslexia, such as [specific patterns].
                  This doesn't mean you have dyslexia - it means a professional evaluation could be helpful.
                </p>
              </div>
              <div className="interpretation-item">
                <strong>ADHD Markers (45%):</strong>
                <p>
                  Moderate indicators. Many students have attention challenges without ADHD.
                  If you struggle with focus, organization, or impulsivity, professional screening is recommended.
                </p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="recommendations glass-panel">
            <h3>🎯 Recommended Next Steps</h3>
            <div className="recommendations-list">
              <div className="recommendation-item urgent">
                <div className="rec-number">1</div>
                <div className="rec-content">
                  <strong>Get a Professional Evaluation</strong>
                  <p>Share this report with a licensed psychologist or neuropsychologist for comprehensive testing.</p>
                  <button className="action-btn">Find Specialists Near You</button>
                </div>
              </div>
              <div className="recommendation-item">
                <div className="rec-number">2</div>
                <div className="rec-content">
                  <strong>Talk to Your School</strong>
                  <p>Request accommodations like extra time, audiobooks, or assistive technology.</p>
                </div>
              </div>
              <div className="recommendation-item">
                <div className="rec-number">3</div>
                <div className="rec-content">
                  <strong>Use Adaptive Strategies</strong>
                  <p>We'll customize your learning experience based on your profile.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="resources-section glass-panel">
            <h3>📚 Helpful Resources</h3>
            <div className="resources-grid">
              <div className="resource-card">
                <h4>For Students</h4>
                <ul>
                  <li>Understanding Your Brain</li>
                  <li>Self-Advocacy Tips</li>
                  <li>Study Strategies That Work</li>
                </ul>
              </div>
              <div className="resource-card">
                <h4>For Parents</h4>
                <ul>
                  <li>Navigating Diagnosis</li>
                  <li>School Accommodations Guide</li>
                  <li>Support Groups</li>
                </ul>
              </div>
              <div className="resource-card">
                <h4>Professional Help</h4>
                <ul>
                  <li>Find a Psychologist</li>
                  <li>Special Education Services</li>
                  <li>Assistive Technology</li>
                </ul>
              </div>
            </div>
          </div>

          <button className="retake-btn" onClick={() => setPhase('intro')}>
            🔄 Retake Tests
          </button>
        </div>
      )}
    </div>
  )
}

export default LDDashboard
