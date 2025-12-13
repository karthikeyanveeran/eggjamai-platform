import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

class SocketService {
  constructor() {
    this.socket = null
    this.listeners = new Map()
  }

  connect(userId) {
    if (this.socket?.connected) return

    this.socket = io(SOCKET_URL, {
      auth: { userId },
      transports: ['websocket', 'polling']
    })

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id)
    })

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected')
    })

    this.socket.on('error', (error) => {
      console.error('Socket error:', error)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  // Real-time messaging
  sendMessage(roomId, message, user) {
    this.socket?.emit('send_message', { roomId, message, user })
  }

  onMessage(callback) {
    this.socket?.on('new_message', callback)
  }

  // Typing indicators
  startTyping(roomId, userName) {
    this.socket?.emit('typing_start', { roomId, userName })
  }

  stopTyping(roomId, userName) {
    this.socket?.emit('typing_stop', { roomId, userName })
  }

  onTyping(callback) {
    this.socket?.on('user_typing', callback)
  }

  onTypingStop(callback) {
    this.socket?.on('user_typing_stop', callback)
  }

  // Presence (online/offline)
  joinRoom(roomId) {
    this.socket?.emit('join_room', roomId)
  }

  leaveRoom(roomId) {
    this.socket?.emit('leave_room', roomId)
  }

  onUserJoined(callback) {
    this.socket?.on('user_joined', callback)
  }

  onUserLeft(callback) {
    this.socket?.on('user_left', callback)
  }

  onOnlineUsers(callback) {
    this.socket?.on('online_users', callback)
  }

  // Live reactions
  sendReaction(roomId, emoji, user) {
    this.socket?.emit('reaction', { roomId, emoji, user })
  }

  onReaction(callback) {
    this.socket?.on('new_reaction', callback)
  }

  // Achievement broadcasts
  broadcastAchievement(achievement) {
    this.socket?.emit('achievement_unlocked', achievement)
  }

  onAchievementBroadcast(callback) {
    this.socket?.on('friend_achievement', callback)
  }

  // Mood updates
  broadcastMood(userId, mood) {
    this.socket?.emit('mood_update', { userId, mood })
  }

  onMoodUpdate(callback) {
    this.socket?.on('friend_mood_update', callback)
  }

  // Challenge invites
  sendChallengeInvite(friendId, challenge) {
    this.socket?.emit('challenge_invite', { friendId, challenge })
  }

  onChallengeInvite(callback) {
    this.socket?.on('challenge_invite', callback)
  }

  // Live study session
  startStudySession(sessionId, settings) {
    this.socket?.emit('start_study_session', { sessionId, settings })
  }

  joinStudySession(sessionId) {
    this.socket?.emit('join_study_session', sessionId)
  }

  onStudySessionUpdate(callback) {
    this.socket?.on('study_session_update', callback)
  }

  // Notifications
  onNotification(callback) {
    this.socket?.on('notification', callback)
  }
}

export const socketService = new SocketService()
export default socketService
