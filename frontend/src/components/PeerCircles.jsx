import { useState, useEffect } from 'react'
import { peerCirclesAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { useSocket } from '../contexts/SocketContext'
import './PeerCircles.css'

function PeerCircles() {
  const [view, setView] = useState('discover')
  const [circles, setCircles] = useState([])
  const [myCircles, setMyCircles] = useState([])
  const [selectedCircle, setSelectedCircle] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [filterInterest, setFilterInterest] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  
  const { user } = useAuth()
  const { socket } = useSocket()
  const userId = user?.id || 'demo-user-123'
  
  // Socket.IO Integration
  useEffect(() => {
    if (!socket || !selectedCircle || view !== 'chat') return

    // Join the circle room
    socket.emit('join_circle', { circle_id: selectedCircle.id })

    // Listen for incoming messages
    const handleMessage = (msg) => {
      setMessages(prev => {
        // Avoid duplicates if we optimistically added it (check by timestamp or ID)
        if (prev.some(m => m.timestamp === msg.timestamp && m.userId === msg.userId)) {
          return prev
        }
        return [...prev, msg]
      })
    }
    
    socket.on('message', handleMessage)

    return () => {
      socket.emit('leave_circle', { circle_id: selectedCircle.id })
      socket.off('message', handleMessage)
    }
  }, [socket, selectedCircle, view])


  const interestCategories = [
    'All', 'Gaming', 'Music', 'Sports', 'Art', 'Reading', 
    'Coding', 'Dance', 'Cooking', 'Photography', 'Science'
  ]

  // Mock circles data
  const mockCircles = [
    {
      id: 1,
      name: 'Gaming Buddies',
      interest: 'Gaming',
      members: 8,
      maxMembers: 10,
      description: 'Connect with fellow gamers, share tips, and organize gaming sessions',
      isAnonymous: false,
      onlineMembers: 3,
      lastActivity: '2 minutes ago',
      challenges: ['Play together', 'Share game reviews']
    },
    {
      id: 2,
      name: 'Exam Warriors',
      interest: 'Study Support',
      members: 12,
      maxMembers: 15,
      description: 'Support each other through exam stress with study tips and motivation',
      isAnonymous: true,
      onlineMembers: 5,
      lastActivity: '5 minutes ago',
      challenges: ['Daily study check-in', 'Share study techniques']
    },
    {
      id: 3,
      name: 'Creative Corner',
      interest: 'Art',
      members: 6,
      maxMembers: 10,
      description: 'Share your artwork, get feedback, and inspire each other',
      isAnonymous: false,
      onlineMembers: 2,
      lastActivity: '1 hour ago',
      challenges: ['Weekly art challenge', 'Feedback Friday']
    },
    {
      id: 4,
      name: 'Fitness Crew',
      interest: 'Sports',
      members: 10,
      maxMembers: 12,
      description: 'Stay motivated, share workout routines, track progress together',
      isAnonymous: false,
      onlineMembers: 4,
      lastActivity: '30 minutes ago',
      challenges: ['30-day fitness challenge', 'Weekly goal sharing']
    }
  ]

  const mockMessages = [
    {
      id: 1,
      userId: 'user1',
      username: 'Sarah',
      content: 'Hey everyone! Just wanted to share that I finally beat that level we were talking about! 🎮',
      timestamp: new Date(Date.now() - 300000),
      isAnonymous: false
    },
    {
      id: 2,
      userId: 'user2',
      username: 'Anonymous Phoenix',
      content: 'That\'s awesome! What strategy did you use?',
      timestamp: new Date(Date.now() - 240000),
      isAnonymous: true
    },
    {
      id: 3,
      userId: 'user3',
      username: 'Alex',
      content: 'Congrats! 🎉 I\'m still stuck on level 15. Any tips?',
      timestamp: new Date(Date.now() - 180000),
      isAnonymous: false
    }
  ]

  useEffect(() => {
    const fetchCircles = async () => {
      try {
        const data = await peerCirclesAPI.listCircles(filterInterest === 'all' ? null : filterInterest)
        // If backend returns empty, use mock for demo
        if (data && data.length > 0) {
            setCircles(data)
        } else {
            setCircles(mockCircles)
        }
      } catch (err) {
        console.error('Error fetching circles:', err)
        setCircles(mockCircles)
      }
    }
    fetchCircles()
  }, [filterInterest])

  const joinCircle = async (circleId) => {
    try {
        await peerCirclesAPI.joinCircle(circleId, userId)
        const circle = circles.find(c => c.id === circleId)
        if (circle) {
            setMyCircles([...myCircles, circle])
            alert(`You've joined ${circle.name}!`)
        }
    } catch (err) {
        console.error('Error joining circle:', err)
        // Fallback for demo
        const circle = circles.find(c => c.id === circleId)
        if (circle) {
            setMyCircles([...myCircles, circle])
            alert(`You've joined ${circle.name}! (Demo)`)
        }
    }
  }

  const openCircleChat = async (circle) => {
    setSelectedCircle(circle)
    setView('chat')
    try {
        const msgs = await peerCirclesAPI.getMessages(circle.id)
        setMessages(msgs && msgs.length > 0 ? msgs : mockMessages)
    } catch (err) {
        console.error('Error fetching messages:', err)
        setMessages(mockMessages)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const messageData = {
      userId: userId,
      username: isAnonymous ? 'Anonymous User' : (user?.name || 'You'),
      content: newMessage,
      timestamp: new Date().toISOString(),
      isAnonymous: isAnonymous
    }

    try {
        // Send to API, which triggers Socket broadcast
        await peerCirclesAPI.sendMessage(selectedCircle.id, messageData)
        
        // We only optimistically update if we don't trust the socket speed, 
        // but to avoid duplication with the socket listener above, 
        // let's rely on the socket OR distinct by timestamp.
        // For responsiveness, let's add it but the socket listener will filter it out if matches
        setMessages(prev => [...prev, { ...messageData, id: Date.now(), timestamp: new Date() }])
        
        setNewMessage('')
    } catch (err) {
        console.error('Error sending message:', err)
        // Fallback
        setMessages(prev => [...prev, { ...messageData, id: Date.now(), timestamp: new Date() }])
        setNewMessage('')
    }
  }

  const filteredCircles = filterInterest === 'all' 
    ? circles 
    : circles.filter(c => c.interest.toLowerCase() === filterInterest.toLowerCase())

  return (
    <div className="peer-circles-container">
      <header className="circles-header">
        <h1 className="text-gradient">👥 Peer Support Circles</h1>
        <p className="circles-subtitle">
          Connect with others who share your interests, struggles, and goals
        </p>
      </header>

      {/* Navigation Tabs */}
      <div className="circles-nav">
        <button
          className={`nav-btn ${view === 'discover' ? 'active' : ''}`}
          onClick={() => setView('discover')}
        >
          🔍 Discover Circles
        </button>
        <button
          className={`nav-btn ${view === 'myCircles' ? 'active' : ''}`}
          onClick={() => setView('myCircles')}
        >
          💬 My Circles ({myCircles.length})
        </button>
        <button
          className="create-circle-btn"
          onClick={() => setShowCreateModal(true)}
        >
          ➕ Create Circle
        </button>
      </div>

      {/* Discover View */}
      {view === 'discover' && (
        <div className="discover-view">
          {/* Filter */}
          <div className="filter-section glass-panel">
            <label>Filter by interest:</label>
            <div className="filter-buttons">
              {interestCategories.map(interest => (
                <button
                  key={interest}
                  className={`filter-btn ${filterInterest === interest.toLowerCase() ? 'active' : ''}`}
                  onClick={() => setFilterInterest(interest.toLowerCase())}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Circles Grid */}
          <div className="circles-grid">
            {filteredCircles.map(circle => (
              <div key={circle.id} className="circle-card glass-panel">
                <div className="circle-header">
                  <h3>{circle.name}</h3>
                  <span className="circle-badge">{circle.interest}</span>
                </div>

                <p className="circle-description">{circle.description}</p>

                <div className="circle-stats">
                  <div className="stat">
                    <span className="stat-icon">👥</span>
                    <span>{circle.members}/{circle.maxMembers} members</span>
                  </div>
                  <div className="stat">
                    <span className="stat-icon">🟢</span>
                    <span>{circle.onlineMembers} online</span>
                  </div>
                  <div className="stat">
                    <span className="stat-icon">⏰</span>
                    <span>{circle.lastActivity}</span>
                  </div>
                </div>

                {circle.isAnonymous && (
                  <div className="anonymous-badge">🎭 Anonymous mode available</div>
                )}

                <div className="circle-challenges">
                  <strong>Active Challenges:</strong>
                  <ul>
                    {circle.challenges.map((challenge, idx) => (
                      <li key={idx}>{challenge}</li>
                    ))}
                  </ul>
                </div>

                <div className="circle-actions">
                  {myCircles.find(c => c.id === circle.id) ? (
                    <button
                      className="chat-btn"
                      onClick={() => openCircleChat(circle)}
                    >
                      💬 Open Chat
                    </button>
                  ) : (
                    <button
                      className="join-btn"
                      onClick={() => joinCircle(circle.id)}
                      disabled={circle.members >= circle.maxMembers}
                    >
                      {circle.members >= circle.maxMembers ? '🔒 Full' : '➕ Join Circle'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Circles View */}
      {view === 'myCircles' && (
        <div className="my-circles-view">
          {myCircles.length === 0 ? (
            <div className="empty-state glass-panel">
              <div className="empty-icon">🔍</div>
              <h2>You haven't joined any circles yet</h2>
              <p>Explore circles to find communities that match your interests</p>
              <button className="discover-btn" onClick={() => setView('discover')}>
                Discover Circles
              </button>
            </div>
          ) : (
            <div className="my-circles-list">
              {myCircles.map(circle => (
                <div key={circle.id} className="my-circle-item glass-panel">
                  <div className="circle-info">
                    <h3>{circle.name}</h3>
                    <p>{circle.description}</p>
                    <div className="quick-stats">
                      <span>👥 {circle.members} members</span>
                      <span>🟢 {circle.onlineMembers} online</span>
                      <span>⏰ {circle.lastActivity}</span>
                    </div>
                  </div>
                  <button
                    className="open-chat-btn"
                    onClick={() => openCircleChat(circle)}
                  >
                    💬 Open Chat
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Chat View */}
      {view === 'chat' && selectedCircle && (
        <div className="chat-view">
          <div className="chat-header glass-panel">
            <button className="back-btn" onClick={() => setView('myCircles')}>
              ← Back
            </button>
            <div className="chat-title">
              <h2>{selectedCircle.name}</h2>
              <span className="online-count">🟢 {selectedCircle.onlineMembers} online</span>
            </div>
            <button className="info-btn">ℹ️ Info</button>
          </div>

          <div className="chat-messages glass-panel">
            {messages.map(msg => (
              <div key={msg.id} className={`chat-message ${msg.userId === 'current-user' ? 'own' : ''}`}>
                <div className="message-avatar">
                  {msg.isAnonymous ? '🎭' : '👤'}
                </div>
                <div className="message-bubble">
                  <div className="message-header">
                    <strong>{msg.username}</strong>
                    <span className="message-time">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="chat-input glass-panel">
            <label className="anonymous-toggle">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              <span>🎭 Send anonymously</span>
            </label>
            <div className="input-row">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                rows="2"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
              />
              <button className="send-btn" onClick={sendMessage}>
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Circle Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Circle</h2>
            <form onSubmit={(e) => { e.preventDefault(); setShowCreateModal(false); }}>
              <div className="form-group">
                <label>Circle Name</label>
                <input type="text" placeholder="Choose a welcoming name" required />
              </div>
              <div className="form-group">
                <label>Interest Focus</label>
                <select required>
                  {interestCategories.slice(1).map(interest => (
                    <option key={interest} value={interest}>{interest}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea placeholder="What's this circle about?" rows="3" required />
              </div>
              <div className="form-group">
                <label>Max Members</label>
                <input type="number" min="3" max="20" defaultValue="10" required />
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" />
                  <span>Allow anonymous posting</span>
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="create-btn">
                  Create Circle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PeerCircles
