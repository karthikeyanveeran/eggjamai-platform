import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import { SocketProvider } from './contexts/SocketContext'
import { CLERK_PUBLISHABLE_KEY } from './clerk-config'

if (!CLERK_PUBLISHABLE_KEY || CLERK_PUBLISHABLE_KEY.includes('REPLACE')) {
  console.warn('Missing Clerk Publishable Key. Please set VITE_CLERK_PUBLISHABLE_KEY in .env')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <ErrorBoundary>
        <AuthProvider>
          <ToastProvider>
            <SocketProvider>
              <App />
            </SocketProvider>
          </ToastProvider>
        </AuthProvider>
      </ErrorBoundary>
    </ClerkProvider>
  </StrictMode>,
)

