"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const tabsListVariants = cva(
  "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
  {
    variants: {
      variant: {
        default: "bg-muted",
        health: "bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800",
        pills: "bg-transparent p-0 gap-2",
        underline: "bg-transparent border-b border-border p-0 h-auto rounded-none",
      },
      size: {
        default: "h-10",
        sm: "h-8",
        lg: "h-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        health: "data-[state=active]:bg-green-100 data-[state=active]:text-green-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-green-800 dark:data-[state=active]:text-green-100",
        pills: "rounded-full border border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-accent hover:text-accent-foreground",
        underline: "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent hover:bg-accent/50 pb-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> &
    VariantProps<typeof tabsListVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant, size }), className)}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> &
    VariantProps<typeof tabsTriggerVariants> & {
      icon?: React.ReactNode
      badge?: React.ReactNode
    }
>(({ className, variant, icon, badge, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant }), className)}
    {...props}
  >
    <div className="flex items-center gap-2">
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {badge && <span className="flex-shrink-0">{badge}</span>}
    </div>
  </TabsPrimitive.Trigger>
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

// Health Dashboard Tabs Component
interface HealthTabsProps {
  defaultValue?: string
  className?: string
  variant?: "default" | "health" | "pills" | "underline"
  children: React.ReactNode
}

function HealthTabs({ defaultValue, className, variant = "health", children }: HealthTabsProps) {
  return (
    <Tabs defaultValue={defaultValue} className={cn("w-full", className)}>
      {children}
    </Tabs>
  )
}

// Dashboard Tabs with predefined health sections
interface DashboardTabsProps {
  className?: string
  onTabChange?: (value: string) => void
}

function DashboardTabs({ className, onTabChange }: DashboardTabsProps) {
  return (
    <HealthTabs defaultValue="overview" className={className}>
      <TabsList variant="health" className="grid w-full grid-cols-5">
        <TabsTrigger 
          value="overview" 
          variant="health"
          icon={
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        >
          Overview
        </TabsTrigger>
        <TabsTrigger 
          value="health-metrics" 
          variant="health"
          icon={
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          }
        >
          Health
        </TabsTrigger>
        <TabsTrigger 
          value="nutrition" 
          variant="health"
          icon={
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          }
        >
          Nutrition
        </TabsTrigger>
        <TabsTrigger 
          value="fitness" 
          variant="health"
          icon={
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        >
          Fitness
        </TabsTrigger>
        <TabsTrigger 
          value="reports" 
          variant="health"
          icon={
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        >
          Reports
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        {/* Overview content will be populated by parent component */}
      </TabsContent>
      
      <TabsContent value="health-metrics" className="space-y-4">
        {/* Health metrics content will be populated by parent component */}
      </TabsContent>
      
      <TabsContent value="nutrition" className="space-y-4">
        {/* Nutrition content will be populated by parent component */}
      </TabsContent>
      
      <TabsContent value="fitness" className="space-y-4">
        {/* Fitness content will be populated by parent component */}
      </TabsContent>
      
      <TabsContent value="reports" className="space-y-4">
        {/* Reports content will be populated by parent component */}
      </TabsContent>
    </HealthTabs>
  )
}

// Settings Tabs
function SettingsTabs({ className }: { className?: string }) {
  return (
    <HealthTabs defaultValue="profile" className={className}>
      <TabsList variant="underline" className="w-full justify-start">
        <TabsTrigger value="profile" variant="underline">
          Profile
        </TabsTrigger>
        <TabsTrigger value="health" variant="underline">
          Health Info
        </TabsTrigger>
        <TabsTrigger value="preferences" variant="underline">
          Preferences
        </TabsTrigger>
        <TabsTrigger value="privacy" variant="underline">
          Privacy
        </TabsTrigger>
        <TabsTrigger value="notifications" variant="underline">
          Notifications
        </TabsTrigger>
        <TabsTrigger value="subscription" variant="underline">
          Subscription
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile">
        {/* Profile settings content */}
      </TabsContent>
      
      <TabsContent value="health">
        {/* Health information content */}
      </TabsContent>
      
      <TabsContent value="preferences">
        {/* Preferences content */}
      </TabsContent>
      
      <TabsContent value="privacy">
        {/* Privacy settings content */}
      </TabsContent>
      
      <TabsContent value="notifications">
        {/* Notification settings content */}
      </TabsContent>
      
      <TabsContent value="subscription">
        {/* Subscription management content */}
      </TabsContent>
    </HealthTabs>
  )
}

// Meal Planning Tabs
function MealPlanningTabs({ className }: { className?: string }) {
  return (
    <HealthTabs defaultValue="today" className={className}>
      <TabsList variant="pills">
        <TabsTrigger value="today" variant="pills">
          Today
        </TabsTrigger>
        <TabsTrigger value="week" variant="pills">
          This Week
        </TabsTrigger>
        <TabsTrigger value="recipes" variant="pills">
          Recipes
        </TabsTrigger>
        <TabsTrigger value="shopping" variant="pills">
          Shopping List
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="today">
        {/* Today's meals content */}
      </TabsContent>
      
      <TabsContent value="week">
        {/* Weekly meal plan content */}
      </TabsContent>
      
      <TabsContent value="recipes">
        {/* Recipe browser content */}
      </TabsContent>
      
      <TabsContent value="shopping">
        {/* Shopping list content */}
      </TabsContent>
    </HealthTabs>
  )
}

// Health Calculator Tabs
function HealthCalculatorTabs({ className }: { className?: string }) {
  return (
    <HealthTabs defaultValue="bmi" className={className}>
      <TabsList variant="health" className="grid w-full grid-cols-4">
        <TabsTrigger value="bmi" variant="health">
          BMI
        </TabsTrigger>
        <TabsTrigger value="tdee" variant="health">
          TDEE
        </TabsTrigger>
        <TabsTrigger value="body-fat" variant="health">
          Body Fat
        </TabsTrigger>
        <TabsTrigger value="water" variant="health">
          Water Intake
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="bmi">
        {/* BMI calculator content */}
      </TabsContent>
      
      <TabsContent value="tdee">
        {/* TDEE calculator content */}
      </TabsContent>
      
      <TabsContent value="body-fat">
        {/* Body fat calculator content */}
      </TabsContent>
      
      <TabsContent value="water">
        {/* Water intake calculator content */}
      </TabsContent>
    </HealthTabs>
  )
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  HealthTabs,
  DashboardTabs,
  SettingsTabs,
  MealPlanningTabs,
  HealthCalculatorTabs,
}