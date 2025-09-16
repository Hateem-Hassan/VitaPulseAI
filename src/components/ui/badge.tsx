import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Health-specific variants
        healthy:
          "border-transparent bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100",
        warning:
          "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100",
        danger:
          "border-transparent bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-100",
        info:
          "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100",
        // BMI categories
        underweight:
          "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100",
        normal:
          "border-transparent bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100",
        overweight:
          "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100",
        obese:
          "border-transparent bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-100",
        // Subscription tiers
        free:
          "border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100",
        premium:
          "border-transparent bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-100",
        professional:
          "border-transparent bg-gold-100 text-gold-800 hover:bg-gold-200 dark:bg-gold-900 dark:text-gold-100",
        // Activity levels
        sedentary:
          "border-transparent bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-100",
        light:
          "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100",
        moderate:
          "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100",
        active:
          "border-transparent bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100",
        "very-active":
          "border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-100",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
        xl: "px-4 py-1.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

// Health-specific badge components
interface HealthStatusBadgeProps {
  status: "healthy" | "warning" | "danger" | "info"
  children: React.ReactNode
  className?: string
}

function HealthStatusBadge({ status, children, className }: HealthStatusBadgeProps) {
  return (
    <Badge variant={status} className={className}>
      {children}
    </Badge>
  )
}

interface BMIBadgeProps {
  bmi: number
  className?: string
}

function BMIBadge({ bmi, className }: BMIBadgeProps) {
  let variant: "underweight" | "normal" | "overweight" | "obese"
  let label: string
  
  if (bmi < 18.5) {
    variant = "underweight"
    label = "Underweight"
  } else if (bmi < 25) {
    variant = "normal"
    label = "Normal"
  } else if (bmi < 30) {
    variant = "overweight"
    label = "Overweight"
  } else {
    variant = "obese"
    label = "Obese"
  }
  
  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  )
}

interface SubscriptionBadgeProps {
  tier: "free" | "premium" | "professional"
  className?: string
}

function SubscriptionBadge({ tier, className }: SubscriptionBadgeProps) {
  const labels = {
    free: "Free",
    premium: "Premium",
    professional: "Professional"
  }
  
  return (
    <Badge variant={tier} className={className}>
      {labels[tier]}
    </Badge>
  )
}

interface ActivityLevelBadgeProps {
  level: "sedentary" | "light" | "moderate" | "active" | "very-active"
  className?: string
}

function ActivityLevelBadge({ level, className }: ActivityLevelBadgeProps) {
  const labels = {
    sedentary: "Sedentary",
    light: "Light Activity",
    moderate: "Moderate Activity",
    active: "Active",
    "very-active": "Very Active"
  }
  
  return (
    <Badge variant={level} className={className}>
      {labels[level]}
    </Badge>
  )
}

// Trend badge for showing health metric trends
interface TrendBadgeProps {
  trend: "up" | "down" | "stable"
  value?: string | number
  className?: string
}

function TrendBadge({ trend, value, className }: TrendBadgeProps) {
  const variants = {
    up: "healthy" as const,
    down: "danger" as const,
    stable: "info" as const
  }
  
  const icons = {
    up: "↗",
    down: "↘",
    stable: "→"
  }
  
  return (
    <Badge variant={variants[trend]} className={cn("flex items-center gap-1", className)}>
      <span>{icons[trend]}</span>
      {value && <span>{value}</span>}
    </Badge>
  )
}

// Priority badge for health alerts
interface PriorityBadgeProps {
  priority: "low" | "medium" | "high" | "critical"
  className?: string
}

function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const variants = {
    low: "info" as const,
    medium: "warning" as const,
    high: "danger" as const,
    critical: "destructive" as const
  }
  
  const labels = {
    low: "Low Priority",
    medium: "Medium Priority",
    high: "High Priority",
    critical: "Critical"
  }
  
  return (
    <Badge variant={variants[priority]} className={className}>
      {labels[priority]}
    </Badge>
  )
}

export { 
  Badge, 
  badgeVariants,
  HealthStatusBadge,
  BMIBadge,
  SubscriptionBadge,
  ActivityLevelBadge,
  TrendBadge,
  PriorityBadge
}