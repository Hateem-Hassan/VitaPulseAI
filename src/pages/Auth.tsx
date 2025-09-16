import React, { useState } from 'react'
import { LoginForm } from '../components/auth/LoginForm'
import { SignupForm } from '../components/auth/SignupForm'
import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'

type AuthMode = 'login' | 'signup'

export const Auth: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login')
  const { user, loading } = useAuth()

  // Redirect if already authenticated
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleAuthSuccess = () => {
    // Redirect will be handled by the auth context
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {mode === 'login' ? (
          <LoginForm
            onSuccess={handleAuthSuccess}
            onSwitchToSignup={() => setMode('signup')}
          />
        ) : (
          <SignupForm
            onSuccess={handleAuthSuccess}
            onSwitchToLogin={() => setMode('login')}
          />
        )}
      </div>
    </div>
  )
}

export default Auth