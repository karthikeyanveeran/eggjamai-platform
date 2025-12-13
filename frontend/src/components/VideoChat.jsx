import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import agoraService, { getAgoraToken } from '../services/agoraService'
import './VideoChat.css'

function VideoChat({ channelName, onClose, mode = 'video' }) {
  const [isJoined, setIsJoined] = useState(false)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isCameraOn, setIsCameraOn] = useState(mode === 'video')
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [remoteUsers, setRemoteUsers] = useState([])
  const [localUid, setLocalUid] = useState(null)
  
  const localVideoRef = useRef(null)
  const remoteVideoRefs = useRef({})

  useEffect(() => {
    joinChannel()
    return () => {
      leaveChannel()
    }
  }, [])

  useEffect(() => {
    // Update remote users periodically
    const interval = setInterval(() => {
      const users = agoraService.getRemoteUsers()
      setRemoteUsers(users)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Play remote videos
  useEffect(() => {
    remoteUsers.forEach(user => {
      if (user.videoTrack && remoteVideoRefs.current[user.uid]) {
        user.videoTrack.play(remoteVideoRefs.current[user.uid])
      }
    })
  }, [remoteUsers])

  const joinChannel = async () => {
    try {
      // Get token from backend
      const { token, app_id } = await getAgoraToken(channelName, null)
      
      // Join channel
      const uid = await agoraService.joinChannel(channelName, token, null, app_id)
      setLocalUid(uid)

      // Create and publish tracks
      const { videoTrack } = await agoraService.createAndPublishTracks(
        mode === 'video', 
        true
      )

      // Play local video
      if (videoTrack && localVideoRef.current) {
        videoTrack.play(localVideoRef.current)
      }

      setIsJoined(true)
    } catch (error) {
      console.error('Failed to join:', error)
      alert('Failed to join video chat: ' + error.message)
    }
  }

  const leaveChannel = async () => {
    await agoraService.leave()
    setIsJoined(false)
    if (onClose) onClose()
  }

  const toggleMic = async () => {
    const enabled = await agoraService.toggleMic()
    setIsMicOn(enabled)
  }

  const toggleCamera = async () => {
    const enabled = await agoraService.toggleCamera()
    setIsCameraOn(enabled)
  }

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        await agoraService.stopScreenShare()
        setIsScreenSharing(false)
      } else {
        await agoraService.startScreenShare()
        setIsScreenSharing(true)
      }
    } catch (error) {
      console.error('Screen share error:', error)
    }
  }

  return (
    <motion.div 
      className="video-chat-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="video-chat-header">
        <h3>🎥 {channelName}</h3>
        <div className="participants-count">
          👥 {remoteUsers.length + 1} participants
        </div>
      </div>

      <div className="video-grid">
        {/* Local Video */}
        <motion.div 
          className="video-tile local"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          <div 
            ref={localVideoRef} 
            className="video-player"
            style={{ display: isCameraOn ? 'block' : 'none' }}
          />
          {!isCameraOn && (
            <div className="video-placeholder">
              <div className="avatar-placeholder">
                <span>👤</span>
                <p>You</p>
              </div>
            </div>
          )}
          <div className="video-label">You {isMicOn ? '' : '🔇'}</div>
        </motion.div>

        {/* Remote Videos */}
        <AnimatePresence>
          {remoteUsers.map((user, index) => (
            <motion.div 
              key={user.uid}
              className="video-tile remote"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div 
                ref={el => remoteVideoRefs.current[user.uid] = el}
                className="video-player"
              />
              <div className="video-label">
                User {user.uid} {user.hasAudio ? '' : '🔇'}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="video-controls">
        <motion.button
          className={`control-btn ${isMicOn ? 'active' : 'inactive'}`}
          onClick={toggleMic}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isMicOn ? '🎤' : '🔇'}
          <span>{isMicOn ? 'Mute' : 'Unmute'}</span>
        </motion.button>

        {mode === 'video' && (
          <motion.button
            className={`control-btn ${isCameraOn ? 'active' : 'inactive'}`}
            onClick={toggleCamera}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isCameraOn ? '📹' : '📷'}
            <span>{isCameraOn ? 'Stop Video' : 'Start Video'}</span>
          </motion.button>
        )}

        <motion.button
          className={`control-btn ${isScreenSharing ? 'active' : ''}`}
          onClick={toggleScreenShare}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          🖥️
          <span>{isScreenSharing ? 'Stop Share' : 'Share Screen'}</span>
        </motion.button>

        <motion.button
          className="control-btn leave-btn"
          onClick={leaveChannel}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          📞
          <span>Leave</span>
        </motion.button>
      </div>

      {/* Connection Status */}
      {!isJoined && (
        <div className="connecting-overlay">
          <div className="spinner"></div>
          <p>Connecting to voice room...</p>
        </div>
      )}
    </motion.div>
  )
}

export default VideoChat
