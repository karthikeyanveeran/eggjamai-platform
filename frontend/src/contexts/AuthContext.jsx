/**
 * Authentication Context (Clerk Adapter)
 * Adapts Clerk's authentication to the EggJam context interface
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useClerk, useSession } from '@clerk/clerk-react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { session } = useSession();
  const { signOut, openSignIn, openSignUp } = useClerk();
  
  const [user, setUser] = useState(null);

  // Sync token to localStorage for existing API calls
  useEffect(() => {
    if (session) {
      session.getToken().then(token => {
        if (token) {
          localStorage.setItem('access_token', token);
        }
      });
    } else {
      localStorage.removeItem('access_token');
    }
  }, [session]);

  // Map Clerk user to EggJam user format
  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser) {
      setUser({
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress,
        full_name: clerkUser.fullName,
        firstName: clerkUser.firstName,
        imageUrl: clerkUser.imageUrl,
        // Role should be set in Clerk public metadata, defaulting to student if missing
        role: clerkUser.publicMetadata?.role || 'student',
        ...clerkUser.publicMetadata
      });
    } else {
      setUser(null);
    }
  }, [isLoaded, isSignedIn, clerkUser]);

  const login = async () => {
    openSignIn();
    return { success: true }; // Clerk handles the flow
  };

  const register = async () => {
    openSignUp();
    return { success: true };
  };

  const logout = async () => {
    await signOut();
    setUser(null);
  };

  const updateUser = async (data) => {
    // In a real Clerk app, you'd update metadata via backend API
    // or use user.update() for basic fields
    if (clerkUser) {
        // Optimistic update for local state
        setUser(prev => ({ ...prev, ...data }));
    }
  };

  const value = {
    user,
    loading: !isLoaded,
    error: null,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: isSignedIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
