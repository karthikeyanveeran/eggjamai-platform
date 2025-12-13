import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

// Import contexts
import { useAuth } from './contexts/AuthContext'
import { useToast } from './contexts/ToastContext'

// Import all components
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import ChatWindow from './components/ChatWindow'
import Assessment from './components/Assessment'
import MoodTracker from './components/MoodTracker'
import Resources from './components/Resources'
import VideoChat from './components/VideoChat'
import BreathingExercise from './components/BreathingExercise'
import Achievements from './components/Achievements'
import DailyChallenges from './components/DailyChallenges'
import PersonalizedChallenges from './components/PersonalizedChallenges'
import PurposeDiscovery from './components/PurposeDiscovery'
import PeerCircles from './components/PeerCircles'
import DigitalDetox from './components/DigitalDetox'
import ExamAnxietyTherapy from './components/ExamAnxietyTherapy'
import AcademicTutor from './components/AcademicTutor'
import ParentMediator from './components/ParentMediator'
import ParentDashboard from './components/ParentDashboard'
import SchoolAdminDashboard from './components/SchoolAdminDashboard'
import LDDashboard from './components/LDDashboard'
import CrisisAlert from './components/CrisisAlert'
import PlatformAdminDashboard from './components/PlatformAdminDashboard'

// Import Enhanced UX Components
import SoundControl from './components/SoundControl'
import { ParticleBackground } from './components/ParticleBackground'

