export const appConfig = {
  appName: "VitaPulse",
  appDescription: "AI-Powered Health & Wellness Platform - Transform your health journey with personalized meal planning, nutrition tracking, and comprehensive wellness tools.",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  defaultLanguage: "en",
  supportedLanguages: ["en", "ur", "ar", "hi", "zh", "es", "fr", "pt", "ru", "de"],
  features: {
    aiMealPlanner: true,
    foodLogger: true,
    healthCalculators: true,
    wearableIntegration: true,
    gamification: true,
    multilingual: true,
    videoStreaming: false,
    analytics: true,
    community: true,
    mentalWellness: true,
  },
  ai: {
    providers: {
      deepseek: {
        name: "DeepSeek",
        enabled: true,
        priority: 1,
      },
      openai: {
        name: "OpenAI",
        enabled: true,
        priority: 2,
      },
      anthropic: {
        name: "Anthropic",
        enabled: true,
        priority: 3,
      },
    },
    defaultProvider: "deepseek",
    fallbackProvider: "openai",
  },
  health: {
    calculators: {
      general: [
        "bmi",
        "body-fat",
        "calories",
        "waist-hip-ratio",
        "water-intake",
        "ideal-weight",
        "metabolic-age",
        "pregnancy-weight",
        "child-bmi",
        "bone-density",
      ],
      medical: [
        "cardiovascular-risk",
        "diabetes-risk",
        "stroke-risk",
        "kidney-function",
        "liver-function",
        "thyroid-function",
        "cognitive-assessment",
        "depression-screening",
        "anxiety-assessment",
      ],
    },
  },
  mealPlanning: {
    cuisines: [
      "Any",
      "Pakistani",
      "Indian",
      "Chinese",
      "Thai",
      "Arabic",
      "Mediterranean",
      "Italian",
      "Japanese",
      "Mexican",
    ],
    dietaryRestrictions: [
      "None",
      "Vegetarian",
      "Vegan",
      "Gluten-Free",
      "Dairy-Free",
      "Nut-Free",
      "Halal",
      "Kosher",
      "Keto",
      "Paleo",
      "Low-Carb",
      "Low-Fat",
      "High-Protein",
    ],
    mealTypes: ["breakfast", "lunch", "dinner", "snack"],
  },
  wearable: {
    providers: [
      "apple-health",
      "google-fit",
      "fitbit",
      "garmin",
      "samsung-health",
      "polar",
      "withings",
    ],
  },
  gamification: {
    badges: [
      "first-meal",
      "week-streak",
      "month-streak",
      "goal-achieved",
      "community-helper",
      "health-expert",
      "meal-planner-pro",
      "fitness-champion",
    ],
    challenges: [
      "7-day-streak",
      "monthly-goal",
      "community-challenge",
      "seasonal-challenge",
    ],
  },
  social: {
    platforms: ["google", "github", "facebook", "apple"],
  },
  storage: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  },
  limits: {
    free: {
      mealPlans: 5,
      aiRequests: 100,
      storage: 100 * 1024 * 1024, // 100MB
    },
    premium: {
      mealPlans: -1, // unlimited
      aiRequests: 1000,
      storage: 1024 * 1024 * 1024, // 1GB
    },
    pro: {
      mealPlans: -1, // unlimited
      aiRequests: -1, // unlimited
      storage: 10 * 1024 * 1024 * 1024, // 10GB
    },
  },
  pricing: {
    free: {
      price: 0,
      features: [
        "Basic meal logging",
        "Simple health calculators",
        "Basic AI recommendations",
        "Community access",
        "Mobile app access",
        "Email support",
      ],
    },
    premium: {
      price: 9.99,
      features: [
        "Unlimited AI meal plans",
        "Advanced health calculators",
        "Wearable device integration",
        "Detailed analytics & insights",
        "Priority AI recommendations",
        "Recipe generation",
        "Shopping list creation",
        "Progress tracking",
        "Priority support",
        "Export data",
      ],
    },
    pro: {
      price: 19.99,
      features: [
        "Everything in Premium",
        "Advanced AI models (GPT-4, Claude)",
        "Custom health calculators",
        "API access",
        "White-label options",
        "Advanced analytics dashboard",
        "Team collaboration",
        "Custom integrations",
        "Dedicated support",
        "Advanced security features",
      ],
    },
  },
  contact: {
    email: "hello@vitapulse.fit",
    phone: "+1 (555) 123-4567",
    address: "San Francisco, CA",
    social: {
      twitter: "https://twitter.com/vitapulse",
      github: "https://github.com/vitapulse",
      linkedin: "https://linkedin.com/company/vitapulse",
      instagram: "https://instagram.com/vitapulse",
    },
  },
  legal: {
    privacyPolicy: "/privacy",
    termsOfService: "/terms",
    cookiePolicy: "/cookies",
    gdpr: "/gdpr",
  },
};