'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { toast } from 'sonner'

// Supported languages
export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', rtl: false },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', rtl: false },
  ar: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
  ja: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', rtl: false },
  zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳', rtl: false },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', rtl: false }
} as const

export type Language = keyof typeof SUPPORTED_LANGUAGES

// Translation keys structure
interface Translations {
  // Common
  common: {
    loading: string
    error: string
    success: string
    cancel: string
    save: string
    delete: string
    edit: string
    add: string
    remove: string
    search: string
    filter: string
    sort: string
    next: string
    previous: string
    submit: string
    reset: string
    close: string
    open: string
    yes: string
    no: string
    ok: string
    confirm: string
    back: string
    continue: string
    skip: string
    finish: string
  }
  
  // Navigation
  nav: {
    home: string
    dashboard: string
    profile: string
    settings: string
    logout: string
    login: string
    signup: string
    about: string
    contact: string
    help: string
    privacy: string
    terms: string
  }
  
  // Health specific
  health: {
    symptoms: string
    diagnosis: string
    treatment: string
    medication: string
    allergies: string
    conditions: string
    vitals: string
    weight: string
    height: string
    bmi: string
    bloodPressure: string
    heartRate: string
    temperature: string
    glucose: string
    cholesterol: string
    exercise: string
    nutrition: string
    sleep: string
    stress: string
    mood: string
    pain: string
    fatigue: string
    appetite: string
    hydration: string
    steps: string
    calories: string
    goals: string
    progress: string
    recommendations: string
    emergency: string
    doctor: string
    appointment: string
    prescription: string
    dosage: string
    frequency: string
    sideEffects: string
    contraindications: string
    warnings: string
  }
  
  // Cultural health terms
  cultural: {
    traditionalMedicine: string
    holisticHealth: string
    preventiveCare: string
    familyHistory: string
    geneticFactors: string
    lifestyle: string
    diet: string
    fasting: string
    prayer: string
    meditation: string
    yoga: string
    acupuncture: string
    herbalMedicine: string
    homeopathy: string
    ayurveda: string
    tcm: string // Traditional Chinese Medicine
    unani: string
    naturopathy: string
  }
  
  // AI features
  ai: {
    symptomChecker: string
    mealPlanner: string
    healthAssistant: string
    recommendations: string
    analysis: string
    prediction: string
    insights: string
    personalized: string
    aiPowered: string
    smartSuggestions: string
    intelligentAnalysis: string
    machineLearning: string
    dataScience: string
  }
  
  // Subscription
  subscription: {
    free: string
    premium: string
    professional: string
    upgrade: string
    downgrade: string
    billing: string
    payment: string
    invoice: string
    trial: string
    expired: string
    active: string
    cancelled: string
    features: string
    limitations: string
  }
  
  // Forms and validation
  forms: {
    required: string
    invalid: string
    tooShort: string
    tooLong: string
    invalidEmail: string
    invalidPhone: string
    passwordMismatch: string
    weakPassword: string
    strongPassword: string
    emailPlaceholder: string
    passwordPlaceholder: string
    namePlaceholder: string
    phonePlaceholder: string
    addressPlaceholder: string
    datePlaceholder: string
    timePlaceholder: string
  }
  
  // Messages
  messages: {
    welcome: string
    goodbye: string
    thankYou: string
    congratulations: string
    warning: string
    info: string
    tip: string
    reminder: string
    notification: string
    alert: string
    confirmation: string
    success: string
    error: string
    noData: string
    noResults: string
    tryAgain: string
    contactSupport: string
  }
}

