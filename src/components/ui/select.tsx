"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    variant?: "default" | "health" | "outline"
  }
>(({ className, children, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "border-input bg-background hover:bg-accent hover:text-accent-foreground",
    health: "border-green-200 bg-green-50/50 hover:bg-green-100/50 focus:border-green-500 focus:ring-green-500/20",
    outline: "border-2 border-muted bg-transparent hover:bg-accent hover:text-accent-foreground"
  }
  
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
})
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    icon?: React.ReactNode
    description?: string
  }
>(({ className, children, icon, description, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    
    <div className="flex items-center gap-2 flex-1">
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <div className="flex-1">
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        {description && (
          <div className="text-xs text-muted-foreground mt-0.5">
            {description}
          </div>
        )}
      </div>
    </div>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

// Health-specific select components
interface HealthSelectProps {
  label?: string
  placeholder?: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
  onValueChange?: (value: string) => void
  value?: string
  disabled?: boolean
}

function HealthSelect({
  label,
  placeholder,
  error,
  required,
  children,
  className,
  ...props
}: HealthSelectProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Select {...props}>
        <SelectTrigger variant="health" className={error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {children}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}

// Gender select
function GenderSelect({ ...props }: Omit<HealthSelectProps, 'children'>) {
  return (
    <HealthSelect {...props}>
      <SelectItem value="male">Male</SelectItem>
      <SelectItem value="female">Female</SelectItem>
      <SelectItem value="other">Other</SelectItem>
      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
    </HealthSelect>
  )
}

// Activity level select
function ActivityLevelSelect({ ...props }: Omit<HealthSelectProps, 'children'>) {
  return (
    <HealthSelect {...props}>
      <SelectItem 
        value="sedentary" 
        description="Little or no exercise"
      >
        Sedentary
      </SelectItem>
      <SelectItem 
        value="light" 
        description="Light exercise 1-3 days/week"
      >
        Lightly Active
      </SelectItem>
      <SelectItem 
        value="moderate" 
        description="Moderate exercise 3-5 days/week"
      >
        Moderately Active
      </SelectItem>
      <SelectItem 
        value="active" 
        description="Hard exercise 6-7 days/week"
      >
        Very Active
      </SelectItem>
      <SelectItem 
        value="very-active" 
        description="Very hard exercise, physical job"
      >
        Extremely Active
      </SelectItem>
    </HealthSelect>
  )
}

// Health goal select
function HealthGoalSelect({ ...props }: Omit<HealthSelectProps, 'children'>) {
  return (
    <HealthSelect {...props}>
      <SelectItem value="lose-weight">Lose Weight</SelectItem>
      <SelectItem value="maintain-weight">Maintain Weight</SelectItem>
      <SelectItem value="gain-weight">Gain Weight</SelectItem>
      <SelectItem value="build-muscle">Build Muscle</SelectItem>
      <SelectItem value="improve-fitness">Improve Fitness</SelectItem>
      <SelectItem value="manage-condition">Manage Health Condition</SelectItem>
    </HealthSelect>
  )
}

// Diet preference select
function DietPreferenceSelect({ ...props }: Omit<HealthSelectProps, 'children'>) {
  return (
    <HealthSelect {...props}>
      <SelectItem value="none">No Restrictions</SelectItem>
      <SelectItem value="vegetarian">Vegetarian</SelectItem>
      <SelectItem value="vegan">Vegan</SelectItem>
      <SelectItem value="halal">Halal</SelectItem>
      <SelectItem value="kosher">Kosher</SelectItem>
      <SelectItem value="keto">Ketogenic</SelectItem>
      <SelectItem value="paleo">Paleo</SelectItem>
      <SelectItem value="mediterranean">Mediterranean</SelectItem>
      <SelectItem value="gluten-free">Gluten-Free</SelectItem>
      <SelectItem value="dairy-free">Dairy-Free</SelectItem>
    </HealthSelect>
  )
}

// Language select
function LanguageSelect({ ...props }: Omit<HealthSelectProps, 'children'>) {
  return (
    <HealthSelect {...props}>
      <SelectItem value="en">🇺🇸 English</SelectItem>
      <SelectItem value="es">🇪🇸 Español</SelectItem>
      <SelectItem value="fr">🇫🇷 Français</SelectItem>
      <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
      <SelectItem value="ar">🇸🇦 العربية</SelectItem>
      <SelectItem value="ja">🇯🇵 日本語</SelectItem>
      <SelectItem value="zh">🇨🇳 中文</SelectItem>
      <SelectItem value="hi">🇮🇳 हिन्दी</SelectItem>
    </HealthSelect>
  )
}

// Time zone select (common ones)
function TimeZoneSelect({ ...props }: Omit<HealthSelectProps, 'children'>) {
  return (
    <HealthSelect {...props}>
      <SelectGroup>
        <SelectLabel>Americas</SelectLabel>
        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
      </SelectGroup>
      <SelectSeparator />
      <SelectGroup>
        <SelectLabel>Europe</SelectLabel>
        <SelectItem value="Europe/London">London (GMT)</SelectItem>
        <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
        <SelectItem value="Europe/Berlin">Berlin (CET)</SelectItem>
        <SelectItem value="Europe/Rome">Rome (CET)</SelectItem>
      </SelectGroup>
      <SelectSeparator />
      <SelectGroup>
        <SelectLabel>Asia</SelectLabel>
        <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
        <SelectItem value="Asia/Shanghai">Shanghai (CST)</SelectItem>
        <SelectItem value="Asia/Kolkata">Mumbai (IST)</SelectItem>
        <SelectItem value="Asia/Dubai">Dubai (GST)</SelectItem>
      </SelectGroup>
    </HealthSelect>
  )
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  HealthSelect,
  GenderSelect,
  ActivityLevelSelect,
  HealthGoalSelect,
  DietPreferenceSelect,
  LanguageSelect,
  TimeZoneSelect,
}