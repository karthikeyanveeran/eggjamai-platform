import { useState, useEffect } from 'react'
import { parentAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './ParentDashboard.css'

function ParentDashboard() {
  const { user } = useAuth()
  const userId = user?.id || 'demo-user-123'
  const [selectedChild, setSelectedChild] = useState(null)
  const [childrenList, setChildrenList] = useState([])
  const [insights, setInsights] = useState(null)
  const [weeklyReport, setWeeklyReport] = useState(null)
  const [timeRange, setTimeRange] = useState('week') // week, month

  // Mock children data
  const mockChildren = [
    { id: 1, name: 'Arjun', age: 15, grade: 10, avatar: '👦' },
    { id: 2, name: 'Priya', age: 12, grade: 7, avatar: '👧' }
  ]

  // Mock insights
  const mockInsights = {
    overall_mood_trend: 'improving',
    engagement_level: 'high',
    academic_help_sessions: 12,
    skills_improved: ['Math reasoning', 'Emotional awareness', 'Time management'],
    areas_of_focus: ['Exam preparation', 'Social confidence'],
    counselor_alerts: 0,
    weekly_activity: {
      check_ins: 6,
      challenges_completed: 8,
      learning_sessions: 5
    },
    mood_7day_avg: 7.2,
    previous_mood_avg: 6.5,
    achievements_unlocked: 3
  }

  const mockWeeklyReport = {
    week_ending: new Date().toISOString().split('T')[0],
    summary: 'Arjun had an excellent week with consistent engagement and positive mood trends.',
    highlights: [
      'Completed 8 character-building challenges',
      'Improved mood by 15% from last week',
      'Sought academic help 5 times (great initiative!)',
      'Unlocked 2 new achievement badges'
    ],
    areas_to_support: [
      'Encourage continued daily practice',
      'Celebrate small wins to build confidence'
    ],
    parent_tips: [
      {
        tip: 'Acknowledge effort, not just results',
        why: 'Research shows praising effort builds growth mindset and resilience'
      },
      {
        tip: 'Create a consistent study environment',
        why: 'Routine helps reduce anxiety and improves focus'
      },
      {
        tip: 'Ask "What did you learn today?" instead of "How was your grade?"',
        why: 'Shifts focus from performance to learning and growth'
      }
    ]
  }

  useEffect(() => {
    setChildrenList(mockChildren)
    setSelectedChild(mockChildren[0])
    loadInsights(mockChildren[0].id)
  }, [])

  const loadInsights = async (childId) => {
    try {
      // In a real app, we'd get the parent ID from the user object
      const parentId = user?.id || 1
      
      const [insightsData, reportData] = await Promise.all([
        parentAPI.getInsights(childId, userId),
        parentAPI.getWeeklyReport(childId)
      ])
      
      setInsights(insightsData)
      setWeeklyReport(reportData)
    } catch (error) {
      console.error('Error fetching parent insights:', error)
      // Fallback to mock data
      setInsights(mockInsights)
      setWeeklyReport(mockWeeklyReport)
    }
  }

  const handleChildChange = (child) => {
    setSelectedChild(child)
    loadInsights(child.id)
  }

  const downloadReport = () => {
    alert('Downloading weekly report PDF...')
    // In production, generate and download PDF
  }

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'improving': return '📈'
      case 'stable': return '➡️'
      case 'declining': return '📉'
      default: return '➡️'
    }
  }

  const getEngagementColor = (level) => {
    switch(level) {
      case 'high': return '#10b981'
      case 'medium': return '#f59e0b'
      case 'low': return '#ef4444'
      default: return '#6b7280'
    }
  }

  if (!selectedChild) return <div>Loading...</div>

  return (
    <div className="parent-dashboard-container">
      <header className="parent-header">
        <h1 className="text-gradient">👪 Parent Dashboard</h1>
        <p className="parent-subtitle">
          Privacy-first insights into your child's wellbeing and growth
        </p>
      </header>

      {/* Child Selector */}
      <div className="child-selector glass-panel">
        <label>Viewing insights for:</label>
        <div className="children-buttons">
          {childrenList.map(child => (
            <button
              key={child.id}
              className={`child-btn ${selectedChild.id === child.id ? 'active' : ''}`}
              onClick={() => handleChildChange(child)}
            >
              <span className="child-avatar">{child.avatar}</span>
              <div className="child-info">
                <strong>{child.name}</strong>
                <span>Grade {child.grade}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="privacy-notice glass-panel">
        <div className="privacy-icon">🔒</div>
        <div className="privacy-content">
          <h3>Your Child's Privacy is Protected</h3>
          <p>
            You can see <strong>growth metrics and trends</strong>, but NOT individual 
            conversation details or journal entries. We believe in supporting your child 
            while respecting their need for a private space.
          </p>
          <button className="learn-more-btn">Learn What Parents Can See</button>
        </div>
      </div>

      {/* Summary Cards */}
      {insights && (
        <>
          <div className="summary-section">
            <h2>This Week's Overview</h2>
            <div className="summary-grid">
              <div className="summary-card glass-panel">
                <div className="card-header">
                  <h3>Overall Mood</h3>
                  <span className="trend-badge">
                    {getTrendIcon(insights.overall_mood_trend)} {insights.overall_mood_trend}
                  </span>
                </div>
                <div className="mood-score">
                  {insights.mood_7day_avg.toFixed(1)}/10
                </div>
                <div className="mood-comparison">
                  <span className="previous">Last week: {insights.previous_mood_avg}</span>
                  <span className="change positive">
                    +{((insights.mood_7day_avg - insights.previous_mood_avg) / insights.previous_mood_avg * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="mood-chart">
                  {/* Mini mood trend visualization */}
                  <div className="mini-bars">
                    {[6.5, 6.8, 7.0, 7.2, 7.3, 7.2, 7.2].map((val, idx) => (
                      <div key={idx} className="mini-bar" style={{height: `${val * 10}%`}}></div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="summary-card glass-panel">
                <div className="card-header">
                  <h3>Engagement Level</h3>
                  <span 
                    className="engagement-badge"
                    style={{color: getEngagementColor(insights.engagement_level)}}
                  >
                    ● {insights.engagement_level}
                  </span>
                </div>
                <div className="engagement-details">
                  <div className="detail-item">
                    <span className="detail-label">Daily check-ins</span>
                    <span className="detail-value">{insights.weekly_activity.check_ins}/7</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Challenges completed</span>
                    <span className="detail-value">{insights.weekly_activity.challenges_completed}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Learning sessions</span>
                    <span className="detail-value">{insights.weekly_activity.learning_sessions}</span>
                  </div>
                </div>
              </div>

              <div className="summary-card glass-panel">
                <div className="card-header">
                  <h3>Academic Support</h3>
                  {insights.counselor_alerts > 0 && (
                    <span className="alert-badge">⚠️ {insights.counselor_alerts} Alert</span>
                  )}
                </div>
                <div className="academic-stats">
                  <div className="big-stat">
                    {insights.academic_help_sessions}
                  </div>
                  <p>AI tutor sessions this week</p>
                  <div className="positive-note">
                    ✓ Great initiative in seeking help!
                  </div>
                </div>
              </div>

              <div className="summary-card glass-panel">
                <div className="card-header">
                  <h3>Achievements</h3>
                </div>
                <div className="achievements-preview">
                  <div className="achievement-count">
                    🏆 {insights.achievements_unlocked}
                  </div>
                  <p>New badges unlocked</p>
                  <button className="view-all-btn">View All Achievements</button>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Growth */}
          <div className="skills-section glass-panel">
            <h2>📈 Skills Developing</h2>
            <div className="skills-grid">
              <div className="skills-column">
                <h4>✓ Improving</h4>
                <div className="skills-list">
                  {insights.skills_improved.map((skill, idx) => (
                    <div key={idx} className="skill-item improved">
                      <span className="skill-icon">✨</span>
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="skills-column">
                <h4>🎯 Current Focus</h4>
                <div className="skills-list">
                  {insights.areas_of_focus.map((area, idx) => (
                    <div key={idx} className="skill-item focus">
                      <span className="skill-icon">🎯</span>
                      <span>{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Highlights */}
          {weeklyReport && (
            <div className="weekly-highlights glass-panel">
              <div className="section-header">
                <h2>🌟 Weekly Highlights</h2>
                <button className="download-btn" onClick={downloadReport}>
                  📥 Download Report
                </button>
              </div>
              <p className="summary-text">{weeklyReport.summary}</p>
              
              <div className="highlights-grid">
                <div className="highlights-column">
                  <h4>Wins This Week</h4>
                  <ul className="highlights-list">
                    {weeklyReport.highlights.map((highlight, idx) => (
                      <li key={idx}>
                        <span className="check-icon">✓</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="highlights-column">
                  <h4>How to Support</h4>
                  <ul className="highlights-list">
                    {weeklyReport.areas_to_support.map((area, idx) => (
                      <li key={idx}>
                        <span className="tip-icon">💡</span>
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Parenting Tips */}
          {weeklyReport && (
            <div className="parenting-tips glass-panel">
              <h2>💡 Research-Based Parenting Tips</h2>
              <p className="tips-intro">
                Based on current educational and psychological research
              </p>
              <div className="tips-grid">
                {weeklyReport.parent_tips.map((item, idx) => (
                  <div key={idx} className="tip-card">
                    <div className="tip-number">{idx + 1}</div>
                    <h4>{item.tip}</h4>
                    <p className="tip-why">
                      <strong>Why:</strong> {item.why}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Items */}
          <div className="action-items glass-panel">
            <h2>📋 Suggested Actions</h2>
            <div className="actions-list">
              <div className="action-item">
                <input type="checkbox" id="action1" />
                <label htmlFor="action1">
                  <strong>Have a casual conversation</strong>
                  <p>Ask about their favorite part of using the app this week</p>
                </label>
              </div>
              <div className="action-item">
                <input type="checkbox" id="action2" />
                <label htmlFor="action2">
                  <strong>Celebrate achievements together</strong>
                  <p>Acknowledge the 8 challenges they completed</p>
                </label>
              </div>
              <div className="action-item">
                <input type="checkbox" id="action3" />
                <label htmlFor="action3">
                  <strong>Check in on exam preparation</strong>
                  <p>Offer support without adding pressure</p>
                </label>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ParentDashboard