// Default English translations
const defaultTranslations: Translations = {
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    remove: 'Remove',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    reset: 'Reset',
    close: 'Close',
    open: 'Open',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    confirm: 'Confirm',
    back: 'Back',
    continue: 'Continue',
    skip: 'Skip',
    finish: 'Finish'
  },
  nav: {
    home: 'Home',
    dashboard: 'Dashboard',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    login: 'Login',
    signup: 'Sign Up',
    about: 'About',
    contact: 'Contact',
    help: 'Help',
    privacy: 'Privacy',
    terms: 'Terms'
  },
  health: {
    symptoms: 'Symptoms',
    diagnosis: 'Diagnosis',
    treatment: 'Treatment',
    medication: 'Medication',
    allergies: 'Allergies',
    conditions: 'Conditions',
    vitals: 'Vitals',
    weight: 'Weight',
    height: 'Height',
    bmi: 'BMI',
    bloodPressure: 'Blood Pressure',
    heartRate: 'Heart Rate',
    temperature: 'Temperature',
    glucose: 'Glucose',
    cholesterol: 'Cholesterol',
    exercise: 'Exercise',
    nutrition: 'Nutrition',
    sleep: 'Sleep',
    stress: 'Stress',
    mood: 'Mood',
    pain: 'Pain',
    fatigue: 'Fatigue',
    appetite: 'Appetite',
    hydration: 'Hydration',
    steps: 'Steps',
    calories: 'Calories',
    goals: 'Goals',
    progress: 'Progress',
    recommendations: 'Recommendations',
    emergency: 'Emergency',
    doctor: 'Doctor',
    appointment: 'Appointment',
    prescription: 'Prescription',
    dosage: 'Dosage',
    frequency: 'Frequency',
    sideEffects: 'Side Effects',
    contraindications: 'Contraindications',
    warnings: 'Warnings'
  },
  cultural: {
    traditionalMedicine: 'Traditional Medicine',
    holisticHealth: 'Holistic Health',
    preventiveCare: 'Preventive Care',
    familyHistory: 'Family History',
    geneticFactors: 'Genetic Factors',
    lifestyle: 'Lifestyle',
    diet: 'Diet',
    fasting: 'Fasting',
    prayer: 'Prayer',
    meditation: 'Meditation',
    yoga: 'Yoga',
    acupuncture: 'Acupuncture',
    herbalMedicine: 'Herbal Medicine',
    homeopathy: 'Homeopathy',
    ayurveda: 'Ayurveda',
    tcm: 'Traditional Chinese Medicine',
    unani: 'Unani Medicine',
    naturopathy: 'Naturopathy'
  },
  ai: {
    symptomChecker: 'AI Symptom Checker',
    mealPlanner: 'AI Meal Planner',
    healthAssistant: 'Health Assistant',
    recommendations: 'AI Recommendations',
    analysis: 'AI Analysis',
    prediction: 'Health Prediction',
    insights: 'Health Insights',
    personalized: 'Personalized',
    aiPowered: 'AI-Powered',
    smartSuggestions: 'Smart Suggestions',
    intelligentAnalysis: 'Intelligent Analysis',
    machineLearning: 'Machine Learning',
    dataScience: 'Data Science'
  },
  subscription: {
    free: 'Free',
    premium: 'Premium',
    professional: 'Professional',
    upgrade: 'Upgrade',
    downgrade: 'Downgrade',
    billing: 'Billing',
    payment: 'Payment',
    invoice: 'Invoice',
    trial: 'Trial',
    expired: 'Expired',
    active: 'Active',
    cancelled: 'Cancelled',
    features: 'Features',
    limitations: 'Limitations'
  },
  forms: {
    required: 'This field is required',
    invalid: 'Invalid input',
    tooShort: 'Too short',
    tooLong: 'Too long',
    invalidEmail: 'Invalid email address',
    invalidPhone: 'Invalid phone number',
    passwordMismatch: 'Passwords do not match',
    weakPassword: 'Password is too weak',
    strongPassword: 'Strong password',
    emailPlaceholder: 'Enter your email',
    passwordPlaceholder: 'Enter your password',
    namePlaceholder: 'Enter your name',
    phonePlaceholder: 'Enter your phone number',
    addressPlaceholder: 'Enter your address',
    datePlaceholder: 'Select date',
    timePlaceholder: 'Select time'
  },
  messages: {
    welcome: 'Welcome to VitaPulse AI',
    goodbye: 'Goodbye',
    thankYou: 'Thank you',
    congratulations: 'Congratulations',
    warning: 'Warning',
    info: 'Information',
    tip: 'Tip',
    reminder: 'Reminder',
    notification: 'Notification',
    alert: 'Alert',
    confirmation: 'Confirmation',
    success: 'Operation completed successfully',
    error: 'An error occurred',
    noData: 'No data available',
    noResults: 'No results found',
    tryAgain: 'Please try again',
    contactSupport: 'Contact support if the problem persists'
  }
}

// I18n Context Type
interface I18nContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
  translations: Translations
  isRTL: boolean
  formatNumber: (value: number) => string
  formatCurrency: (value: number, currency?: string) => string
  formatDate: (date: Date | string) => string
  formatTime: (date: Date | string) => string
  formatDateTime: (date: Date | string) => string
  formatRelativeTime: (date: Date | string) => string
  loading: boolean
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

