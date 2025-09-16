// Internationalization (i18n) System
// Multi-language support for 8 languages with RTL support
// Cultural sensitivity and localized medical terminology

import { createContext, useContext } from 'react';

// Supported languages
export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', nativeName: 'English', rtl: false, flag: '🇺🇸' },
  es: { name: 'Spanish', nativeName: 'Español', rtl: false, flag: '🇪🇸' },
  fr: { name: 'French', nativeName: 'Français', rtl: false, flag: '🇫🇷' },
  de: { name: 'German', nativeName: 'Deutsch', rtl: false, flag: '🇩🇪' },
  ar: { name: 'Arabic', nativeName: 'العربية', rtl: true, flag: '🇸🇦' },
  ja: { name: 'Japanese', nativeName: '日本語', rtl: false, flag: '🇯🇵' },
  zh: { name: 'Chinese', nativeName: '中文', rtl: false, flag: '🇨🇳' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', rtl: false, flag: '🇮🇳' }
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

// Translation interface
interface Translations {
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    add: string;
    remove: string;
    search: string;
    filter: string;
    sort: string;
    next: string;
    previous: string;
    submit: string;
    reset: string;
    close: string;
    open: string;
    yes: string;
    no: string;
    ok: string;
    back: string;
    continue: string;
    finish: string;
    start: string;
    stop: string;
    pause: string;
    resume: string;
    retry: string;
    refresh: string;
    update: string;
    upload: string;
    download: string;
    share: string;
    copy: string;
    paste: string;
    cut: string;
    select: string;
    selectAll: string;
    clear: string;
    clearAll: string;
    today: string;
    yesterday: string;
    tomorrow: string;
    thisWeek: string;
    thisMonth: string;
    thisYear: string;
    daily: string;
    weekly: string;
    monthly: string;
    yearly: string;
  };

  // Navigation
  navigation: {
    dashboard: string;
    healthTools: string;
    symptomChecker: string;
    mealPlanner: string;
    calculators: string;
    foodLogger: string;
    education: string;
    profile: string;
    settings: string;
    help: string;
    about: string;
    contact: string;
    privacy: string;
    terms: string;
    logout: string;
    login: string;
    signup: string;
  };

  // Authentication
  auth: {
    signIn: string;
    signUp: string;
    signOut: string;
    forgotPassword: string;
    resetPassword: string;
    changePassword: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    fullName: string;
    dateOfBirth: string;
    gender: string;
    phoneNumber: string;
    address: string;
    city: string;
    country: string;
    zipCode: string;
    createAccount: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    signInWithGoogle: string;
    signInWithApple: string;
    signInWithEmail: string;
    rememberMe: string;
    termsAndConditions: string;
    privacyPolicy: string;
    agreeToTerms: string;
    emailSent: string;
    checkEmail: string;
    invalidCredentials: string;
    accountCreated: string;
    welcomeBack: string;
    passwordResetSent: string;
    passwordChanged: string;
    accountVerified: string;
    verificationSent: string;
    resendVerification: string;
  };

  // Health
  health: {
    // General
    health: string;
    wellness: string;
    fitness: string;
    nutrition: string;
    medical: string;
    symptoms: string;
    diagnosis: string;
    treatment: string;
    medication: string;
    allergy: string;
    condition: string;
    history: string;
    records: string;
    reports: string;
    appointments: string;
    doctors: string;
    hospitals: string;
    emergency: string;
    urgent: string;
    routine: string;
    
    // Vital Signs
    vitalSigns: string;
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    weight: string;
    height: string;
    bmi: string;
    bodyFat: string;
    muscleMass: string;
    boneDensity: string;
    hydration: string;
    oxygenSaturation: string;
    respiratoryRate: string;
    
    // Symptoms
    fever: string;
    headache: string;
    nausea: string;
    vomiting: string;
    diarrhea: string;
    constipation: string;
    fatigue: string;
    dizziness: string;
    chestPain: string;
    shortnessOfBreath: string;
    cough: string;
    soreThroat: string;
    runnyNose: string;
    congestion: string;
    bodyAches: string;
    jointPain: string;
    musclePain: string;
    backPain: string;
    abdominalPain: string;
    skinRash: string;
    itching: string;
    swelling: string;
    bruising: string;
    bleeding: string;
    
    // Risk Levels
    riskLevel: string;
    lowRisk: string;
    moderateRisk: string;
    highRisk: string;
    emergencyRisk: string;
    
    // Recommendations
    recommendations: string;
    immediateActions: string;
    followUpCare: string;
    lifestyleChanges: string;
    whenToSeekCare: string;
    emergencyWarning: string;
    
    // Cultural Health
    culturalConsiderations: string;
    traditionalMedicine: string;
    religiousConsiderations: string;
    dietaryRestrictions: string;
    culturalPractices: string;
    languagePreferences: string;
    familyInvolvement: string;
    communitySupport: string;
  };

  // Nutrition
  nutrition: {
    calories: string;
    protein: string;
    carbohydrates: string;
    fat: string;
    fiber: string;
    sugar: string;
    sodium: string;
    cholesterol: string;
    vitamins: string;
    minerals: string;
    water: string;
    caffeine: string;
    alcohol: string;
    
    // Meals
    breakfast: string;
    lunch: string;
    dinner: string;
    snack: string;
    meal: string;
    recipe: string;
    ingredient: string;
    serving: string;
    portion: string;
    
    // Dietary
    vegetarian: string;
    vegan: string;
    halal: string;
    kosher: string;
    glutenFree: string;
    dairyFree: string;
    nutFree: string;
    lowSodium: string;
    lowSugar: string;
    lowFat: string;
    highProtein: string;
    organic: string;
    
    // Cultural Foods
    traditionalFoods: string;
    regionalCuisine: string;
    seasonalFoods: string;
    festivalFoods: string;
    comfortFoods: string;
    streetFoods: string;
    homeCooking: string;
    restaurantFood: string;
  };

  // Medical Terms
  medical: {
    // Body Systems
    cardiovascular: string;
    respiratory: string;
    digestive: string;
    nervous: string;
    musculoskeletal: string;
    endocrine: string;
    immune: string;
    reproductive: string;
    urinary: string;
    integumentary: string;
    
    // Conditions
    diabetes: string;
    hypertension: string;
    heartDisease: string;
    stroke: string;
    cancer: string;
    arthritis: string;
    asthma: string;
    depression: string;
    anxiety: string;
    obesity: string;
    osteoporosis: string;
    alzheimers: string;
    parkinsons: string;
    
    // Procedures
    examination: string;
    bloodTest: string;
    xray: string;
    mri: string;
    ctScan: string;
    ultrasound: string;
    biopsy: string;
    surgery: string;
    therapy: string;
    rehabilitation: string;
    
    // Specialists
    cardiologist: string;
    neurologist: string;
    oncologist: string;
    psychiatrist: string;
    dermatologist: string;
    orthopedist: string;
    gynecologist: string;
    pediatrician: string;
    geriatrician: string;
    familyDoctor: string;
  };

  // Cultural Sensitivity
  cultural: {
    respectfulCare: string;
    culturalCompetence: string;
    languageServices: string;
    interpreterServices: string;
    culturalLiaison: string;
    religiousAccommodation: string;
    familyInvolvement: string;
    genderPreferences: string;
    modestyConcerns: string;
    prayerTimes: string;
    fastingConsiderations: string;
    traditionalHealing: string;
    complementaryMedicine: string;
    holisticApproach: string;
    communityResources: string;
    culturalEvents: string;
    holidayConsiderations: string;
    seasonalPractices: string;
  };

  // Errors and Validation
  errors: {
    required: string;
    invalid: string;
    tooShort: string;
    tooLong: string;
    invalidEmail: string;
    invalidPhone: string;
    passwordMismatch: string;
    weakPassword: string;
    networkError: string;
    serverError: string;
    notFound: string;
    unauthorized: string;
    forbidden: string;
    timeout: string;
    unknownError: string;
  };

  // Success Messages
  success: {
    saved: string;
    updated: string;
    deleted: string;
    created: string;
    sent: string;
    uploaded: string;
    downloaded: string;
    shared: string;
    copied: string;
    completed: string;
  };
}

