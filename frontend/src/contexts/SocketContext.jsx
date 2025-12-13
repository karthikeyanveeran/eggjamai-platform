import { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext()

export function useSocket() {
  return useContext(SocketContext)
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    // Only connect if user is authenticated
    if (!user) {
      if (socket) {
        socket.disconnect()
        setSocket(null)
        setIsConnected(false)
      }
      return
    }

    // Connect to backend
    // Since we use Vite proxy in dev, or relative path in prod, 
    // we can often use just "/" or the API URL base.
    // Ensure this matches your backend URL.
    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    const newSocket = io(socketUrl, {
      path: '/socket.io/', // Standard socket.io path
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id)
      setIsConnected(true)
      
      // Authenticate with socket
      newSocket.emit('authenticate', { user_id: user.id })
    })

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected')
      setIsConnected(false)
    })

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err)
      setIsConnected(false)
    })

    // Universal message listener for debugging
    newSocket.onAny((params) => {
      // console.log('Socket event:', params) 
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [user]) // Re-connect if user changes

  const value = {
    socket,
    isConnected,
    lastMessage
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}
