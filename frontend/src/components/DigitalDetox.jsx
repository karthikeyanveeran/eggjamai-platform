import { useState, useEffect } from 'react'
import { detoxAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import './DigitalDetox.css'

function DigitalDetox() {
  const [view, setView] = useState('overview') // overview, log, tips, progress
  const [screenTimeToday, setScreenTimeToday] = useState(0)
  const [goal, setGoal] = useState(180) // 3 hours in minutes
  const [streak, setStreak] = useState(7)
  const [weeklyData, setWeeklyData] = useState([])
  const [appBreakdown, setAppBreakdown] = useState([])
  const [showLogModal, setShowLogModal] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const { user } = useAuth()
  const userId = user?.id || 'demo-user-123'
  const { showSuccess, showError } = useToast()

  // Mock data
  const mockWeeklyData = [
    { day: 'Mon', minutes: 240 },
    { day: 'Tue', minutes: 210 },
    { day: 'Wed', minutes: 195 },
    { day: 'Thu', minutes: 180 },
    { day: 'Fri', minutes: 175 },
    { day: 'Sat', minutes: 220 },
    { day: 'Sun', minutes: 160 }
  ]

  const mockAppBreakdown = [
    { app: 'Instagram', minutes: 80, color: '#E1306C' },
    { app: 'YouTube', minutes: 60, color: '#FF0000' },
    { app: 'WhatsApp', minutes: 45, color: '#25D366' },
    { app: 'TikTok', minutes: 35, color: '#000000' },
    { app: 'Gaming', minutes: 25, color: '#9146FF' },
    { app: 'Others', minutes: 15, color: '#6B7280' }
  ]

  const replacementActivities = [
    {
      title: 'Take a 10-minute walk',
      icon: '🚶',
      benefit: 'Boosts mood & energy',
      time: '10 min'
    },
    {
      title: 'Call a friend',
      icon: '📞',
      benefit: 'Real connection',
      time: '15 min'
    },
    {
      title: 'Read a physical book',
      icon: '📖',
      benefit: 'Better focus & sleep',
      time: '20 min'
    },
    {
      title: 'Cook something new',
      icon: '🍳',
      benefit: 'Creative & productive',
      time: '30 min'
    },
    {
      title: 'Exercise or yoga',
      icon: '🧘',
      benefit: 'Physical & mental health',
      time: '20 min'
    },
    {
      title: 'Journal your thoughts',
      icon: '✍️',
      benefit: 'Self-awareness & clarity',
      time: '10 min'
    }
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const progress = await detoxAPI.getProgress(userId)
        if (progress) {
            setGoal(progress.target_minutes || 180)
            setStreak(progress.streak_days || 0)
            // If backend returns weekly data, use it. Otherwise keep mock for now or empty.
            // setWeeklyData(progress.weekly_data || [])
        }
        // For demo, we might still need mock data if backend is empty
        setWeeklyData(mockWeeklyData)
        setAppBreakdown(mockAppBreakdown)
        setScreenTimeToday(mockWeeklyData[mockWeeklyData.length - 1].minutes)
      } catch (err) {
        console.error('Error fetching detox data:', err)
        // Fallback to mock
        setWeeklyData(mockWeeklyData)
        setAppBreakdown(mockAppBreakdown)
        setScreenTimeToday(mockWeeklyData[mockWeeklyData.length - 1].minutes)
      }
    }
    fetchData()
  }, [userId])

  const totalMinutes = appBreakdown.reduce((sum, app) => sum + app.minutes, 0)
  const progress = Math.min((screenTimeToday / goal) * 100, 100)
  const reduction = goal > 0 ? ((goal - screenTimeToday) / goal) * 100 : 0
  const maxWeeklyMinutes = Math.max(...weeklyData.map(d => d.minutes))

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getProgressColor = () => {
    if (screenTimeToday <= goal * 0.8) return '#10b981' // Green
    if (screenTimeToday <= goal) return '#f59e0b' // Yellow
    return '#ef4444' // Red
  }

  return (
    <div className="digital-detox-container">
      <header className="detox-header">
        <h1 className="text-gradient">📱 Digital Detox Tracker</h1>
        <p className="detox-subtitle">
          Take control of your screen time and reclaim your life
        </p>
      </header>

      {/* Navigation */}
      <div className="detox-nav">
        <button
          className={`nav-btn ${view === 'overview' ? 'active' : ''}`}
          onClick={() => setView('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`nav-btn ${view === 'tips' ? 'active' : ''}`}
          onClick={() => setView('tips')}
        >
          💡 Tips & Activities
        </button>
        <button
          className={`nav-btn ${view === 'progress' ? 'active' : ''}`}
          onClick={() => setView('progress')}
        >
          📈 Progress
        </button>
        <button
          className="log-time-btn"
          onClick={() => setShowLogModal(true)}
        >
          ➕ Log Screen Time
        </button>
      </div>

      {/* Overview */}
      {view === 'overview' && (
        <div className="overview-section">
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card glass-panel">
              <div className="card-icon">📱</div>
              <div className="card-content">
                <h3>Today's Screen Time</h3>
                <div className="big-number">{formatTime(screenTimeToday)}</div>
                <div className={`status ${screenTimeToday <= goal ? 'good' : 'warning'}`}>
                  {screenTimeToday <= goal ? '✅ Under goal!' : '⚠️ Over goal'}
                </div>
              </div>
            </div>

            <div className="summary-card glass-panel">
              <div className="card-icon">🎯</div>
              <div className="card-content">
                <h3>Daily Goal</h3>
                <div className="big-number">{formatTime(goal)}</div>
                <button className="edit-goal-btn" onClick={() => {
                  const newGoal = prompt('Set new daily goal (in minutes):', goal)
                  if (newGoal && !isNaN(newGoal)) setGoal(parseInt(newGoal))
                }}>
                  Edit Goal
                </button>
              </div>
            </div>

            <div className="summary-card glass-panel">
              <div className="card-icon">🔥</div>
              <div className="card-content">
                <h3>Streak</h3>
                <div className="big-number">{streak} days</div>
                <div className="streak-flames">
                  {Array(Math.min(streak, 7)).fill('🔥').join('')}
                </div>
              </div>
            </div>

            <div className="summary-card glass-panel">
              <div className="card-icon">📉</div>
              <div className="card-content">
                <h3>Weekly Avg</h3>
                <div className="big-number">
                  {formatTime(Math.round(weeklyData.reduce((sum, d) => sum + d.minutes, 0) / 7))}
                </div>
                {reduction > 0 && (
                  <div className="reduction-badge">
                    ↓ {Math.round(reduction)}% vs goal
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Progress Circle */}
          <div className="progress-section glass-panel">
            <h3>Today's Progress</h3>
            <div className="circular-progress">
              <svg className="progress-ring" width="200" height="200">
                <circle
                  className="progress-ring-bg"
                  strokeWidth="20"
                  fill="transparent"
                  r="85"
                  cx="100"
                  cy="100"
                />
                <circle
                  className="progress-ring-fill"
                  strokeWidth="20"
                  stroke={getProgressColor()}
                  fill="transparent"
                  r="85"
                  cx="100"
                  cy="100"
                  strokeDasharray={`${progress * 5.34} 534`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="progress-text">
                <div className="progress-percentage">{Math.round(progress)}%</div>
                <div className="progress-label">of goal</div>
              </div>
            </div>
          </div>

          {/* App Breakdown */}
          <div className="app-breakdown glass-panel">
            <h3>App Usage Today</h3>
            <div className="app-list">
              {appBreakdown.map(app => (
                <div key={app.app} className="app-item">
                  <div className="app-info">
                    <div className="app-dot" style={{ backgroundColor: app.color }}></div>
                    <span className="app-name">{app.app}</span>
                  </div>
                  <div className="app-details">
                    <span className="app-time">{formatTime(app.minutes)}</span>
                    <div className="app-bar">
                      <div
                        className="app-bar-fill"
                        style={{
                          width: `${(app.minutes / totalMinutes) * 100}%`,
                          backgroundColor: app.color
                        }}
                      ></div>
                    </div>
                    <span className="app-percentage">
                      {Math.round((app.minutes / totalMinutes) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Trend */}
          <div className="weekly-trend glass-panel">
            <h3>This Week's Trend</h3>
            <div className="trend-chart">
              {weeklyData.map(day => (
                <div key={day.day} className="chart-bar">
                  <div className="bar-container">
                    <div
                      className="bar-fill"
                      style={{
                        height: `${(day.minutes / maxWeeklyMinutes) * 100}%`,
                        backgroundColor: day.minutes <= goal ? '#10b981' : '#ef4444'
                      }}
                    >
                      <span className="bar-value">{formatTime(day.minutes)}</span>
                    </div>
                  </div>
                  <div className="bar-label">{day.day}</div>
                </div>
              ))}
            </div>
            <div className="goal-line">
              <span>Goal: {formatTime(goal)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tips & Activities */}
      {view === 'tips' && (
        <div className="tips-section">
          <div className="tips-intro glass-panel">
            <h2>💡 Break Free from Screen Addiction</h2>
            <p>Replace scrolling with activities that truly make you happy and fulfilled</p>
          </div>

          <div className="activities-grid">
            {replacementActivities.map((activity, index) => (
              <div key={index} className="activity-card glass-panel">
                <div className="activity-icon">{activity.icon}</div>
                <h3>{activity.title}</h3>
                <p className="activity-benefit">{activity.benefit}</p>
                <div className="activity-time">{activity.time}</div>
                <button className="try-btn">Try Now</button>
              </div>
            ))}
          </div>

          <div className="detox-tips glass-panel">
            <h3>🎯 Proven Strategies</h3>
            <div className="tips-list">
              <div className="tip-item">
                <div className="tip-number">1</div>
                <div>
                  <strong>Phone-Free Zones</strong>
                  <p>Keep your bedroom, dining table, and study area phone-free</p>
                </div>
              </div>
              <div className="tip-item">
                <div className="tip-number">2</div>
                <div>
                  <strong>Grayscale Mode</strong>
                  <p>Turn on grayscale to make your phone less appealing</p>
                </div>
              </div>
              <div className="tip-item">
                <div className="tip-number">3</div>
                <div>
                  <strong>App Timers</strong>
                  <p>Use built-in screen time limits for addictive apps</p>
                </div>
              </div>
              <div className="tip-item">
                <div className="tip-number">4</div>
                <div>
                  <strong>Remove from Home Screen</strong>
                  <p>Make social media apps harder to access by removing shortcuts</p>
                </div>
              </div>
              <div className="tip-item">
                <div className="tip-number">5</div>
                <div>
                  <strong>Replace, Don't Restrict</strong>
                  <p>Find fulfilling offline activities instead of just saying "no"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress View */}
      {view === 'progress' && (
        <div className="progress-view">
          <div className="achievements-section glass-panel">
            <h2>🏆 Your Achievements</h2>
            <div className="achievements-grid">
              <div className={`achievement ${streak >= 3 ? 'unlocked' : 'locked'}`}>
                <div className="achievement-icon">🌱</div>
                <div>Beginner (3 days)</div>
              </div>
              <div className={`achievement ${streak >= 7 ? 'unlocked' : 'locked'}`}>
                <div className="achievement-icon">🔥</div>
                <div>On Fire (7 days)</div>
              </div>
              <div className={`achievement ${streak >= 14 ? 'unlocked' : 'locked'}`}>
                <div className="achievement-icon">💪</div>
                <div>Committed (14 days)</div>
              </div>
              <div className={`achievement ${streak >= 30 ? 'unlocked' : 'locked'}`}>
                <div className="achievement-icon">⭐</div>
                <div>Champion (30 days)</div>
              </div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card glass-panel">
              <h4>Total Time Saved</h4>
              <div className="stat-value">14h 30m</div>
              <p>This month</p>
            </div>
            <div className="stat-card glass-panel">
              <h4>Best Day</h4>
              <div className="stat-value">{formatTime(Math.min(...weeklyData.map(d => d.minutes)))}</div>
              <p>Personal record</p>
            </div>
            <div className="stat-card glass-panel">
              <h4>Avg Reduction</h4>
              <div className="stat-value">{Math.round(reduction)}%</div>
              <p>Vs your goal</p>
            </div>
          </div>
        </div>
      )}

      {/* Log Modal */}
      {showLogModal && (
        <div className="modal-overlay" onClick={() => setShowLogModal(false)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <h2>Log Today's Screen Time</h2>
            <form onSubmit={async (e) => { 
                e.preventDefault(); 
                setLoading(true);
                try {
                    const minutes = parseInt(e.target.elements.minutes.value);
                    const apps = e.target.elements.apps.value;
                    const activities = e.target.elements.activities.value;
                    
                    await detoxAPI.logScreenTime({
                        user_id: userId,
                        total_minutes: minutes,
                        by_app: apps ? { [apps]: minutes } : {}, // Simplified for demo
                        offline_achievements: activities ? [activities] : [],
                        date: new Date().toISOString()
                    });
                    
                    showSuccess('Screen time logged!');
                    setShowLogModal(false);
                    // Refresh data here if needed
                } catch (err) {
                    showError('Failed to log time');
                } finally {
                    setLoading(false);
                }
            }}>
              <div className="form-group">
                <label>Total Screen Time (minutes)</label>
                <input name="minutes" type="number" placeholder="180" required />
              </div>
              <div className="form-group">
                <label>Top Apps Used (optional)</label>
                <input name="apps" type="text" placeholder="Instagram, YouTube, etc." />
              </div>
              <div className="form-group">
                <label>Offline Activities Done Today</label>
                <textarea name="activities" placeholder="E.g., Read for 30 min, went for a walk..." rows="3" />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowLogModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Logging...' : 'Log Time'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default DigitalDetox
