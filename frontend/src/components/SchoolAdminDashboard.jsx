import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import './SchoolAdminDashboard.css'

function SchoolAdminDashboard() {
  const { user } = useAuth()
  const [view, setView] = useState('overview') // overview, students, counselors, reports
  const [filterRisk, setFilterRisk] = useState('all')
  const [filterGrade, setFilterGrade] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [schoolData, setSchoolData] = useState(null)
  const [studentsList, setStudentsList] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [importFile, setImportFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)

  // Mock school overview data
  const mockSchoolData = {
    school_name: 'Delhi Public School',
    total_students: 1000,
    active_users: 750,
    high_risk_students: 12,
    moderate_risk_students: 45,
    low_risk_students: 150,
    avg_engagement_rate: 0.75,
    most_requested_help: [
      { topic: 'Math', count: 245 },
      { topic: 'Anxiety management', count: 180 },
      { topic: 'Study skills', count: 156 },
      { topic: 'Time management', count: 134 },
      { topic: 'Exam preparation', count: 120 }
    ],
    counselor_alerts_this_week: 8,
    trend_data: {
      reported_anxiety: -15, // -15% reduction
      help_seeking: +40, // +40% increase
      engagement: +25
    }
  }

  // Mock students list
  const mockStudents = [
    {
      id: 1,
      name: 'Student A',
      grade: 10,
      section: 'A',
      risk_level: 'high',
      engagement: 'low',
      last_active: '2 hours ago',
      alerts: 2,
      mood_trend: 'declining'
    },
    {
      id: 2,
      name: 'Student B',
      grade: 9,
      section: 'B',
      risk_level: 'moderate',
      engagement: 'medium',
      last_active: '1 day ago',
      alerts: 0,
      mood_trend: 'stable'
    },
    {
      id: 3,
      name: 'Student C',
      grade: 11,
      section: 'A',
      risk_level: 'low',
      engagement: 'high',
      last_active: '30 minutes ago',
      alerts: 0,
      mood_trend: 'improving'
    }
  ]

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, we'd get the school ID from the user's profile
        // For demo purposes, we'll default to 1 if not present
        const schoolId = user?.school_id || 1
        
        const [overviewData, studentsData] = await Promise.all([
          api.school.getDashboard(schoolId),
          api.admin.getStudentList(schoolId)
        ])
        
        setSchoolData(overviewData.stats)
        // Merge school name if needed or handle differently
        if (overviewData.school_name) {
             // Update logic if schoolData structure differs
        }
        setStudentsList(studentsData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        // Fallback to mock data for demo if backend is unavailable
        setSchoolData(mockSchoolData)
        setStudentsList(mockStudents)
      }
    }

    fetchDashboardData()
  }, [user])

  const getRiskColor = (level) => {
    switch(level) {
      case 'critical': return '#dc2626'
      case 'high': return '#ef4444'
      case 'moderate': return '#f59e0b'
      case 'low': return '#10b981'
      default: return '#6b7280'
    }
  }

  const exportData = (format) => {
    alert(`Exporting data as ${format}...`)
    // In production, generate and download file
  }

  const handleFileChange = (e) => {
    setImportFile(e.target.files[0])
    setUploadResult(null)
  }

  const handleImport = async () => {
    if (!importFile) return
    
    setUploading(true)
    try {
      const schoolId = user?.school_id || 1
      const result = await api.school.importStudents(schoolId, importFile)
      setUploadResult({ type: 'success', message: result.message })
      // Refresh list
      const students = await api.admin.getStudentList(schoolId)
      setStudentsList(students)
      setImportFile(null)
    } catch (error) {
      setUploadResult({ type: 'error', message: error.message })
    } finally {
      setUploading(false)
    }
  }

  const filteredStudents = studentsList.filter(student => {
    const matchesRisk = filterRisk === 'all' || student.risk_level === filterRisk
    const matchesGrade = filterGrade === 'all' || student.grade === parseInt(filterGrade)
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesRisk && matchesGrade && matchesSearch
  })

  if (!schoolData) return <div>Loading...</div>

  return (
    <div className="school-admin-container">
      <header className="admin-header">
        <div className="header-content">
          <h1 className="text-gradient">🏫 School Admin Dashboard</h1>
          <p className="admin-subtitle">{schoolData.school_name}</p>
        </div>
        <div className="header-actions">
          <button className="export-btn" onClick={() => exportData('PDF')}>
            📄 Export PDF
          </button>
          <button className="export-btn" onClick={() => exportData('CSV')}>
            📊 Export CSV
          </button>
        </div>
      </header>

      {/* Navigation */}
      <div className="admin-nav">
        <button
          className={`nav-btn ${view === 'overview' ? 'active' : ''}`}
          onClick={() => setView('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`nav-btn ${view === 'students' ? 'active' : ''}`}
          onClick={() => setView('students')}
        >
          👥 Students
        </button>
        <button
          className={`nav-btn ${view === 'counselors' ? 'active' : ''}`}
          onClick={() => setView('counselors')}
        >
          🩺 Counselors
        </button>
        <button
          className={`nav-btn ${view === 'reports' ? 'active' : ''}`}
          onClick={() => setView('reports')}
        >
          📈 Reports
        </button>
      </div>

      {/* Overview */}
      {view === 'overview' && (
        <div className="overview-section">
          {/* Key Metrics */}
          <div className="metrics-grid">
            <div className="metric-card glass-panel">
              <h3>Total Students</h3>
              <div className="big-number">{schoolData.total_students}</div>
              <div className="metric-detail">
                {schoolData.active_users} active users ({Math.round(schoolData.active_users/schoolData.total_students*100)}%)
              </div>
            </div>

            <div className="metric-card glass-panel alert">
              <h3>High Priority</h3>
              <div className="big-number">{schoolData.high_risk_students}</div>
              <div className="metric-detail">
                Require immediate attention
              </div>
              <button className="view-list-btn">View List</button>
            </div>

            <div className="metric-card glass-panel warning">
              <h3>Medium Priority</h3>
              <div className="big-number">{schoolData.moderate_risk_students}</div>
              <div className="metric-detail">
                Being monitored
              </div>
            </div>

            <div className="metric-card glass-panel">
              <h3>Counselor Alerts</h3>
              <div className="big-number">{schoolData.counselor_alerts_this_week}</div>
              <div className="metric-detail">
                This week
              </div>
            </div>
          </div>

          {/* Risk Distribution */}
          <div className="risk-distribution glass-panel">
            <h2>Student Risk Distribution</h2>
            <div className="risk-chart">
              <div 
                className="risk-bar high"
                style={{width: `${(schoolData.high_risk_students / schoolData.total_students) * 100}%`}}
                title={`High Risk: ${schoolData.high_risk_students}`}
              >
                <span className="bar-label">High: {schoolData.high_risk_students}</span>
              </div>
              <div 
                className="risk-bar moderate"
                style={{width: `${(schoolData.moderate_risk_students / schoolData.total_students) * 100}%`}}
                title={`Moderate: ${schoolData.moderate_risk_students}`}
              >
                <span className="bar-label">Moderate: {schoolData.moderate_risk_students}</span>
              </div>
              <div 
                className="risk-bar low"
                style={{width: `${(schoolData.low_risk_students / schoolData.total_students) * 100}%`}}
                title={`Low Risk: ${schoolData.low_risk_students}`}
              >
                <span className="bar-label">Low: {schoolData.low_risk_students}</span>
              </div>
            </div>
          </div>

          {/* Most Requested Help */}
          <div className="help-topics glass-panel">
            <h2>Most Requested Help Topics</h2>
            <div className="topics-list">
              {schoolData.most_requested_help.map((topic, idx) => (
                <div key={idx} className="topic-item">
                  <div className="topic-rank">{idx + 1}</div>
                  <div className="topic-info">
                    <strong>{topic.topic}</strong>
                    <div className="topic-bar">
                      <div 
                        className="topic-fill"
                        style={{width: `${(topic.count / schoolData.most_requested_help[0].count) * 100}%`}}
                      ></div>
                    </div>
                  </div>
                  <div className="topic-count">{topic.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Trends */}
          <div className="trends-section glass-panel">
            <h2>Positive Trends</h2>
            <div className="trends-grid">
              <div className="trend-card">
                <div className="trend-icon positive">📉</div>
                <h4>Anxiety Reduction</h4>
                <div className="trend-value">{Math.abs(schoolData.trend_data.reported_anxiety)}%</div>
                <p>decrease in reported anxiety</p>
              </div>
              <div className="trend-card">
                <div className="trend-icon positive">📈</div>
                <h4>Help-Seeking Behavior</h4>
                <div className="trend-value">+{schoolData.trend_data.help_seeking}%</div>
                <p>increase in students seeking help</p>
              </div>
              <div className="trend-card">
                <div className="trend-icon positive">🎯</div>
                <h4>Platform Engagement</h4>
                <div className="trend-value">+{schoolData.trend_data.engagement}%</div>
                <p>higher daily active usage</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Students View */}
      {view === 'students' && (
        <div className="students-section">
          {/* Filters */}
          <div className="filters-bar glass-panel">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)}>
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk</option>
              <option value="moderate">Moderate Risk</option>
              <option value="low">Low Risk</option>
            </select>

            <select value={filterGrade} onChange={(e) => setFilterGrade(e.target.value)}>
              <option value="all">All Grades</option>
              {[6,7,8,9,10,11,12].map(grade => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>

            <div className="results-count">
              {filteredStudents.length} students
            </div>
          </div>

          {/* Import Section */}
          <div className="import-section glass-panel">
            <h3>Bulk Import Students</h3>
            <div className="import-controls">
              <input 
                type="file" 
                accept=".csv"
                onChange={handleFileChange}
                className="file-input"
              />
              <button 
                className="import-btn"
                onClick={handleImport}
                disabled={!importFile || uploading}
              >
                {uploading ? 'Uploading...' : '📥 Import CSV'}
              </button>
            </div>
            {uploadResult && (
              <div className={`upload-message ${uploadResult.type}`}>
                {uploadResult.message}
              </div>
            )}
            <div className="csv-template-hint">
              <small>Format: email, full_name, grade_level</small>
            </div>
          </div>

          {/* Students Table */}
          <div className="students-table glass-panel">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Grade/Section</th>
                  <th>Risk Level</th>
                  <th>Engagement</th>
                  <th>Mood Trend</th>
                  <th>Last Active</th>
                  <th>Alerts</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => (
                  <tr key={student.id}>
                    <td>
                      <div className="student-name">
                        <div className="student-avatar">👤</div>
                        {student.name}
                      </div>
                    </td>
                    <td>{student.grade}-{student.section}</td>
                    <td>
                      <span 
                        className="risk-badge"
                        style={{backgroundColor: getRiskColor(student.risk_level)}}
                      >
                        {student.risk_level}
                      </span>
                    </td>
                    <td>
                      <span className={`engagement-badge ${student.engagement}`}>
                        {student.engagement}
                      </span>
                    </td>
                    <td>
                      <span className={`trend-badge ${student.mood_trend}`}>
                        {student.mood_trend === 'improving' && '📈'}
                        {student.mood_trend === 'stable' && '➡️'}
                        {student.mood_trend === 'declining' && '📉'}
                        {student.mood_trend}
                      </span>
                    </td>
                    <td>{student.last_active}</td>
                    <td>
                      {student.alerts > 0 && (
                        <span className="alerts-badge">⚠️ {student.alerts}</span>
                      )}
                    </td>
                    <td>
                      <button 
                        className="view-details-btn"
                        onClick={() => setSelectedStudent(student)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Counselors View */}
      {view === 'counselors' && (
        <div className="counselors-section">
          <div className="counselor-stats glass-panel">
            <h2>Counselor Workload</h2>
            <div className="counselor-grid">
              <div className="counselor-card">
                <h4>Ms. Sharma</h4>
                <div className="workload-info">
                  <div className="assigned">45 students assigned</div>
                  <div className="active-cases">8 active cases</div>
                  <div className="workload-bar">
                    <div className="bar-fill" style={{width: '75%'}}></div>
                  </div>
                  <div className="workload-label">75% capacity</div>
                </div>
              </div>
              <div className="counselor-card">
                <h4>Mr. Patel</h4>
                <div className="workload-info">
                  <div className="assigned">38 students assigned</div>
                  <div className="active-cases">5 active cases</div>
                  <div className="workload-bar">
                    <div className="bar-fill" style={{width: '60%'}}></div>
                  </div>
                  <div className="workload-label">60% capacity</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedStudent.name} - Detailed View</h2>
            <div className="student-detail-content">
              <p><strong>Grade:</strong> {selectedStudent.grade}-{selectedStudent.section}</p>
              <p><strong>Risk Level:</strong> <span style={{color: getRiskColor(selectedStudent.risk_level)}}>{selectedStudent.risk_level}</span></p>
              <p><strong>Engagement:</strong> {selectedStudent.engagement}</p>
              <p><strong>Mood Trend:</strong> {selectedStudent.mood_trend}</p>
              <p><strong>Last Active:</strong> {selectedStudent.last_active}</p>
              
              <div className="action-buttons">
                <button>Assign to Counselor</button>
                <button>Send Message</button>
                <button>View Full History</button>
              </div>
            </div>
            <button className="close-modal-btn" onClick={() => setSelectedStudent(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SchoolAdminDashboard