// English translations (base language)
const enTranslations: Translations = {
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
    back: 'Back',
    continue: 'Continue',
    finish: 'Finish',
    start: 'Start',
    stop: 'Stop',
    pause: 'Pause',
    resume: 'Resume',
    retry: 'Retry',
    refresh: 'Refresh',
    update: 'Update',
    upload: 'Upload',
    download: 'Download',
    share: 'Share',
    copy: 'Copy',
    paste: 'Paste',
    cut: 'Cut',
    select: 'Select',
    selectAll: 'Select All',
    clear: 'Clear',
    clearAll: 'Clear All',
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    thisYear: 'This Year',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly'
  },
  navigation: {
    dashboard: 'Dashboard',
    healthTools: 'Health Tools',
    symptomChecker: 'Symptom Checker',
    mealPlanner: 'Meal Planner',
    calculators: 'Calculators',
    foodLogger: 'Food Logger',
    education: 'Education',
    profile: 'Profile',
    settings: 'Settings',
    help: 'Help',
    about: 'About',
    contact: 'Contact',
    privacy: 'Privacy',
    terms: 'Terms',
    logout: 'Logout',
    login: 'Login',
    signup: 'Sign Up'
  },
  auth: {
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    forgotPassword: 'Forgot Password',
    resetPassword: 'Reset Password',
    changePassword: 'Change Password',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    fullName: 'Full Name',
    dateOfBirth: 'Date of Birth',
    gender: 'Gender',
    phoneNumber: 'Phone Number',
    address: 'Address',
    city: 'City',
    country: 'Country',
    zipCode: 'ZIP Code',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    signInWithGoogle: 'Sign in with Google',
    signInWithApple: 'Sign in with Apple',
    signInWithEmail: 'Sign in with Email',
    rememberMe: 'Remember Me',
    termsAndConditions: 'Terms and Conditions',
    privacyPolicy: 'Privacy Policy',
    agreeToTerms: 'I agree to the Terms and Conditions',
    emailSent: 'Email Sent',
    checkEmail: 'Please check your email',
    invalidCredentials: 'Invalid credentials',
    accountCreated: 'Account created successfully',
    welcomeBack: 'Welcome back!',
    passwordResetSent: 'Password reset email sent',
    passwordChanged: 'Password changed successfully',
    accountVerified: 'Account verified successfully',
    verificationSent: 'Verification email sent',
    resendVerification: 'Resend verification email'
  },
  health: {
    health: 'Health',
    wellness: 'Wellness',
    fitness: 'Fitness',
    nutrition: 'Nutrition',
    medical: 'Medical',
    symptoms: 'Symptoms',
    diagnosis: 'Diagnosis',
    treatment: 'Treatment',
    medication: 'Medication',
    allergy: 'Allergy',
    condition: 'Condition',
    history: 'History',
    records: 'Records',
    reports: 'Reports',
    appointments: 'Appointments',
    doctors: 'Doctors',
    hospitals: 'Hospitals',
    emergency: 'Emergency',
    urgent: 'Urgent',
    routine: 'Routine',
    vitalSigns: 'Vital Signs',
    bloodPressure: 'Blood Pressure',
    heartRate: 'Heart Rate',
    temperature: 'Temperature',
    weight: 'Weight',
    height: 'Height',
    bmi: 'BMI',
    bodyFat: 'Body Fat',
    muscleMass: 'Muscle Mass',
    boneDensity: 'Bone Density',
    hydration: 'Hydration',
    oxygenSaturation: 'Oxygen Saturation',
    respiratoryRate: 'Respiratory Rate',
    fever: 'Fever',
    headache: 'Headache',
    nausea: 'Nausea',
    vomiting: 'Vomiting',
    diarrhea: 'Diarrhea',
    constipation: 'Constipation',
    fatigue: 'Fatigue',
    dizziness: 'Dizziness',
    chestPain: 'Chest Pain',
    shortnessOfBreath: 'Shortness of Breath',
    cough: 'Cough',
    soreThroat: 'Sore Throat',
    runnyNose: 'Runny Nose',
    congestion: 'Congestion',
    bodyAches: 'Body Aches',
    jointPain: 'Joint Pain',
    musclePain: 'Muscle Pain',
    backPain: 'Back Pain',
    abdominalPain: 'Abdominal Pain',
    skinRash: 'Skin Rash',
    itching: 'Itching',
    swelling: 'Swelling',
    bruising: 'Bruising',
    bleeding: 'Bleeding',
    riskLevel: 'Risk Level',
    lowRisk: 'Low Risk',
    moderateRisk: 'Moderate Risk',
    highRisk: 'High Risk',
    emergencyRisk: 'Emergency Risk',
    recommendations: 'Recommendations',
    immediateActions: 'Immediate Actions',
    followUpCare: 'Follow-up Care',
    lifestyleChanges: 'Lifestyle Changes',
    whenToSeekCare: 'When to Seek Care',
    emergencyWarning: 'Emergency Warning',
    culturalConsiderations: 'Cultural Considerations',
    traditionalMedicine: 'Traditional Medicine',
    religiousConsiderations: 'Religious Considerations',
    dietaryRestrictions: 'Dietary Restrictions',
    culturalPractices: 'Cultural Practices',
    languagePreferences: 'Language Preferences',
    familyInvolvement: 'Family Involvement',
    communitySupport: 'Community Support'
  },
  nutrition: {
    calories: 'Calories',
    protein: 'Protein',
    carbohydrates: 'Carbohydrates',
    fat: 'Fat',
    fiber: 'Fiber',
    sugar: 'Sugar',
    sodium: 'Sodium',
    cholesterol: 'Cholesterol',
    vitamins: 'Vitamins',
    minerals: 'Minerals',
    water: 'Water',
    caffeine: 'Caffeine',
    alcohol: 'Alcohol',
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snack',
    meal: 'Meal',
    recipe: 'Recipe',
    ingredient: 'Ingredient',
    serving: 'Serving',
    portion: 'Portion',
    vegetarian: 'Vegetarian',
    vegan: 'Vegan',
    halal: 'Halal',
    kosher: 'Kosher',
    glutenFree: 'Gluten-Free',
    dairyFree: 'Dairy-Free',
    nutFree: 'Nut-Free',
    lowSodium: 'Low Sodium',
    lowSugar: 'Low Sugar',
    lowFat: 'Low Fat',
    highProtein: 'High Protein',
    organic: 'Organic',
    traditionalFoods: 'Traditional Foods',
    regionalCuisine: 'Regional Cuisine',
    seasonalFoods: 'Seasonal Foods',
    festivalFoods: 'Festival Foods',
    comfortFoods: 'Comfort Foods',
    streetFoods: 'Street Foods',
    homeCooking: 'Home Cooking',
    restaurantFood: 'Restaurant Food'
  },
  medical: {
    cardiovascular: 'Cardiovascular',
    respiratory: 'Respiratory',
    digestive: 'Digestive',
    nervous: 'Nervous',
    musculoskeletal: 'Musculoskeletal',
    endocrine: 'Endocrine',
    immune: 'Immune',
    reproductive: 'Reproductive',
    urinary: 'Urinary',
    integumentary: 'Integumentary',
    diabetes: 'Diabetes',
    hypertension: 'Hypertension',
    heartDisease: 'Heart Disease',
    stroke: 'Stroke',
    cancer: 'Cancer',
    arthritis: 'Arthritis',
    asthma: 'Asthma',
    depression: 'Depression',
    anxiety: 'Anxiety',
    obesity: 'Obesity',
    osteoporosis: 'Osteoporosis',
    alzheimers: "Alzheimer's",
    parkinsons: "Parkinson's",
    examination: 'Examination',
    bloodTest: 'Blood Test',
    xray: 'X-Ray',
    mri: 'MRI',
    ctScan: 'CT Scan',
    ultrasound: 'Ultrasound',
    biopsy: 'Biopsy',
    surgery: 'Surgery',
    therapy: 'Therapy',
    rehabilitation: 'Rehabilitation',
    cardiologist: 'Cardiologist',
    neurologist: 'Neurologist',
    oncologist: 'Oncologist',
    psychiatrist: 'Psychiatrist',
    dermatologist: 'Dermatologist',
    orthopedist: 'Orthopedist',
    gynecologist: 'Gynecologist',
    pediatrician: 'Pediatrician',
    geriatrician: 'Geriatrician',
    familyDoctor: 'Family Doctor'
  },
  cultural: {
    respectfulCare: 'Respectful Care',
    culturalCompetence: 'Cultural Competence',
    languageServices: 'Language Services',
    interpreterServices: 'Interpreter Services',
    culturalLiaison: 'Cultural Liaison',
    religiousAccommodation: 'Religious Accommodation',
    familyInvolvement: 'Family Involvement',
    genderPreferences: 'Gender Preferences',
    modestyConcerns: 'Modesty Concerns',
    prayerTimes: 'Prayer Times',
    fastingConsiderations: 'Fasting Considerations',
    traditionalHealing: 'Traditional Healing',
    complementaryMedicine: 'Complementary Medicine',
    holisticApproach: 'Holistic Approach',
    communityResources: 'Community Resources',
    culturalEvents: 'Cultural Events',
    holidayConsiderations: 'Holiday Considerations',
    seasonalPractices: 'Seasonal Practices'
  },
  errors: {
    required: 'This field is required',
    invalid: 'Invalid input',
    tooShort: 'Too short',
    tooLong: 'Too long',
    invalidEmail: 'Invalid email address',
    invalidPhone: 'Invalid phone number',
    passwordMismatch: 'Passwords do not match',
    weakPassword: 'Password is too weak',
    networkError: 'Network error',
    serverError: 'Server error',
    notFound: 'Not found',
    unauthorized: 'Unauthorized',
    forbidden: 'Forbidden',
    timeout: 'Request timeout',
    unknownError: 'Unknown error'
  },
  success: {
    saved: 'Saved successfully',
    updated: 'Updated successfully',
    deleted: 'Deleted successfully',
    created: 'Created successfully',
    sent: 'Sent successfully',
    uploaded: 'Uploaded successfully',
    downloaded: 'Downloaded successfully',
    shared: 'Shared successfully',
    copied: 'Copied successfully',
    completed: 'Completed successfully'
  }
};

