import * as React from "react"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: "default" | "health" | "search"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, helperText, leftIcon, rightIcon, variant = "default", ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const isPassword = type === "password"
    const inputType = isPassword && showPassword ? "text" : type
    
    const variants = {
      default: "border-input",
      health: "border-primary/30 focus:border-primary focus:ring-primary/20",
      search: "border-muted bg-muted/50 focus:bg-background"
    }
    
    const inputElement = (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        <input
          type={inputType}
          className={cn(
            "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            variants[variant],
            leftIcon && "pl-10",
            (rightIcon || isPassword) && "pr-10",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
        {rightIcon && !isPassword && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {rightIcon}
          </div>
        )}
      </div>
    )
    
    if (label || error || helperText) {
      return (
        <div className="form-field">
          {label && (
            <label className="form-label">
              {label}
              {props.required && <span className="text-destructive ml-1">*</span>}
            </label>
          )}
          {inputElement}
          {error && (
            <p className="form-error">{error}</p>
          )}
          {helperText && !error && (
            <p className="form-help">{helperText}</p>
          )}
        </div>
      )
    }
    
    return inputElement
  }
)
Input.displayName = "Input"

// Specialized input components for health data
const NumberInput = React.forwardRef<
  HTMLInputElement,
  Omit<InputProps, "type"> & {
    min?: number
    max?: number
    step?: number
    unit?: string
  }
>(({ unit, className, ...props }, ref) => {
  return (
    <div className="relative">
      <Input
        type="number"
        className={cn(unit && "pr-12", className)}
        ref={ref}
        {...props}
      />
      {unit && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          {unit}
        </div>
      )}
    </div>
  )
})
NumberInput.displayName = "NumberInput"

const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        type="search"
        variant="search"
        className={cn("pl-10", className)}
        leftIcon={
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        }
        ref={ref}
        {...props}
      />
    )
  }
)
SearchInput.displayName = "SearchInput"

// Health metric input with validation
const HealthMetricInput = React.forwardRef<
  HTMLInputElement,
  Omit<InputProps, "type"> & {
    metric: "weight" | "height" | "bmi" | "bloodPressure" | "heartRate" | "temperature" | "bloodSugar"
    unit?: string
  }
>(({ metric, unit, ...props }, ref) => {
  const getMetricConfig = (metric: string) => {
    const configs = {
      weight: { min: 20, max: 300, step: 0.1, defaultUnit: "kg" },
      height: { min: 50, max: 250, step: 1, defaultUnit: "cm" },
      bmi: { min: 10, max: 50, step: 0.1, defaultUnit: "" },
      bloodPressure: { min: 50, max: 250, step: 1, defaultUnit: "mmHg" },
      heartRate: { min: 30, max: 200, step: 1, defaultUnit: "bpm" },
      temperature: { min: 35, max: 42, step: 0.1, defaultUnit: "°C" },
      bloodSugar: { min: 50, max: 400, step: 1, defaultUnit: "mg/dL" }
    }
    return configs[metric as keyof typeof configs] || {}
  }
  
  const config = getMetricConfig(metric)
  const displayUnit = unit || config.defaultUnit
  
  return (
    <NumberInput
      variant="health"
      min={config.min}
      max={config.max}
      step={config.step}
      unit={displayUnit}
      ref={ref}
      {...props}
    />
  )
})
HealthMetricInput.displayName = "HealthMetricInput"

export { Input, NumberInput, SearchInput, HealthMetricInput }