function App() {
  const { user, login, logout, loading } = useAuth()
  const [currentView, setCurrentView] = useState('dashboard')
  const [showCrisisAlert, setShowCrisisAlert] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Update view when user role changes or on initial load
  useEffect(() => {
    if (user) {
      // If we are on login page but user is logged in, go to dashboard
      if (currentView === 'login' || currentView === 'register') {
        setCurrentView(getDashboardForRole(user.role))
      }
    }
  }, [user])

  // Get appropriate dashboard based on user role
  const getDashboardForRole = (role) => {
    switch (role) {
      case 'parent':
        return 'parent-dashboard'
      case 'school_admin':
        return 'school-admin-dashboard'
      case 'ld_specialist':
        return 'ld-dashboard'
      case 'platform_admin':
        return 'platform-admin-dashboard'
      default:
        return 'dashboard'
    }
  }

  // Handle navigation
  const navigate = (view) => {
    setCurrentView(view)
  }

  // Handle crisis alert
  const handleCrisisAlert = () => {
    setShowCrisisAlert(true)
  }

  const handleLogout = () => {
    logout()
    setCurrentView('login')
  }

  // Navigation items based on user role
  const getNavigationItems = () => {
    if (!user) return []

    const commonItems = [
      { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
      { id: 'chat', label: 'AI Chat', icon: '💬' },
      { id: 'mood-tracker', label: 'Mood Tracker', icon: '😊' },
      { id: 'assessment', label: 'Assessments', icon: '📊' },
      { id: 'resources', label: 'Resources', icon: '📚' },
    ]

    const studentItems = [
      ...commonItems,
      { id: 'video-chat', label: 'Video Chat', icon: '📹' },
      { id: 'breathing', label: 'Breathing', icon: '🧘' },
      { id: 'achievements', label: 'Achievements', icon: '🏆' },
      { id: 'challenges', label: 'Challenges', icon: '🎯' },
      { id: 'personalized', label: 'My Journey', icon: '🌟' },
      { id: 'purpose', label: 'Purpose', icon: '🎨' },
      { id: 'peer-circles', label: 'Peer Circles', icon: '👥' },
      { id: 'digital-detox', label: 'Digital Detox', icon: '📱' },
      { id: 'exam-anxiety', label: 'Exam Help', icon: '📝' },
      { id: 'tutor', label: 'Tutor', icon: '👨‍🏫' },
    ]

    const parentItems = [
      { id: 'parent-dashboard', label: 'Dashboard', icon: '🏠' },
      { id: 'parent-mediator', label: 'Mediator', icon: '🤝' },
    ]

    const adminItems = [
      { id: 'school-admin-dashboard', label: 'Admin Dashboard', icon: '🏫' },
    ]

    const ldItems = [
      { id: 'ld-dashboard', label: 'LD Dashboard', icon: '🎓' },
    ]

    const platformAdminItems = [
      { id: 'platform-admin-dashboard', label: 'Platform Admin', icon: '⚡' },
    ]

    switch (user.role) {
      case 'parent':
        return parentItems
      case 'school_admin':
        return adminItems
      case 'ld_specialist':
        return ldItems
      case 'platform_admin':
        return platformAdminItems
      default:
        return studentItems
    }
  }

  // Render current view
  const renderView = () => {
    // If loading, show spinner
    if (loading) return <div className="loading-screen">Loading...</div>

    const viewComponents = {
      // Login/Register now handled by Clerk modal, but we keep keys to avoid errors
      'login': null,
      'register': null,
      'dashboard': <Dashboard user={user} onNavigate={navigate} />,
      'chat': <ChatWindow user={user} onCrisisAlert={handleCrisisAlert} />,
      'assessment': <Assessment user={user} />,
      'mood-tracker': <MoodTracker user={user} />,
      'resources': <Resources user={user} />,
      'video-chat': <VideoChat user={user} />,
      'breathing': <BreathingExercise />,
      'achievements': <Achievements user={user} />,
      'challenges': <DailyChallenges user={user} />,
      'personalized': <PersonalizedChallenges user={user} />,
      'purpose': <PurposeDiscovery user={user} />,
      'peer-circles': <PeerCircles user={user} />,
      'digital-detox': <DigitalDetox user={user} />,
      'exam-anxiety': <ExamAnxietyTherapy user={user} />,
      'tutor': <AcademicTutor user={user} />,
      'parent-mediator': <ParentMediator user={user} />,
      'parent-dashboard': <ParentDashboard user={user} />,
      'school-admin-dashboard': <SchoolAdminDashboard user={user} />,
      'ld-dashboard': <LDDashboard user={user} />,
      'platform-admin-dashboard': <PlatformAdminDashboard user={user} />,
    }

    return viewComponents[currentView] || viewComponents['dashboard']
  }

  // If not logged in, show Landing Page with Login button
  if (!user && !loading) {
    return (
      <div className="app">
        <ParticleBackground density="low" />
        <div className="login-container glass-panel">
          <div className="logo-large">🥚</div>
          <h1>Welcome to EggJam.ai</h1>
          <p>Your holistic growth companion</p>
          <div className="auth-buttons">
            <button className="primary-button" onClick={() => login()}>Sign In</button>
            <button className="secondary-button" onClick={() => login()}>Sign Up</button>
          </div>
        </div>
        <SoundControl position="bottom-right" />
      </div>
    )
  }

  // Main app layout with sidebar
  return (
    <div className="app">
      <ParticleBackground density="low" />
        
        {/* Crisis Alert Modal */}
        {showCrisisAlert && (
          <CrisisAlert onClose={() => setShowCrisisAlert(false)} />
        )}

      {/* Sidebar */}
      <motion.aside
        className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}
        initial={false}
        animate={{ width: sidebarOpen ? '280px' : '80px' }}
        transition={{ duration: 0.3 }}
      >
        <div className="sidebar-header">
          <motion.div
            className="logo"
            animate={{ scale: sidebarOpen ? 1 : 0.8 }}
          >
            🥚
          </motion.div>
          {sidebarOpen && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="logo-text"
            >
              EggJam.ai
            </motion.h1>
          )}
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {getNavigationItems().map((item) => (
            <motion.button
              key={item.id}
              className={`nav-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => navigate(item.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </motion.button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <motion.button
            className="nav-item logout-btn"
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="nav-icon">🚪</span>
            {sidebarOpen && <span className="nav-label">Logout</span>}
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="view-container"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Enhanced UX Features */}
      <SoundControl position="bottom-right" />
    </div>
  )
}

export default App
