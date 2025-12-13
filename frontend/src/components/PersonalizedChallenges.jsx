import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { challengesAPI } from '../services/api'
import { triggerConfetti } from '../utils/confetti'
import { sounds } from '../utils/soundManager'
import './PersonalizedChallenges.css'

function PersonalizedChallenges() {
  const [userProfile, setUserProfile] = useState({
    age: 16,
    interests: ['music', 'gaming', 'sports'],
    struggles: ['procrastination', 'focus'],
    goals: ['improve grades', 'make more friends'],
    personality: ['creative', 'introverted']
  })
  
  const [challenges, setChallenges] = useState([])
  const [completedChallenges, setCompletedChallenges] = useState([])
  const [activeQuest, setActiveQuest] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showProfileSetup, setShowProfileSetup] = useState(true)

  // Get user from auth context
  const { user } = useAuth()
  const userId = user?.id || 'demo-user-123'
  
  // Get toast notifications
  const { showSuccess, showError } = useToast()

  // Fetch completed challenges on mount
  useEffect(() => {
    const fetchCompleted = async () => {
      if (!userId) return
      try {
        const data = await challengesAPI.getCompleted(userId)
        setCompletedChallenges(data.map(c => c.id))
      } catch (err) {
        console.error('Error fetching completed challenges:', err)
      }
    }
    fetchCompleted()
  }, [userId])

  const generateChallenges = async () => {
    setLoading(true)
    sounds.click()
    try {
      const data = await challengesAPI.getPersonalized(
        userId,
        userProfile
      )
      
      if (data && data.length > 0) {
        setChallenges(data)
        setShowProfileSetup(false)
        sounds.whoosh()
      } else {
        // If API returns empty (shouldn't happen with fallback), show mock
        showMockChallenges()
      }
    } catch (error) {
      console.error('Error loading challenges:', error)
      // Show mock challenges for demo
      showMockChallenges()
    } finally {
      setLoading(false)
    }
  }

  const showMockChallenges = () => {
    // Demo personalized challenges based on profile
    const mockChallenges = [
      {
        id: '1',
        title: '🎮 The Gaming Leader Quest',
        description: `Since you love gaming, organize a friendly gaming tournament with 3 friends. But here's the twist: you must explain the rules clearly, ensure everyone feels included, and handle any disputes fairly.`,
        category: 'soft_skills',
        challenge_type: 'social',
        difficulty: 'intermediate',
        points: 25,
        estimated_time: 45,
        requires_proof: true,
        proof_type: 'photo',
        hints: [
          'Choose a game everyone knows',
          'Write down the rules beforehand',
          'Be the mature one who keeps it fun'
        ],
        why_this_matters: 'Because you want to make more friends and gaming is your passion - combine them! This builds leadership and social skills.',
        success_criteria: 'Tournament completed, everyone had fun, no major arguments, you handled any issues calmly',
        related_to_user: 'Connects your love for gaming with your goal to make more friends'
      },
      {
        id: '2',
        title: '🎵 Music Focus Challenge',
        description: `You struggle with procrastination. Today, create a "focus playlist" of your favorite music, then use it while studying for 25 minutes straight (one Pomodoro). No phone, no distractions.`,
        category: 'goal_setting',
        challenge_type: 'daily',
        difficulty: 'intermediate',
        points: 15,
        estimated_time: 30,
        requires_proof: false,
        hints: [
          'Choose instrumental or lyric-free music for better focus',
          'Set a timer - makes it feel like a game',
          'Reward yourself after 25 minutes'
        ],
        why_this_matters: 'Uses your love of music to tackle your procrastination. Small wins build big habits!',
        success_criteria: 'Full 25 minutes of focused study using your playlist',
        related_to_user: 'Turns your music interest into a weapon against procrastination'
      },
      {
        id: '3',
        title: '⚽ Sports Photographer Mission',
        description: `Since you enjoy sports: Go to a local park or school ground. Take 5 creative photos of people playing sports. Then share ONE photo with someone saying "This reminded me of teamwork!"`,
        category: 'communication',
        challenge_type: 'proof',
        difficulty: 'intermediate',
        points: 20,
        estimated_time: 30,
        requires_proof: true,
        proof_type: 'photo',
        hints: [
          'Action shots are exciting',
          'Focus on emotions and teamwork moments',
          'Be respectful - ask permission if needed'
        ],
        why_this_matters: 'For an introvert, this is a gentle way to interact with the world through your interests',
        success_criteria: '5 photos taken, 1 shared with meaningful message',
        related_to_user: 'Combines your sports interest with pushing your introverted comfort zone gently'
      },
      {
        id: '4',
        title: '🎨 Creative Grade Booster',
        description: `You want better grades. Pick your HARDEST subject. Create a visual mind map or doodle notes for one topic. Make it colorful and creative - use your artistic side to learn!`,
        category: 'goal_setting',
        challenge_type: 'daily',
        difficulty: 'beginner',
        points: 15,
        estimated_time: 25,
        requires_proof: true,
        proof_type: 'photo',
        hints: [
          'Use colors to group related ideas',
          'Add small drawings or symbols',
          'Make it fun, not perfect'
        ],
        why_this_matters: 'Your creative personality can make studying fun! Visual learning helps introverts process better.',
        success_criteria: 'One colorful mind map/doodle note created for tough subject',
        related_to_user: 'Uses your creativity to achieve your goal of better grades'
      }
    ]
    setChallenges(mockChallenges)
    setShowProfileSetup(false)
  }

  const handleCompleteChallenge = async (challengeId) => {
    try {
      await challengesAPI.complete(challengeId, userId)
      
      setChallenges(prev => prev.map(c => 
        c.id === challengeId ? { ...c, completed: true } : c
      ))
      setCompletedChallenges(prev => [...prev, challengeId])
      
      triggerConfetti()
      sounds.challengeComplete()
      showSuccess('Challenge Completed! +XP Earned')
    } catch (err) {
      console.error('Error completing challenge:', err)
      // Optimistic update for demo
      setChallenges(prev => prev.map(c => 
        c.id === challengeId ? { ...c, completed: true } : c
      ))
      triggerConfetti()
      sounds.challengeComplete()
      showSuccess('Challenge Completed! (Demo Mode)')
    }
  }

  const addInterest = (interest) => {
    if (interest && !userProfile.interests.includes(interest)) {
      setUserProfile(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }))
    }
  }

  const removeInterest = (interest) => {
    setUserProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }))
  }

  return (
    <div className="personalized-container">
      {showProfileSetup && (
        <div className="profile-setup glass-panel">
          <h1 className="setuptext-gradient">Let's Personalize Your Journey! </h1>
          <p className="setup-subtitle">Tell me about yourself so I can create unique challenges just for YOU!</p>

          <div className="setup-section">
            <label>Your Age:</label>
            <input 
              type="number" 
              value={userProfile.age}
              onChange={(e) => setUserProfile({...userProfile, age: parseInt(e.target.value)})}
              className="age-input"
            />
          </div>

          <div className="setup-section">
            <label>What do you love? (Your interests):</label>
            <div className="interest-tags">
              {userProfile.interests.map(interest => (
                <span key={interest} className="interest-tag">
                  {interest}
                  <button onClick={() => removeInterest(interest)}>×</button>
                </span>
              ))}
            </div>
            <div className="interest-suggestions">
              {['reading', 'art', 'coding', 'dance', 'anime', 'cooking'].map(interest => (
                <button 
                  key={interest}
                  className="suggestion-btn"
                  onClick={() => addInterest(interest)}
                  disabled={userProfile.interests.includes(interest)}
                >
                  + {interest}
                </button>
              ))}
            </div>
          </div>

          <div className="setup-section">
            <label>What are your goals?</label>
            <textarea 
              value={userProfile.goals.join(', ')}
              onChange={(e) => setUserProfile({...userProfile, goals: e.target.value.split(', ')})}
              placeholder="E.g., Get better grades, make new friends, learn guitar..."
              rows="2"
            />
          </div>

          <button 
            className="generate-button"
            onClick={generateChallenges}
            disabled={loading}
          >
            {loading ? '✨ Creating Your Unique Challenges...' : '🚀 Generate My Personalized Challenges!'}
          </button>
        </div>
      )}

      {!showProfileSetup && challenges.length > 0 && (
        <div className="challenges-display">
          <div className="challenges-header">
            <h1 className="text-gradient">Your Personalized Challenges</h1>
            <p className="personalized-note">
              🎯 These are created UNIQUELY for you based on your interests in {userProfile.interests.join(', ')}
            </p>
            <button 
              className="regenerate-btn"
              onClick={generateChallenges}
            >
              🔄 Generate New Unique Challenges
            </button>
          </div>

          <div className="challenges-grid">
            {challenges.map((challenge) => (
              <div key={challenge.id} className={`personal-challenge-card glass-panel ${challenge.completed ? 'completed' : ''}`}>
                <div className="challenge-header-row">
                  <h3>{challenge.title}</h3>
                  <div className="challenge-meta">
                    <span className="challenge-points">+{challenge.points} pts</span>
                    <span className="challenge-time">⏱️ {challenge.estimated_time} min</span>
                  </div>
                </div>

                <p className="challenge-description">{challenge.description}</p>

                <div className="why-section">
                  <strong>💡 Why This Matters to YOU:</strong>
                  <p>{challenge.why_this_matters}</p>
                </div>

                <div className="related-section">
                  <strong>🔗 Personalized Connection:</strong>
                  <p>{challenge.related_to_user}</p>
                </div>

                <details className="hints-section">
                  <summary>🎁 Hints & Tips</summary>
                  <ul>
                    {challenge.hints.map((hint, idx) => (
                      <li key={idx}>{hint}</li>
                    ))}
                  </ul>
                </details>

                <div className="success-criteria">
                  <strong>✅ Success Looks Like:</strong>
                  <p>{challenge.success_criteria}</p>
                </div>

                {challenge.requires_proof && (
                  <div className="proof-badge">
                    📸 {challenge.proof_type} proof required
                  </div>
                )}

                <button
                  className={`complete-challenge-btn ${challenge.completed ? 'completed' : ''}`}
                  onClick={() => handleCompleteChallenge(challenge.id)}
                  disabled={challenge.completed}
                >
                  {challenge.completed ? '✓ Completed!' : 'Mark as Complete'}
                </button>
              </div>
            ))}
          </div>

          <button 
            className="edit-profile-btn"
            onClick={() => setShowProfileSetup(true)}
          >
            ⚙️ Update My Profile
          </button>
        </div>
      )}
    </div>
  )
}

export default PersonalizedChallenges