// Custom hook to use i18n context
export const useI18n = () => {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

// I18n Provider Component
interface I18nProviderProps {
  children: ReactNode
  defaultLanguage?: Language
  storageKey?: string
}

export const I18nProvider: React.FC<I18nProviderProps> = ({
  children,
  defaultLanguage = 'en',
  storageKey = 'vitapulse-language'
}) => {
  const [language, setLanguageState] = useState<Language>(defaultLanguage)
  const [translations, setTranslations] = useState<Translations>(defaultTranslations)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Initialize language from localStorage or browser preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem(storageKey) as Language
    const browserLanguage = navigator.language.split('-')[0] as Language
    
    let initialLanguage = defaultLanguage
    
    if (savedLanguage && Object.keys(SUPPORTED_LANGUAGES).includes(savedLanguage)) {
      initialLanguage = savedLanguage
    } else if (Object.keys(SUPPORTED_LANGUAGES).includes(browserLanguage)) {
      initialLanguage = browserLanguage
    }
    
    setLanguageState(initialLanguage)
    loadTranslations(initialLanguage)
    setMounted(true)
  }, [defaultLanguage, storageKey])

  // Apply RTL/LTR direction to document
  useEffect(() => {
    if (!mounted) return
    
    const isRTL = SUPPORTED_LANGUAGES[language].rtl
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = language
  }, [language, mounted])

  // Load translations for a specific language
  const loadTranslations = async (lang: Language) => {
    if (lang === 'en') {
      setTranslations(defaultTranslations)
      return
    }

    setLoading(true)
    try {
      // In a real app, you would load translations from files or API
      // For now, we'll use the default English translations
      // You can implement dynamic loading here
      const response = await import(`../locales/${lang}.json`).catch(() => null)
      
      if (response && response.default) {
        setTranslations(response.default)
      } else {
        // Fallback to English if translation file doesn't exist
        console.warn(`Translation file for ${lang} not found, using English`)
        setTranslations(defaultTranslations)
      }
    } catch (error) {
      console.error('Error loading translations:', error)
      setTranslations(defaultTranslations)
    } finally {
      setLoading(false)
    }
  }

  // Set language function
  const setLanguage = async (newLanguage: Language) => {
    try {
      setLanguageState(newLanguage)
      localStorage.setItem(storageKey, newLanguage)
      await loadTranslations(newLanguage)
      
      const languageName = SUPPORTED_LANGUAGES[newLanguage].nativeName
      toast.success(`Language changed to ${languageName}`)
    } catch (error) {
      console.error('Error setting language:', error)
      toast.error('Failed to change language')
    }
  }

  // Translation function with interpolation support
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.')
    let value: any = translations
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        console.warn(`Translation key '${key}' not found`)
        return key // Return the key if translation not found
      }
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation key '${key}' is not a string`)
      return key
    }
    
    // Simple interpolation
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match
      })
    }
    
    return value
  }

  // Formatting functions with locale support
  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat(language).format(value)
  }

  const formatCurrency = (value: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat(language, {
      style: 'currency',
      currency
    }).format(value)
  }

  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat(language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(dateObj)
  }

  const formatTime = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat(language, {
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj)
  }

  const formatDateTime = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat(language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj)
  }

  const formatRelativeTime = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
    
    const rtf = new Intl.RelativeTimeFormat(language, { numeric: 'auto' })
    
    if (diffInSeconds < 60) {
      return rtf.format(-diffInSeconds, 'second')
    } else if (diffInSeconds < 3600) {
      return rtf.format(-Math.floor(diffInSeconds / 60), 'minute')
    } else if (diffInSeconds < 86400) {
      return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour')
    } else if (diffInSeconds < 2592000) {
      return rtf.format(-Math.floor(diffInSeconds / 86400), 'day')
    } else if (diffInSeconds < 31536000) {
      return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month')
    } else {
      return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year')
    }
  }

  const isRTL = SUPPORTED_LANGUAGES[language].rtl

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

  const value: I18nContextType = {
    language,
    setLanguage,
    t,
    translations,
    isRTL,
    formatNumber,
    formatCurrency,
    formatDate,
    formatTime,
    formatDateTime,
    formatRelativeTime,
    loading
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

// Language selector component
interface LanguageSelectorProps {
  className?: string
  showFlag?: boolean
  showNativeName?: boolean
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = '',
  showFlag = true,
  showNativeName = true
}) => {
  const { language, setLanguage } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
        aria-label="Select language"
      >
        {showFlag && (
          <span className="text-lg">{SUPPORTED_LANGUAGES[language].flag}</span>
        )}
        <span className="text-sm font-medium">
          {showNativeName 
            ? SUPPORTED_LANGUAGES[language].nativeName 
            : SUPPORTED_LANGUAGES[language].name
          }
        </span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg z-50">
          <div className="p-1">
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, info]) => (
              <button
                key={code}
                onClick={() => {
                  setLanguage(code as Language)
                  setIsOpen(false)
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm
                  hover:bg-accent hover:text-accent-foreground
                  transition-colors text-left
                  ${language === code ? 'bg-accent text-accent-foreground' : ''}
                `}
              >
                <span className="text-lg">{info.flag}</span>
                <div className="flex flex-col">
                  <span className="font-medium">{info.nativeName}</span>
                  <span className="text-xs text-muted-foreground">{info.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}