"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const progressVariants = cva(
  "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
  {
    variants: {
      variant: {
        default: "bg-secondary",
        health: "bg-green-100 dark:bg-green-900/20",
        warning: "bg-yellow-100 dark:bg-yellow-900/20",
        danger: "bg-red-100 dark:bg-red-900/20",
        info: "bg-blue-100 dark:bg-blue-900/20",
      },
      size: {
        default: "h-4",
        sm: "h-2",
        lg: "h-6",
        xl: "h-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const progressIndicatorVariants = cva(
  "h-full w-full flex-1 bg-primary transition-all",
  {
    variants: {
      variant: {
        default: "bg-primary",
        health: "bg-green-600 dark:bg-green-400",
        warning: "bg-yellow-600 dark:bg-yellow-400",
        danger: "bg-red-600 dark:bg-red-400",
        info: "bg-blue-600 dark:bg-blue-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  showValue?: boolean
  formatValue?: (value: number) => string
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, variant, size, showValue = false, formatValue, ...props }, ref) => {
  const displayValue = formatValue ? formatValue(value || 0) : `${Math.round(value || 0)}%`
  
  return (
    <div className="relative">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(progressVariants({ variant, size }), className)}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(progressIndicatorVariants({ variant }))}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-foreground">
            {displayValue}
          </span>
        </div>
      )}
    </div>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

// Health-specific progress components
interface HealthMetricProgressProps {
  label: string
  value: number
  target: number
  unit?: string
  variant?: "health" | "warning" | "danger" | "info"
  className?: string
  showTarget?: boolean
}

function HealthMetricProgress({
  label,
  value,
  target,
  unit = "",
  variant = "health",
  className,
  showTarget = true
}: HealthMetricProgressProps) {
  const percentage = Math.min((value / target) * 100, 100)
  const isOverTarget = value > target
  const displayVariant = isOverTarget ? "warning" : variant
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {value}{unit}
          {showTarget && ` / ${target}${unit}`}
        </span>
      </div>
      <Progress
        value={percentage}
        variant={displayVariant}
        className="h-2"
      />
      {isOverTarget && (
        <p className="text-xs text-yellow-600 dark:text-yellow-400">
          Target exceeded by {Math.round(((value - target) / target) * 100)}%
        </p>
      )}
    </div>
  )
}

// BMI Progress with ranges
interface BMIProgressProps {
  bmi: number
  className?: string
}

function BMIProgress({ bmi, className }: BMIProgressProps) {
  // BMI ranges: Underweight (<18.5), Normal (18.5-24.9), Overweight (25-29.9), Obese (≥30)
  const getVariantAndPosition = (bmi: number) => {
    if (bmi < 18.5) {
      return { variant: "info" as const, position: (bmi / 18.5) * 25 }
    } else if (bmi < 25) {
      return { variant: "health" as const, position: 25 + ((bmi - 18.5) / 6.5) * 25 }
    } else if (bmi < 30) {
      return { variant: "warning" as const, position: 50 + ((bmi - 25) / 5) * 25 }
    } else {
      return { variant: "danger" as const, position: Math.min(75 + ((bmi - 30) / 10) * 25, 100) }
    }
  }
  
  const { variant, position } = getVariantAndPosition(bmi)
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">BMI</span>
        <span className="text-muted-foreground">{bmi.toFixed(1)}</span>
      </div>
      <div className="relative">
        <div className="h-4 w-full rounded-full bg-gradient-to-r from-blue-200 via-green-200 via-yellow-200 to-red-200 dark:from-blue-900/40 dark:via-green-900/40 dark:via-yellow-900/40 dark:to-red-900/40" />
        <div 
          className="absolute top-0 h-4 w-1 bg-foreground rounded-full transition-all duration-300"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Underweight</span>
        <span>Normal</span>
        <span>Overweight</span>
        <span>Obese</span>
      </div>
    </div>
  )
}

// Calorie Progress with daily goals
interface CalorieProgressProps {
  consumed: number
  target: number
  burned?: number
  className?: string
}

function CalorieProgress({ consumed, target, burned = 0, className }: CalorieProgressProps) {
  const netCalories = consumed - burned
  const percentage = (netCalories / target) * 100
  const remaining = Math.max(target - netCalories, 0)
  
  const getVariant = () => {
    if (percentage < 80) return "info"
    if (percentage <= 100) return "health"
    if (percentage <= 120) return "warning"
    return "danger"
  }
  
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Daily Calories</h3>
        <span className="text-sm text-muted-foreground">
          {remaining > 0 ? `${remaining} remaining` : `${Math.abs(remaining)} over`}
        </span>
      </div>
      
      <Progress
        value={Math.min(percentage, 100)}
        variant={getVariant()}
        showValue
        formatValue={() => `${netCalories}/${target}`}
      />
      
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <div className="font-medium text-green-600">{consumed}</div>
          <div className="text-muted-foreground">Consumed</div>
        </div>
        <div className="text-center">
          <div className="font-medium text-red-600">{burned}</div>
          <div className="text-muted-foreground">Burned</div>
        </div>
        <div className="text-center">
          <div className="font-medium">{netCalories}</div>
          <div className="text-muted-foreground">Net</div>
        </div>
      </div>
    </div>
  )
}

// Water intake progress
interface WaterProgressProps {
  consumed: number // in ml
  target: number // in ml
  className?: string
}

function WaterProgress({ consumed, target, className }: WaterProgressProps) {
  const percentage = (consumed / target) * 100
  const glasses = Math.floor(consumed / 250) // Assuming 250ml per glass
  const targetGlasses = Math.floor(target / 250)
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Water Intake</span>
        <span className="text-muted-foreground">
          {glasses}/{targetGlasses} glasses
        </span>
      </div>
      <Progress
        value={Math.min(percentage, 100)}
        variant="info"
        className="h-3"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{consumed}ml</span>
        <span>{target}ml</span>
      </div>
    </div>
  )
}

// Steps progress
interface StepsProgressProps {
  steps: number
  target: number
  className?: string
}

function StepsProgress({ steps, target, className }: StepsProgressProps) {
  const percentage = (steps / target) * 100
  const remaining = Math.max(target - steps, 0)
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Daily Steps</span>
        <span className="text-muted-foreground">
          {remaining > 0 ? `${remaining.toLocaleString()} to go` : 'Goal reached!'}
        </span>
      </div>
      <Progress
        value={Math.min(percentage, 100)}
        variant={percentage >= 100 ? "health" : "info"}
        showValue
        formatValue={() => `${steps.toLocaleString()}/${target.toLocaleString()}`}
      />
    </div>
  )
}

export { 
  Progress,
  HealthMetricProgress,
  BMIProgress,
  CalorieProgress,
  WaterProgress,
  StepsProgress
}