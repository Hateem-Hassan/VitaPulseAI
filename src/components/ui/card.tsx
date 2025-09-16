import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "health" | "gradient" | "glass"
    hover?: boolean
  }
>(({ className, variant = "default", hover = false, ...props }, ref) => {
  const variants = {
    default: "bg-card text-card-foreground",
    health: "bg-card text-card-foreground shadow-health border-primary/20",
    gradient: "bg-gradient-to-br from-primary/5 to-secondary/5 text-card-foreground border-primary/20",
    glass: "glass-effect text-card-foreground border-white/20"
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border shadow-sm",
        variants[variant],
        hover && "health-card-hover cursor-pointer",
        className
      )}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  }
>(({ className, as: Comp = "h3", ...props }, ref) => (
  <Comp
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Health-specific card components
const HealthMetricCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title: string
    value: string | number
    unit?: string
    trend?: "up" | "down" | "neutral"
    trendValue?: string
    status?: "excellent" | "good" | "fair" | "poor"
    icon?: React.ReactNode
  }
>(({ className, title, value, unit, trend, trendValue, status, icon, ...props }, ref) => {
  const statusColors = {
    excellent: "text-green-600 bg-green-50 border-green-200",
    good: "text-blue-600 bg-blue-50 border-blue-200",
    fair: "text-yellow-600 bg-yellow-50 border-yellow-200",
    poor: "text-red-600 bg-red-50 border-red-200"
  }
  
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600"
  }
  
  return (
    <Card
      ref={ref}
      variant="health"
      hover
      className={cn(
        "metric-card",
        status && statusColors[status],
        className
      )}
      {...props}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="metric-label">{title}</p>
            <div className="flex items-baseline space-x-1">
              <span className="metric-value">{value}</span>
              {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
            </div>
            {trend && trendValue && (
              <div className={cn("metric-trend", trend && trendColors[trend])}>
                <span className="text-xs">
                  {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"}
                </span>
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          {icon && (
            <div className="text-2xl opacity-60">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
})
HealthMetricCard.displayName = "HealthMetricCard"

// Progress card for health goals
const ProgressCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title: string
    progress: number
    target?: number
    unit?: string
    color?: "blue" | "green" | "yellow" | "red"
  }
>(({ className, title, progress, target, unit, color = "blue", ...props }, ref) => {
  const percentage = target ? Math.min((progress / target) * 100, 100) : 0
  
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500"
  }
  
  return (
    <Card ref={ref} variant="health" className={cn(className)} {...props}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{title}</h4>
            <span className="text-sm text-muted-foreground">
              {progress}{unit} {target && `/ ${target}${unit}`}
            </span>
          </div>
          <div className="progress-bar">
            <div
              className={cn("progress-fill", colorClasses[color])}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {percentage.toFixed(0)}% complete
          </p>
        </div>
      </CardContent>
    </Card>
  )
})
ProgressCard.displayName = "ProgressCard"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  HealthMetricCard,
  ProgressCard,
}