// Translation storage
const translations: Record<SupportedLanguage, Translations> = {
  en: enTranslations,
  // Other languages would be loaded dynamically or from separate files
  es: enTranslations, // Placeholder - would be Spanish translations
  fr: enTranslations, // Placeholder - would be French translations
  de: enTranslations, // Placeholder - would be German translations
  ar: enTranslations, // Placeholder - would be Arabic translations
  ja: enTranslations, // Placeholder - would be Japanese translations
  zh: enTranslations, // Placeholder - would be Chinese translations
  hi: enTranslations  // Placeholder - would be Hindi translations
};

// I18n Context
interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
  isRTL: boolean;
  formatNumber: (num: number) => string;
  formatDate: (date: Date) => string;
  formatCurrency: (amount: number, currency?: string) => string;
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Translation function
export const getTranslation = (language: SupportedLanguage, key: string): string => {
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English if translation not found
      value = translations.en;
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return key; // Return key if no translation found
        }
      }
      break;
    }
  }
  
  return typeof value === 'string' ? value : key;
};

// Hook for using translations
export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};

// Utility functions
export const isRTLLanguage = (language: SupportedLanguage): boolean => {
  return SUPPORTED_LANGUAGES[language].rtl;
};

export const getLanguageDirection = (language: SupportedLanguage): 'ltr' | 'rtl' => {
  return isRTLLanguage(language) ? 'rtl' : 'ltr';
};

