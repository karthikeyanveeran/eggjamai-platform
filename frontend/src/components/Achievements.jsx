import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { gamificationAPI } from '../services/api'
import { triggerConfetti } from '../utils/confetti'
import { sounds } from '../utils/soundManager'
import Particles from '../components/ParticleBackground'
import './Achievements.css'

const initialBadges = [
  {
    id: 'civic_champion',
    name: 'Civic Champion',
    icon: '🏛️',
    description: 'Complete 10 Civic Sense challenges',
    requirement: 10,
    progress: 7,
    category: 'civicSense',
    tier: 'bronze'
  },
  {
    id: 'road_warrior',
    name: 'Road Safety Warrior',
    icon: '🚦',
    description: 'Master 15 Road Manners challenges',
    requirement: 15,
    progress: 15,
    category: 'roadManners',
    tier: 'gold',
    unlocked: true
  },
  {
    id: 'communication_pro',
    name: 'Communication Pro',
    icon: '💬',
    description: 'Excel in 20 Talking Manners challenges',
    requirement: 20,
    progress: 12,
    category: 'talkingManners',
    tier: 'silver'
  },
  {
    id: 'soft_skills_master',
    name: 'Soft Skills Master',
    icon: '🤝',
    description: 'Complete 25 Soft Skills challenges',
    requirement: 25,
    progress: 18,
    category: 'softSkills',
    tier: 'silver'
  },
  {
    id: 'dining_etiquette',
    name: 'Dining Etiquette Expert',
    icon: '🍽️',
    description: 'Perfect 10 Dining Manners challenges',
    requirement: 10,
    progress: 10,
    category: 'diningManners',
    tier: 'gold',
    unlocked: true
  },
  {
    id: 'dream_builder',
    name: 'Dream Builder',
    icon: '🌟',
    description: 'Define your vision 5 times',
    requirement: 5,
    progress: 3,
    category: 'vision',
    tier: 'bronze'
  },
  {
    id: 'goal_getter',
    name: 'Goal Getter',
    icon: '🎯',
    description: 'Set and track 15 goals',
    requirement: 15,
    progress: 9,
    category: 'goalSetting',
    tier: 'silver'
  },
  {
    id: 'peace_maker',
    name: 'Peace Maker',
    icon: '🕊️',
    description: 'Resolve 12 conflicts positively',
    requirement: 12,
    progress: 6,
    category: 'conflictResolution',
    tier: 'bronze'
  },
  {
    id: 'week_streak',
    name: '7-Day Champion',
    icon: '🔥',
    description: 'Maintain 7-day streak',
    requirement: 7,
    progress: 7,
    tier: 'gold',
    unlocked: true,
    special: true
  },
  {
    id: 'month_streak',
    name: '30-Day Legend',
    icon: '⭐',
    description: 'Maintain 30-day streak',
    requirement: 30,
    progress: 7,
    tier: 'platinum',
    special: true
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    icon: '🌅',
    description: 'Complete challenges before 10 AM (5 times)',
    requirement: 5,
    progress: 2,
    tier: 'bronze',
    special: true
  },
  {
    id: 'perfect_week',
    name: 'Perfect Week',
    icon: '💯',
    description: 'Complete all daily challenges for a week',
    requirement: 7,
    progress: 4,
    tier: 'platinum',
    special: true
  }
]

const levels = [
  { level: 1, name: 'Beginner', minPoints: 0, icon: '🌱', color: '#94a3b8' },
  { level: 2, name: 'Learner', minPoints: 50, icon: '📚', color: '#3b82f6' },
  { level: 3, name: 'Improver', minPoints: 150, icon: '⬆️', color: '#8b5cf6' },
  { level: 4, name: 'Achiever', minPoints: 300, icon: '🏆', color: '#f59e0b' },
  { level: 5, name: 'Champion', minPoints: 500, icon: '🥇', color: '#10b981' },
  { level: 6, name: 'Master', minPoints: 750, icon: '👑', color: '#ec4899' },
  { level: 7, name: 'Legend', minPoints: 1000, icon: '🌟', color: '#6366f1' },
]

