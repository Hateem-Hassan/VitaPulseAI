'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { toast } from 'sonner'

// Types
type Theme = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  systemTheme: ResolvedTheme
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Theme Provider Component
interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'system',
  storageKey = 'vitapulse-theme',
  enableSystem = true,
  disableTransitionOnChange = false
}) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>('light')
  const [mounted, setMounted] = useState(false)

  // Get resolved theme (actual theme being used)
  const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme as ResolvedTheme

  // Initialize theme from localStorage and system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as Theme
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    
    setSystemTheme(systemPreference)
    
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setThemeState(savedTheme)
    } else {
      setThemeState(defaultTheme)
    }
    
    setMounted(true)
  }, [defaultTheme, storageKey])

  // Listen for system theme changes
  useEffect(() => {
    if (!enableSystem) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? 'dark' : 'light'
      setSystemTheme(newSystemTheme)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [enableSystem])

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement
    const body = document.body

    // Disable transitions temporarily if requested
    if (disableTransitionOnChange) {
      const css = document.createElement('style')
      css.appendChild(
        document.createTextNode(
          `*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`
        )
      )
      document.head.appendChild(css)

      // Force reflow
      (() => window.getComputedStyle(body).opacity)()

      // Remove the style after a brief delay
      setTimeout(() => {
        document.head.removeChild(css)
      }, 1)
    }

    // Remove existing theme classes
    root.classList.remove('light', 'dark')
    body.classList.remove('light', 'dark')

    // Add new theme class
    root.classList.add(resolvedTheme)
    body.classList.add(resolvedTheme)

    // Set theme-color meta tag for mobile browsers
    const themeColorMeta = document.querySelector('meta[name="theme-color"]')
    if (themeColorMeta) {
      themeColorMeta.setAttribute(
        'content',
        resolvedTheme === 'dark' ? '#0f172a' : '#ffffff'
      )
    } else {
      const meta = document.createElement('meta')
      meta.name = 'theme-color'
      meta.content = resolvedTheme === 'dark' ? '#0f172a' : '#ffffff'
      document.head.appendChild(meta)
    }

    // Set color-scheme CSS property
    root.style.colorScheme = resolvedTheme

    // Update favicon based on theme (if you have different favicons)
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
    if (favicon) {
      const faviconPath = resolvedTheme === 'dark' 
        ? '/favicon-dark.ico' 
        : '/favicon.ico'
      
      // Only update if the favicon files exist
      const img = new Image()
      img.onload = () => {
        favicon.href = faviconPath
      }
      img.src = faviconPath
    }
  }, [resolvedTheme, mounted, disableTransitionOnChange])

  // Set theme function
  const setTheme = (newTheme: Theme) => {
    try {
      setThemeState(newTheme)
      localStorage.setItem(storageKey, newTheme)
      
      // Show toast notification
      const themeNames = {
        light: 'Light mode',
        dark: 'Dark mode',
        system: 'System preference'
      }
      
      toast.success(`Switched to ${themeNames[newTheme]}`)
    } catch (error) {
      console.error('Error setting theme:', error)
      toast.error('Failed to change theme')
    }
  }

  // Toggle between light and dark (ignores system)
  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-muted rounded mb-4"></div>
          <div className="h-4 w-48 bg-muted rounded mb-2"></div>
          <div className="h-4 w-40 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    systemTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// Theme toggle button component
interface ThemeToggleProps {
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  showLabel = false,
  size = 'md'
}) => {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  }

  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
        className={`
          ${sizeClasses[size]}
          rounded-lg border border-border bg-background
          hover:bg-accent hover:text-accent-foreground
          focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
          transition-colors duration-200
          flex items-center justify-center
        `}
        aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
      >
        {resolvedTheme === 'light' ? (
          <svg
            className={iconSizeClasses[size]}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        ) : (
          <svg
            className={iconSizeClasses[size]}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        )}
      </button>
      
      {showLabel && (
        <span className="text-sm font-medium text-foreground">
          {resolvedTheme === 'light' ? 'Light' : 'Dark'} mode
        </span>
      )}
    </div>
  )
}

// Theme selector component with all options
interface ThemeSelectorProps {
  className?: string
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ className = '' }) => {
  const { theme, setTheme } = useTheme()

  const themes = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'system', label: 'System', icon: '💻' }
  ] as const

  return (
    <div className={`flex items-center gap-1 p-1 bg-muted rounded-lg ${className}`}>
      {themes.map((themeOption) => (
        <button
          key={themeOption.value}
          onClick={() => setTheme(themeOption.value)}
          className={`
            px-3 py-2 rounded-md text-sm font-medium transition-colors
            flex items-center gap-2 min-w-0 flex-1
            ${theme === themeOption.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            }
          `}
          aria-label={`Switch to ${themeOption.label} theme`}
        >
          <span className="text-base">{themeOption.icon}</span>
          <span className="truncate">{themeOption.label}</span>
        </button>
      ))}
    </div>
  )
}

// Hook for theme-aware animations
export const useThemeTransition = () => {
  const { resolvedTheme } = useTheme()
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => setIsTransitioning(false), 150)
    return () => clearTimeout(timer)
  }, [resolvedTheme])

  return { isTransitioning, resolvedTheme }
}

// Hook for theme-aware colors
export const useThemeColors = () => {
  const { resolvedTheme } = useTheme()

  const colors = {
    light: {
      primary: '#0ea5e9',
      secondary: '#64748b',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      background: '#ffffff',
      foreground: '#0f172a',
      muted: '#f1f5f9',
      border: '#e2e8f0'
    },
    dark: {
      primary: '#38bdf8',
      secondary: '#94a3b8',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      background: '#0f172a',
      foreground: '#f8fafc',
      muted: '#1e293b',
      border: '#334155'
    }
  }

  return colors[resolvedTheme]
}