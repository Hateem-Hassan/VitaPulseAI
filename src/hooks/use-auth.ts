'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'
import toast from 'react-hot-toast'

export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  isAuthenticated: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAuthenticated: false
  })

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
          toast.error('Authentication error')
        }
        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
          isAuthenticated: !!session?.user
        })
      } catch (error) {
        console.error('Session error:', error)
        setAuthState(prev => ({ ...prev, loading: false }))
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
          isAuthenticated: !!session?.user
        })

        if (event === 'SIGNED_IN') {
          toast.success('Successfully signed in!')
        } else if (event === 'SIGNED_OUT') {
          toast.success('Successfully signed out!')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        console.error('Google sign-in error:', error)
        toast.error(`Sign-in failed: ${error.message}`)
        return false
      }
      
      return true
    } catch (error) {
      console.error('Google sign-in error:', error)
      toast.error('Failed to sign in with Google')
      return false
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('Email sign-in error:', error)
        toast.error(`Sign-in failed: ${error.message}`)
        return false
      }
      
      return true
    } catch (error) {
      console.error('Email sign-in error:', error)
      toast.error('Failed to sign in')
      return false
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })
      
      if (error) {
        console.error('Sign-up error:', error)
        toast.error(`Sign-up failed: ${error.message}`)
        return false
      }
      
      toast.success('Check your email for verification link!')
      return true
    } catch (error) {
      console.error('Sign-up error:', error)
      toast.error('Failed to sign up')
      return false
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Sign-out error:', error)
        toast.error('Failed to sign out')
        return false
      }
      
      return true
    } catch (error) {
      console.error('Sign-out error:', error)
      toast.error('Failed to sign out')
      return false
    }
  }

  return {
    ...authState,
    signInWithGoogle,
    signInWithEmail,
    signUp,
    signOut
  }
}