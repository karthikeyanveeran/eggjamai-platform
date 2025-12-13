import { useState, useEffect } from 'react'
import { challengesAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './DailyChallenges.css'

const lifeSkillCategories = {
  civicSense: {
    name: 'Civic Sense',
    icon: '🏛️',
    color: '#3b82f6',
    challenges: [
      'Pick up litter you see in public spaces',
      'Use dustbin instead of littering',
      'Respect public property - don\'t vandalize',
      'Give your seat to elderly/pregnant women',
      'Follow traffic rules as a pedestrian',
      'Keep noise levels low in public places',
      'Wait in queue patiently without cutting',
      'Help someone in need today'
    ]
  },
  roadManners: {
    name: 'Road Manners',
    icon: '🚦',
    color: '#10b981',
    challenges: [
      'Use zebra crossing to cross the road',
      'Look both ways before crossing',
      'Don\'t use phone while walking on road',
      'Walk on the footpath, not the road',
      'Signal properly when cycling',
      'Wear helmet when riding bike/scooter',
      'Don\'t honk unnecessarily if you drive',
      'Thank drivers who let you cross'
    ]
  },
  softSkills: {
    name: 'Soft Skills',
    icon: '🤝',
    color: '#8b5cf6',
    challenges: [
      'Listen actively without interrupting',
      'Make eye contact when talking',
      'Give a genuine compliment to someone',
      'Practice empathy - understand others\' feelings',
      'Collaborate on a task with classmates',
      'Ask for help when you need it',
      'Accept criticism gracefully',
      'Share credit when working in a team'
    ]
  },
  diningManners: {
    name: 'Dining Manners',
    icon: '🍽️',
    color: '#f59e0b',
    challenges: [
      'Wash hands before eating',
      'Chew with mouth closed',
      'Don\'t talk with food in mouth',
      'Use napkin to wipe your mouth',
      'Thank the person who cooked/served',
      'Wait for everyone before starting',
      'Don\'t waste food - take only what you\'ll eat',
      'Offer food to others before serving yourself'
    ]
  },
  talkingManners: {
    name: 'Communication',
    icon: '💬',
    color: '#ec4899',
    challenges: [
      'Say "Please" and "Thank you"',
      'Use respectful tone with elders',
      'Don\'t interrupt when others speak',
      'Avoid using bad language/swearing',
      'Speak at appropriate volume',
      'Make proper introductions',
      'Apologize when you make mistakes',
      'Ask "May I" before doing something'
    ]
  },
  vision: {
    name: 'Vision & Dreams',
    icon: '🌟',
    color: '#6366f1',
    challenges: [
      'Write down one big dream you have',
      'List 3 things you want to achieve this year',
      'Imagine your ideal future self',
      'Read about someone successful you admire',
      'Define what success means to you',
      'Visualize yourself achieving a goal',
      'Share your dreams with someone supportive',
      'Create a vision board with your goals'
    ]
  },
  goalSetting: {
    name: 'Goal Setting',
    icon: '🎯',
    color: '#14b8a6',
    challenges: [
      'Set one SMART goal for today',
      'Break a big goal into small steps',
      'Write down why your goal matters',
      'Track progress on your current goal',
      'Celebrate a small win',
      'Adjust your plan if something isn\'t working',
      'Share your goal with someone for accountability',
      'Reflect on what you learned this week'
    ]
  },
  conflictResolution: {
    name: 'Solving Conflicts',
    icon: '🕊️',
    color: '#ef4444',
    challenges: [
      'Take a deep breath before reacting',
      'Listen to the other person\'s perspective',
      'Express your feelings without blaming',
      'Find a compromise that works for both',
      'Apologize sincerely if you were wrong',
      'Forgive someone who hurt you',
      'Stay calm even when frustrated',
      'Ask "How can we solve this together?"'
    ]
  }
}

function DailyChallenges() {
  const [selectedCategory, setSelectedCategory] = useState('civicSense')
  const [completedChallenges, setCompletedChallenges] = useState([])
  const [streak, setStreak] = useState(7)
  const [totalPoints, setTotalPoints] = useState(245)
  const [level, setLevel] = useState(3)
  
  const { user } = useAuth()
  const userId = user?.id || 'demo-user-123'

  // Fetch completed challenges on mount
  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        const completed = await challengesAPI.getCompleted(userId)
        if (Array.isArray(completed)) {
          setCompletedChallenges(completed)
        }
      } catch (err) {
        console.error('Error fetching completed challenges:', err)
      }
    }
    fetchCompleted()
  }, [userId])

  // Get today's challenges (2 random from each category)
  // Use date as seed for consistency (simple implementation)
  const getTodaysChallenges = () => {
    const challenges = []
    const today = new Date().toDateString()
    
    Object.entries(lifeSkillCategories).forEach(([key, category]) => {
      // Map with original index first to ensure consistent IDs
      const allChallenges = category.challenges.map((text, idx) => ({
        text,
        originalId: `${key}-${idx}`
      }))
      
      // Simple pseudo-random shuffle based on date length (demo purpose)
      // In production, backend should provide this
      const shuffled = [...allChallenges].sort((a, b) => {
        return (a.text.length + today.length) % 2 - 0.5
      })

      const randomChallenges = shuffled
        .slice(0, 2)
        .map((item) => ({
          id: item.originalId,
          category: key,
          categoryName: category.name,
          icon: category.icon,
          color: category.color,
          challenge: item.text,
          points: 10,
          completed: completedChallenges.includes(item.originalId)
        }))
      challenges.push(...randomChallenges)
    })
    return challenges
  }

  const todaysChallenges = getTodaysChallenges()
  const completedToday = todaysChallenges.filter(c => c.completed).length

  const handleCompleteChallenge = async (challengeId) => {
    if (!completedChallenges.includes(challengeId)) {
      // Optimistic update
      setCompletedChallenges([...completedChallenges, challengeId])
      setTotalPoints(prev => prev + 10)
      
      if ((totalPoints + 10) % 100 === 0) {
        setLevel(prev => prev + 1)
      }

      try {
        await challengesAPI.complete(challengeId, userId)
      } catch (err) {
        console.error('Error completing challenge:', err)
        // Revert if failed
        setCompletedChallenges(prev => prev.filter(id => id !== challengeId))
        setTotalPoints(prev => prev - 10)
      }
    }
  }

  const category = lifeSkillCategories[selectedCategory]

  return (
    <div className="challenges-container">
      <header className="challenges-header">
        <div className="header-content">
          <h1 className="text-gradient">Character Building Challenges</h1>
          <p className="subtitle">Build better habits, become your best self!</p>
        </div>

        <div className="stats-bar">
          <div className="stat-item">
            <div className="stat-icon">🔥</div>
            <div>
              <div className="stat-value">{streak}</div>
              <div className="stat-label">Day Streak</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">⭐</div>
            <div>
              <div className="stat-value">{totalPoints}</div>
              <div className="stat-label">Total Points</div>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">🏆</div>
            <div>
              <div className="stat-value">Level {level}</div>
              <div className="stat-label">Character Level</div>
            </div>
          </div>
        </div>
      </header>

      {/* Today's Progress */}
      <div className="daily-progress glass-panel">
        <h2>Today's Progress: {completedToday}/{todaysChallenges.length} Challenges</h2>
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill"
            style={{ width: `${(completedToday / todaysChallenges.length) * 100}%` }}
          />
        </div>
        {completedToday === todaysChallenges.length && (
          <div className="daily-complete-badge">
            🎉 All challenges completed today! Amazing work!
          </div>
        )}
      </div>

      {/* Category Selection */}
      <div className="category-selector">
        <h2>Choose a Life Skill to Focus On:</h2>
        <div className="category-grid">
          {Object.entries(lifeSkillCategories).map(([key, cat]) => (
            <button
              key={key}
              className={`category-card ${selectedCategory === key ? 'active' : ''}`}
              onClick={() => setSelectedCategory(key)}
              style={{ borderColor: cat.color }}
            >
              <div className="category-icon">{cat.icon}</div>
              <div className="category-name">{cat.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Today's Challenges */}
      <div className="challenges-section">
        <h2>
          <span>{category.icon}</span> Today's {category.name} Challenges
        </h2>
        <div className="challenges-list">
          {todaysChallenges
            .filter(c => c.category === selectedCategory)
            .map((challenge) => (
              <div 
                key={challenge.id} 
                className={`challenge-card glass-panel ${challenge.completed ? 'completed' : ''}`}
              >
                <div className="challenge-content">
                  <div className="challenge-icon-badge" style={{ backgroundColor: challenge.color }}>
                    {challenge.icon}
                  </div>
                  <div className="challenge-text">
                    <p>{challenge.challenge}</p>
                    <span className="challenge-points">+{challenge.points} points</span>
                  </div>
                </div>
                <button
                  className={`complete-button ${challenge.completed ? 'completed' : ''}`}
                  onClick={() => handleCompleteChallenge(challenge.id)}
                  disabled={challenge.completed}
                >
                  {challenge.completed ? '✓ Done!' : 'Mark Complete'}
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Motivation Section */}
      <div className="motivation-section glass-panel">
        <h3>💪 Why This Matters</h3>
        <div className="motivation-grid">
          <div className="motivation-card">
            <div className="motivation-icon">🌱</div>
            <h4>Small Steps, Big Changes</h4>
            <p>Every challenge you complete builds a better habit. In 21 days, it becomes automatic!</p>
          </div>
          <div className="motivation-card">
            <div className="motivation-icon">🎓</div>
            <h4>Future Success</h4>
            <p>These skills will help you in school, career, and life. You're investing in yourself!</p>
          </div>
          <div className="motivation-card">
            <div className="motivation-icon">🌟</div>
            <h4>Be the Change</h4>
            <p>You're not just improving yourself - you're making the world a better place!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DailyChallenges