export const formatNumberForLanguage = (num: number, language: SupportedLanguage): string => {
  const locale = getLocaleFromLanguage(language);
  return new Intl.NumberFormat(locale).format(num);
};

export const formatDateForLanguage = (date: Date, language: SupportedLanguage): string => {
  const locale = getLocaleFromLanguage(language);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const formatCurrencyForLanguage = (
  amount: number,
  language: SupportedLanguage,
  currency: string = 'USD'
): string => {
  const locale = getLocaleFromLanguage(language);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount);
};

const getLocaleFromLanguage = (language: SupportedLanguage): string => {
  const localeMap: Record<SupportedLanguage, string> = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    ar: 'ar-SA',
    ja: 'ja-JP',
    zh: 'zh-CN',
    hi: 'hi-IN'
  };
  return localeMap[language];
};

// Medical terminology translations
export const getMedicalTermTranslation = (
  term: string,
  language: SupportedLanguage
): string => {
  // This would contain specialized medical terminology translations
  // For now, using the general translation system
  return getTranslation(language, `medical.${term}`) || term;
};

// Cultural health advice translations
export const getCulturalHealthAdvice = (
  advice: string,
  language: SupportedLanguage,
  culturalContext?: string
): string => {
  // This would provide culturally-adapted health advice
  // For now, returning the base translation
  return getTranslation(language, advice) || advice;
};

