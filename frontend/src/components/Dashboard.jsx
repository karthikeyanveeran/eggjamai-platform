import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { gamificationAPI, moodAPI } from '../services/api'
import { sounds } from '../utils/soundManager'
import { triggerConfetti } from '../utils/confetti'
import './Dashboard.css'

function Dashboard() {
  const [stats, setStats] = useState({
    totalSessions: 0,
    assessmentsTaken: 0,
    moodEntries: 0,
    averageMood: 0,
    currentStreak: 0
  })
  const [moodTrend, setMoodTrend] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Get user from auth context
  const { user } = useAuth()
  const userId = user?.id || 1
  
  // Get toast notifications
  const { showError, showSuccess } = useToast()

  // Fetch actual data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats and mood history in parallel
        const [statsData, moodHistory] = await Promise.all([
          gamificationAPI.getStats(userId),
          moodAPI.getHistory(userId, 7)
        ])

        setStats(statsData)
        
        // Process mood history for chart
        if (moodHistory && Array.isArray(moodHistory.history)) {
          const processedTrend = moodHistory.history.map(entry => ({
            day: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
            mood: entry.mood_score
          }))
          // Fill missing days if needed or just show available
          setMoodTrend(processedTrend)
        } else {
            // Fallback mock if empty
            setMoodTrend([
                { day: 'Mon', mood: 6 },
                { day: 'Tue', mood: 7 },
                { day: 'Wed', mood: 5 },
                { day: 'Thu', mood: 7 },
                { day: 'Fri', mood: 8 },
                { day: 'Sat', mood: 7 },
                { day: 'Sun', mood: 6 }
            ])
        }
        
        // Celebrate milestones
        if (statsData.currentStreak % 7 === 0 && statsData.currentStreak > 0) {
          triggerConfetti()
          sounds.streak()
          showSuccess(`🔥 Amazing! ${statsData.currentStreak} day streak!`)
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        // Fallback to mock data for demo
        setStats({
          totalSessions: 12,
          assessmentsTaken: 3,
          moodEntries: 18,
          averageMood: 6.5,
          currentStreak: 5
        })
        setMoodTrend([
            { day: 'Mon', mood: 6 },
            { day: 'Tue', mood: 7 },
            { day: 'Wed', mood: 5 },
            { day: 'Thu', mood: 7 },
            { day: 'Fri', mood: 8 },
            { day: 'Sat', mood: 7 },
            { day: 'Sun', mood: 6 }
        ])
      } finally {
        setLoading(false)
      }
    }
    
    if (userId) {
      fetchData()
    }
  }, [userId, showSuccess])

  const recentActivities = [
    { type: 'assessment', title: 'Completed GAD-7 Assessment', time: '2 hours ago', icon: '📊' },
    { type: 'chat', title: 'Chat session with EggJam AI', time: '5 hours ago', icon: '💬' },
    { type: 'mood', title: 'Logged daily mood', time: '1 day ago', icon: '😊' },
    { type: 'resource', title: 'Completed breathing exercise', time: '2 days ago', icon: '🧘' }
  ]

  const getMoodColor = (mood) => {
    if (mood >= 8) return '#10b981'
    if (mood >= 6) return '#3b82f6'
    if (mood >= 4) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1 className="text-gradient">Your Wellness Dashboard</h1>
          <p className="subtitle">Track your mental health journey</p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-icon">💬</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalSessions}</div>
            <div className="stat-label">Chat Sessions</div>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <div className="stat-value">{stats.assessmentsTaken}</div>
            <div className="stat-label">Assessments</div>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon">😊</div>
          <div className="stat-info">
            <div className="stat-value">{stats.moodEntries}</div>
            <div className="stat-label">Mood Logs</div>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-icon">🔥</div>
          <div className="stat-info">
            <div className="stat-value">{stats.currentStreak}</div>
            <div className="stat-label">Day Streak</div>
          </div>
        </div>
      </div>

      {/* Mood Trend */}
      <div className="mood-trend glass-panel">
        <h2>Weekly Mood Trend</h2>
        <div className="mood-chart">
          {moodTrend.map((entry, index) => (
            <div key={index} className="mood-bar-container">
              <div 
                className="mood-bar"
                style={{
                  height: `${entry.mood * 10}%`,
                  backgroundColor: getMoodColor(entry.mood)
                }}
              >
                <span className="mood-value">{entry.mood}</span>
              </div>
              <div className="mood-day">{entry.day}</div>
            </div>
          ))}
        </div>
        <div className="mood-average">
          <span>Average Mood:</span>
          <span className="average-value">{stats.averageMood}/10</span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity glass-panel">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {recentActivities.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">{activity.icon}</div>
              <div className="activity-details">
                <div className="activity-title">{activity.title}</div>
                <div className="activity-time">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-button glass-panel" onClick={() => { sounds.click(); }}>
            <span className="action-icon">💬</span>
            <span>Start Chat</span>
          </button>
          <button className="action-button glass-panel" onClick={() => { sounds.click(); }}>
            <span className="action-icon">😊</span>
            <span>Log Mood</span>
          </button>
          <button className="action-button glass-panel" onClick={() => { sounds.click(); }}>
            <span className="action-icon">📊</span>
            <span>Take Assessment</span>
          </button>
          <button className="action-button glass-panel" onClick={() => { sounds.click(); }}>
            <span className="action-icon">🧘</span>
            <span>Breathing Exercise</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
