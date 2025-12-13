import { useState, useEffect } from 'react'
import { purposeAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './PurposeDiscovery.css'

function PurposeDiscovery() {
  const [step, setStep] = useState('interests') // interests, analysis, results
  const [interests, setInterests] = useState([])
  const [hobbies, setHobbies] = useState('')
  const [careerResults, setCareerResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedCareer, setSelectedCareer] = useState(null)
  
  const { user } = useAuth()
  const userId = user?.id || 'demo-user-123'

  const interestOptions = [
    { id: 'music', label: 'Music', icon: '🎵' },
    { id: 'gaming', label: 'Gaming', icon: '🎮' },
    { id: 'sports', label: 'Sports', icon: '⚽' },
    { id: 'art', label: 'Art & Design', icon: '🎨' },
    { id: 'reading', label: 'Reading', icon: '📚' },
    { id: 'coding', label: 'Coding', icon:'💻' },
    { id: 'dance', label: 'Dance', icon: '💃' },
    { id: 'cooking', label: 'Cooking', icon: '🍳' },
    { id: 'photography', label: 'Photography', icon: '📸' },
    { id: 'science', label: 'Science', icon: '🔬' },
    { id: 'writing', label: 'Writing', icon: '✍️' },
    { id: 'animals', label: 'Animals', icon: '🐾' },
    { id: 'nature', label: 'Nature', icon: '🌿' },
    { id: 'technology', label: 'Technology', icon: '🤖' },
    { id: 'fashion', label: 'Fashion', icon: '👗' },
    { id: 'volunteering', label: 'Helping Others', icon: '❤️' }
  ]

  const toggleInterest = (interestId) => {
    if (interests.includes(interestId)) {
      setInterests(interests.filter(i => i !== interestId))
    } else {
      setInterests([...interests, interestId])
    }
  }

  const discoverPurpose = async () => {
    if (interests.length === 0) {
      alert('Please select at least one interest!')
      return
    }

    setLoading(true)
    setStep('analysis')

    try {
      const data = await purposeAPI.discover(
        userId,
        16, // Default age or get from profile
        interests,
        ['I like creating things', 'Problem solving is fun'], // Context
        hobbies.split(',').map(h => h.trim()).filter(h => h)
      )
      setCareerResults(data)
      setStep('results')
    } catch (error) {
      console.error('Error:', error)
      // Show mock results for demo
      showMockResults()
    } finally {
      setLoading(false)
    }
  }

  const showMockResults = () => {
    // Mock data based on selected interests
    const mockCareers = [
      {
        career_name: interests.includes('coding') ? 'Software Engineer' : interests.includes('art') ? 'Creative Director' : 'Product Manager',
        match_percentage: 92,
        why_good_fit: `Based on your interests in ${interests.slice(0, 3).join(', ')}, you would thrive in this field. Your natural curiosity and creative problem-solving skills are perfect!`,
        required_skills: ['Communication', 'Critical thinking', 'Technical skills'],
        current_student_skills: interests,
        skill_gaps: ['Industry experience', 'Specific certifications'],
        education_path: [
          'Complete high school with focus on relevant subjects',
          'Bachelor\'s degree in related field',
          'Internships and projects',
          'Continuous learning'
        ],
        example_role_models: [
          { name: 'Successful Indian professionals in field', story: 'Started with similar interests' }
        ],
        salary_range: '₹5-15 LPA (entry) → ₹20-50 LPA (experienced)',
        growth_outlook: 'Excellent - High demand projected for next decade'
      },
      {
        career_name: interests.includes('helping') ? 'Counseling Psychologist' : 'UX Designer',
        match_percentage: 85,
        why_good_fit: 'Your empathy and attention to detail make you well-suited for this path.',
        required_skills: ['Psychology', 'Research', 'Counseling techniques'],
        current_student_skills: interests.slice(0, 2),
        skill_gaps: ['Formal education', 'Certification'],
        education_path: [
          'Psychology degree',
          'Master\'s in Counseling',
          'License/Certification',
          'Supervised practice'
        ],
        example_role_models: [{ name: 'Notable psychologists' }],
        salary_range: '₹3-8 LPA (starting) → ₹15-30 LPA (established)',
        growth_outlook: 'Growing - Increasing mental health awareness'
      }
    ]

    const mockSubjectRelevance = {
      'Math': `Math is crucial for ${mockCareers[0].career_name}! It teaches logical thinking and problem-solving - skills you'll use every single day.`,
      'Science': `Science principles directly apply to ${mockCareers[0].career_name}. Understanding how things work is fundamental to innovation.`,
      'English': `Communication is everything in ${mockCareers[0].career_name}. English helps you express complex ideas clearly - a superpower in any career!`,
      'History': `History teaches you to analyze patterns and understand human behavior - invaluable for ${mockCareers[0].career_name}.`
    }

    setCareerResults({
      user_id: 'demo-user',
      interests: interests,
      top_career_matches: mockCareers,
      current_subject_relevance: mockSubjectRelevance,
      next_exploration_steps: [
        `Watch YouTube videos about "${mockCareers[0].career_name}"`,
        `Find a professional to interview`,
        `Try a beginner project in this field`,
        `Join online communities`,
        `Take an online course`
      ]
    })
    setStep('results')
  }

  return (
    <div className="purpose-discovery-container">
      {step === 'interests' && (
        <div className="interests-step">
          <header className="purpose-header">
            <h1 className="text-gradient">✨ Discover Your Purpose</h1>
            <p className="purpose-subtitle">
              Let's find careers that match WHO YOU ARE, not just what you're good at
            </p>
          </header>

          <div className="interests-section glass-panel">
            <h2>What do you love doing? (Select all that apply)</h2>
            <div className="interests-grid">
              {interestOptions.map(option => (
                <button
                  key={option.id}
                  className={`interest-card ${interests.includes(option.id) ? 'selected' : ''}`}
                  onClick={() => toggleInterest(option.id)}
                >
                  <div className="interest-icon">{option.icon}</div>
                  <div className="interest-label">{option.label}</div>
                  {interests.includes(option.id) && <div className="checkmark">✓</div>}
                </button>
              ))}
            </div>

            <div className="hobbies-input">
              <label>Anything else you enjoy? (Optional)</label>
              <textarea
                value={hobbies}
                onChange={(e) => setHobbies(e.target.value)}
                placeholder="E.g., watching anime, fixing things, helping friends with problems..."
                rows="3"
              />
            </div>

            <button
              className="discover-btn"
              onClick={discoverPurpose}
              disabled={interests.length === 0}
            >
              🚀 Discover My Perfect Careers
            </button>

            <p className="selected-count">
              {interests.length} interests selected
            </p>
          </div>
        </div>
      )}

{step === 'analysis' && (
        <div className="analysis-step">
          <div className="analysis-animation glass-panel">
            <div className="loading-spinner"></div>
            <h2>🔍 Analyzing Your Profile...</h2>
            <div className="analysis-steps">
              <div className="analysis-item">✓ Identifying your natural strengths</div>
              <div className="analysis-item">✓ matching with career pathways</div>
              <div className="analysis-item">✓ Connecting to your future goals</div>
              <div className="analysis-item current">⏳ Generating your personalized roadmap</div>
            </div>
          </div>
        </div>
      )}

      {step === 'results' && careerResults && (
        <div className="results-step">
          <header className="results-header">
            <h1>🎯 Your Career Matches</h1>
            <p>Based on your interests: {interests.join(', ')}</p>
            <button className="retake-btn" onClick={() => setStep('interests')}>
              🔄 Retake Assessment
            </button>
          </header>

          <div className="careers-list">
            {careerResults.top_career_matches?.map((career, index) => (
              <div key={index} className="career-card glass-panel">
                <div className="career-header">
                  <div>
                    <h2>{career.career_name}</h2>
                    <div className="match-badge">{Math.round(career.match_percentage)}% Match</div>
                  </div>
                  <button
                    className="details-btn"
                    onClick={() => setSelectedCareer(selectedCareer === index ? null : index)}
                  >
                    {selectedCareer === index ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>

                <p className="why-fit">{career.why_good_fit}</p>

                {selectedCareer === index && (
                  <div className="career-details">
                    <div className="detail-section">
                      <h4>💪 Skills You Already Have:</h4>
                      <div className="skills-tags">
                        {career.current_student_skills?.map((skill, i) => (
                          <span key={i} className="skill-tag has">{skill}</span>
                        ))}
                      </div>
                    </div>

                    <div className="detail-section">
                      <h4>📈 Skills to Develop:</h4>
                      <div className="skills-tags">
                        {career.skill_gaps?.map((skill, i) => (
                          <span key={i} className="skill-tag need">{skill}</span>
                        ))}
                      </div>
                    </div>

                    <div className="detail-section">
                      <h4>🎓 Education Path:</h4>
                      <ol className="education-path">
                        {career.education_path?.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    <div className="detail-section">
                      <h4>💰 Potential Earnings:</h4>
                      <p>{career.salary_range}</p>
                    </div>

                    <div className="detail-section">
                      <h4>📊 Future Outlook:</h4>
                      <p>{career.growth_outlook}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="subject-relevance glass-panel">
            <h2>📚 Why Your School Subjects Matter</h2>
            <p className="relevance-intro">
              Here's how what you're learning NOW connects to your future career:
            </p>
            <div className="subjects-grid">
              {Object.entries(careerResults.current_subject_relevance || {}).map(([subject, explanation]) => (
                <div key={subject} className="subject-card">
                  <h4>{subject}</h4>
                  <p>{explanation}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="next-steps glass-panel">
            <h2>🚀 Your Next Steps</h2>
            <div className="steps-list">
              {careerResults.next_exploration_steps?.map((step, index) => (
                <div key={index} className="step-item">
                  <div className="step-number">{index + 1}</div>
                  <div className="step-text">{step}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PurposeDiscovery