function Achievements() {
  const [currentPoints, setCurrentPoints] = useState(245)
  const [allBadges, setAllBadges] = useState(initialBadges)
  const [loading, setLoading] = useState(true)
  
  // Get user from auth context
  const { user } = useAuth()
  const userId = user?.id || 1
  
  // Get toast notifications
  const { showSuccess, showError, showInfo } = useToast()

  // Fetch stats on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await gamificationAPI.getStats(userId)
        if (stats) {
          if (stats.total_points !== undefined) setCurrentPoints(stats.total_points)
          
          // Update badges unlock status
          if (stats.unlocked_badges && Array.isArray(stats.unlocked_badges)) {
            setAllBadges(prev => prev.map(badge => ({
              ...badge,
              unlocked: stats.unlocked_badges.includes(badge.id) || badge.unlocked
            })))
          }
        }
      } catch (err) {
        console.error('Error fetching stats:', err)
      } finally {
        setLoading(false)
      }
    }
    
    if (userId) {
      fetchStats()
    }
  }, [userId])

  const currentLevelIndex = levels.findIndex((l, i) => 
    currentPoints >= l.minPoints && 
    (i === levels.length - 1 || currentPoints < levels[i + 1].minPoints)
  )
  const currentLevel = levels[currentLevelIndex]
  const nextLevel = levels[currentLevelIndex + 1]
  const pointsToNext = nextLevel ? nextLevel.minPoints - currentPoints : 0
  const levelProgress = nextLevel 
    ? ((currentPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100

  const unlockedBadges = allBadges.filter(b => b.unlocked)
  const inProgressBadges = allBadges.filter(b => !b.unlocked && b.progress > 0)
  const lockedBadges = allBadges.filter(b => !b.unlocked && b.progress === 0)

  // Handle achievement unlock with celebration
  const handleAchievementClick = async (badge) => {
    if (badge.unlocked) {
      // Show celebration for already unlocked badge
      sounds.achievement()
      triggerConfetti()
      showSuccess(`${badge.name} - Already Unlocked! 🏆`)
      
      // Equip badge
      try {
        await gamificationAPI.equipBadge(userId, badge.id)
        sounds.click()
      } catch (err) {
        console.error('Error equipping badge:', err)
      }
    } else if (badge.progress >= badge.requirement) {
      // Unlock achievement
      sounds.achievement()
      triggerConfetti()
      showSuccess(`Achievement Unlocked: ${badge.name}! 🏆`, 5000)
      
      // Update backend
      try {
        await gamificationAPI.equipBadge(userId, badge.id)
      } catch (err) {
        console.error('Error unlocking badge:', err)
        showError('Failed to sync achievement')
      }
    } else {
      // Show progress
      sounds.click()
      showInfo(`${badge.progress}/${badge.requirement} - Keep going! 💪`)
    }
  }

  const getTierColor = (tier) => {
    switch(tier) {
      case 'bronze': return '#cd7f32'
      case 'silver': return '#c0c0c0'
      case 'gold': return '#ffd700'
      case 'platinum': return '#e5e4e2'
      default: return '#6366f1'
    }
  }

  return (
    <div className="achievements-container">
      {/* Particle Background */}
      <Particles.Floating emoji="🏆" count={10} />
      <Particles.Stars count={30} />
      <header className="achievements-header">
        <h1 className="text-gradient">Your Achievements</h1>
        <p className="subtitle">Track your progress and unlock amazing badges!</p>
      </header>

      {/* Level Progress */}
      <div className="level-card glass-panel">
        <div className="level-info">
          <div className="level-icon" style={{ backgroundColor: currentLevel.color }}>
            {currentLevel.icon}
          </div>
          <div className="level-details">
            <h2>{currentLevel.name}</h2>
            <p className="level-subtitle">Level {currentLevel.level}</p>
            <p className="points-display">{currentPoints} points</p>
          </div>
        </div>

        {nextLevel && (
          <div className="level-progress-section">
            <div className="progress-info">
              <span>Progress to {nextLevel.name}</span>
              <span>{pointsToNext} points needed</span>
            </div>
            <div className="level-progress-bar">
              <div 
                className="level-progress-fill"
                style={{ width: `${levelProgress}%`, backgroundColor: nextLevel.color }}
              />
            </div>
          </div>
        )}

        <div className="all-levels">
          {levels.map((level, index) => (
            <div 
              key={level.level}
              className={`level-milestone ${index <= currentLevelIndex ? 'reached' : ''}`}
              style={{ backgroundColor: index <= currentLevelIndex ? level.color : 'transparent' }}
            >
              <div className="milestone-icon">{level.icon}</div>
              <div className="milestone-name">{level.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Unlocked Badges */}
      {unlockedBadges.length > 0 && (
        <div className="badges-section">
          <h2>🏆 Unlocked Badges ({unlockedBadges.length})</h2>
          <div className="badges-grid">
            {unlockedBadges.map((badge) => (
              <div 
                key={badge.id} 
                className="badge-card glass-panel unlocked"
                onClick={() => handleAchievementClick(badge)}
                style={{ cursor: 'pointer' }}
              >
                <div 
                  className="badge-icon"
                  style={{ borderColor: getTierColor(badge.tier) }}
                >
                  {badge.icon}
                  <div className="badge-shine"></div>
                </div>
                <h3>{badge.name}</h3>
                <p>{badge.description}</p>
                <div className="badge-tier" style={{ backgroundColor: getTierColor(badge.tier) }}>
                  {badge.tier.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* In Progress Badges */}
      {inProgressBadges.length > 0 && (
        <div className="badges-section">
          <h2>🎯 Almost There ({inProgressBadges.length})</h2>
          <div className="badges-grid">
            {inProgressBadges.map((badge) => (
              <div 
                key={badge.id} 
                className="badge-card glass-panel in-progress"
                onClick={() => handleAchievementClick(badge)}
                style={{ cursor: 'pointer' }}
              >
                <div className="badge-icon" style={{ borderColor: getTierColor(badge.tier) }}>
                  {badge.icon}
                </div>
                <h3>{badge.name}</h3>
                <p>{badge.description}</p>
                <div className="badge-progress">
                  <div className="progress-text">
                    {badge.progress}/{badge.requirement}
                  </div>
                  <div className="badge-progress-bar">
                    <div 
                      className="badge-progress-fill"
                      style={{ 
                        width: `${(badge.progress / badge.requirement) * 100}%`,
                        backgroundColor: getTierColor(badge.tier)
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <div className="badges-section">
          <h2>🔒 Locked Badges ({lockedBadges.length})</h2>
          <div className="badges-grid">
            {lockedBadges.map((badge) => (
              <div key={badge.id} className="badge-card glass-panel locked">
                <div className="badge-icon locked-icon">
                  🔒
                </div>
                <h3>{badge.name}</h3>
                <p>{badge.description}</p>
                <div className="unlock-hint">
                  Start completing {badge.category === 'special' ? 'challenges' : badge.category} challenges!
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Motivational Quote */}
      <div className="motivation-quote glass-panel">
        <div className="quote-icon">💪</div>
        <blockquote>
          "Success is the sum of small efforts repeated day in and day out."
        </blockquote>
        <p className="quote-author">- Robert Collier</p>
      </div>
    </div>
  )
}

export default Achievements
