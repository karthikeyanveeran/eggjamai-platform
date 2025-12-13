import { useState, useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import InputArea from './InputArea'
import TypingIndicator from './TypingIndicator'
import CrisisAlert from './CrisisAlert'
import { conversationAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { sounds } from '../utils/soundManager'
import './ChatWindow.css'

function ChatWindow() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m here to support you. How are you feeling today?',
      timestamp: new Date()
    }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [crisisInfo, setCrisisInfo] = useState(null)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  
  // Get user from auth context
  const { user } = useAuth()
  const userId = user?.id || 'demo-user-123'
  
  // Get toast notifications
  const { showError, showWarning } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSendMessage = async (content) => {
    // Play message sent sound
    sounds.messageSent()
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setError(null)

    // Get AI response
    setIsTyping(true)
    try {
      const response = await conversationAPI.sendMessage(
        content,
        userId,
        sessionId,
        'en'
      )

      // Save session ID
      if (!sessionId) {
        setSessionId(response.session_id)
      }

      // Play message received sound
      sounds.message()

      // Add AI message
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.message,
        timestamp: new Date(),
        riskLevel: response.risk_level
      }
      setMessages(prev => [...prev, aiMessage])

      // Handle crisis situations
      if (response.needs_counselor_attention) {
        sounds.notification()
        showWarning('Crisis support resources available')
        setCrisisInfo({
          riskLevel: response.risk_level,
          resources: response.suggested_resources || []
        })
      }

    } catch (err) {
      console.error('Error sending message:', err)
      const errorMessage = 'Failed to get response. Please try again.'
      setError(errorMessage)
      showError(errorMessage)
      sounds.error()
      
      // Remove user message on error
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id))
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="chat-window">
      <div className="chat-header glass-panel">
        <div className="chat-header-content">
          <div className="ai-avatar">
            <div className="avatar-ring"></div>
            <span>🥚</span>
          </div>
          <div className="chat-header-info">
            <h3>EggJam AI</h3>
            <p className="status">
              <span className="status-dot"></span>
              Always here for you
            </p>
          </div>
        </div>
      </div>

      {crisisInfo && (
        <CrisisAlert 
          riskLevel={crisisInfo.riskLevel}
          resources={crisisInfo.resources}
          onClose={() => setCrisisInfo(null)}
        />
      )}

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
        </div>
      )}

      <div className="messages-container">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <InputArea onSendMessage={handleSendMessage} disabled={isTyping} />
    </div>
  )
}

export default ChatWindow

