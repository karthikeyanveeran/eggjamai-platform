import AgoraRTC from 'agora-rtc-sdk-ng'

// Agora Configuration
const APP_ID = import.meta.env.VITE_AGORA_APP_ID || 'YOUR_AGORA_APP_ID'

// Create Agora client
export const createAgoraClient = (mode = 'rtc') => {
  return AgoraRTC.createClient({ 
    mode: mode, // 'rtc' for video, 'live' for streaming
    codec: 'vp8' 
  })
}

// Agora Service Class
class AgoraService {
  constructor() {
    this.client = null
    this.localAudioTrack = null
    this.localVideoTrack = null
    this.remoteUsers = {}
  }

  // Initialize client
  async init(mode = 'rtc') {
    this.client = createAgoraClient(mode)
    
    // Event listeners
    this.client.on('user-published', this.handleUserPublished.bind(this))
    this.client.on('user-unpublished', this.handleUserUnpublished.bind(this))
    this.client.on('user-joined', this.handleUserJoined.bind(this))
    this.client.on('user-left', this.handleUserLeft.bind(this))
  }

  // Join channel
  async joinChannel(channelName, token, uid = null, appId = null) {
    if (!this.client) {
      await this.init()
    }

    try {
      // Use provided App ID or fallback to env var
      const targetAppId = appId || APP_ID
      if (!targetAppId || targetAppId === 'YOUR_AGORA_APP_ID') {
        console.warn('Agora App ID not found')
      }

      // Join the channel
      uid = await this.client.join(targetAppId, channelName, token, uid)
      console.log('Joined channel:', channelName, 'UID:', uid)
      return uid
    } catch (error) {
      console.error('Failed to join channel:', error)
      throw error
    }
  }

  // Create and publish local tracks
  async createAndPublishTracks(video = true, audio = true) {
    try {
      const tracks = []

      if (audio) {
        this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack()
        tracks.push(this.localAudioTrack)
      }

      if (video) {
        this.localVideoTrack = await AgoraRTC.createCameraVideoTrack()
        tracks.push(this.localVideoTrack)
      }

      // Publish tracks
      if (tracks.length > 0) {
        await this.client.publish(tracks)
        console.log('Published local tracks')
      }

      return {
        audioTrack: this.localAudioTrack,
        videoTrack: this.localVideoTrack
      }
    } catch (error) {
      console.error('Failed to create/publish tracks:', error)
      throw error
    }
  }

  // Handle remote user published
  async handleUserPublished(user, mediaType) {
    await this.client.subscribe(user, mediaType)
    console.log('Subscribed to user:', user.uid, 'mediaType:', mediaType)

    if (mediaType === 'video') {
      this.remoteUsers[user.uid] = user
    }

    if (mediaType === 'audio') {
      user.audioTrack?.play()
    }
  }

  // Handle remote user unpublished
  handleUserUnpublished(user, mediaType) {
    console.log('User unpublished:', user.uid, mediaType)
    
    if (mediaType === 'video') {
      delete this.remoteUsers[user.uid]
    }
  }

  // Handle user joined
  handleUserJoined(user) {
    console.log('User joined:', user.uid)
  }

  // Handle user left
  handleUserLeft(user) {
    console.log('User left:', user.uid)
    delete this.remoteUsers[user.uid]
  }

  // Toggle microphone
  async toggleMic() {
    if (this.localAudioTrack) {
      const enabled = this.localAudioTrack.enabled
      await this.localAudioTrack.setEnabled(!enabled)
      return !enabled
    }
    return false
  }

  // Toggle camera
  async toggleCamera() {
    if (this.localVideoTrack) {
      const enabled = this.localVideoTrack.enabled
      await this.localVideoTrack.setEnabled(!enabled)
      return !enabled
    }
    return false
  }

  // Switch camera (front/back on mobile)
  async switchCamera() {
    if (this.localVideoTrack) {
      await this.localVideoTrack.switchDevice()
    }
  }

  // Screen sharing
  async startScreenShare() {
    try {
      const screenTrack = await AgoraRTC.createScreenVideoTrack()
      
      // Replace video track with screen track
      if (this.localVideoTrack) {
        await this.client.unpublish(this.localVideoTrack)
        this.localVideoTrack.close()
      }

      this.localVideoTrack = screenTrack
      await this.client.publish(screenTrack)
      
      return screenTrack
    } catch (error) {
      console.error('Screen share failed:', error)
      throw error
    }
  }

  async stopScreenShare() {
    if (this.localVideoTrack) {
      await this.client.unpublish(this.localVideoTrack)
      this.localVideoTrack.close()
      
      // Restart camera
      this.localVideoTrack = await AgoraRTC.createCameraVideoTrack()
      await this.client.publish(this.localVideoTrack)
    }
  }

  // Leave channel and cleanup
  async leave() {
    // Close local tracks
    this.localAudioTrack?.close()
    this.localVideoTrack?.close()

    // Remove remote users
    this.remoteUsers = {}

    // Leave channel
    if (this.client) {
      await this.client.leave()
    }

    console.log('Left channel')
  }

  // Get remote users
  getRemoteUsers() {
    return Object.values(this.remoteUsers)
  }
}

// Export singleton instance
export const agoraService = new AgoraService()

// Helper: Get Agora token from backend
export async function getAgoraToken(channelName, uid, role = 'publisher') {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    const response = await fetch(`${API_URL}/api/agora/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelName, uid, role })
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to get Agora token:', error)
    return { token: null, app_id: null }
  }
}

export default agoraService