// Language detection
export const detectUserLanguage = (): SupportedLanguage => {
  // Check localStorage first
  const stored = localStorage.getItem('vitapulse-language') as SupportedLanguage;
  if (stored && stored in SUPPORTED_LANGUAGES) {
    return stored;
  }
  
  // Check browser language
  const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
  if (browserLang in SUPPORTED_LANGUAGES) {
    return browserLang;
  }
  
  // Default to English
  return 'en';
};

// Save language preference
export const saveLanguagePreference = (language: SupportedLanguage): void => {
  localStorage.setItem('vitapulse-language', language);
};

// Load translations dynamically (for code splitting)
export const loadTranslations = async (language: SupportedLanguage): Promise<Translations> => {
  try {
    // In a real implementation, this would load from separate files
    // const translations = await import(`./translations/${language}.json`);
    // return translations.default;
    
    // For now, return the placeholder
    return translations[language];
  } catch (error) {
    console.warn(`Failed to load translations for ${language}, falling back to English`);
    return translations.en;
  }
};

// Pluralization helper
export const pluralize = (
  count: number,
  singular: string,
  plural?: string,
  language: SupportedLanguage = 'en'
): string => {
  const pluralForm = plural || `${singular}s`;
  
  // Simple English pluralization - would need more complex rules for other languages
  if (language === 'en') {
    return count === 1 ? singular : pluralForm;
  }
  
  // For other languages, would need proper pluralization rules
  return count === 1 ? singular : pluralForm;
};

// Text direction utilities
export const getTextAlign = (language: SupportedLanguage): 'left' | 'right' => {
  return isRTLLanguage(language) ? 'right' : 'left';
};

export const getFlexDirection = (language: SupportedLanguage): 'row' | 'row-reverse' => {
  return isRTLLanguage(language) ? 'row-reverse' : 'row';
};

// Cultural date formatting
export const formatCulturalDate = (
  date: Date,
  language: SupportedLanguage,
  culturalContext?: string
): string => {
  const locale = getLocaleFromLanguage(language);
  
  // Different cultures may prefer different date formats
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  // Add cultural-specific formatting if needed
  if (culturalContext === 'islamic') {
    // Could add Hijri calendar support
  }
  
  return new Intl.DateTimeFormat(locale, options).format(date);
};

// Export types
export type { Translations, I18nContextType };

// Export default translations for reference
export { enTranslations };